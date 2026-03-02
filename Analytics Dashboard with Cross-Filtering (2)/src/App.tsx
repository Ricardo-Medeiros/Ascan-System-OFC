import { useState, useMemo } from "react";
import { DashboardFilters, FilterState } from "./components/DashboardFilters";
import { SalesTrendChart } from "./components/SalesTrendChart";
import { RevenueBreakdownChart } from "./components/RevenueBreakdownChart";
import { YoYGrowthChart } from "./components/YoYGrowthChart";
import { PerformanceMetricsChart } from "./components/PerformanceMetricsChart";
import { RegionSalesChart } from "./components/RegionSalesChart";
import { SalespersonProfile } from "./components/SalespersonProfile";
import { ManageSalesDialog } from "./components/ManageSalesDialog";
import { DetailedSalesTable } from "./components/DetailedSalesTable";
import { EditSaleDialog } from "./components/EditSaleDialog";
import { LoginScreen } from "./components/LoginScreen";
import { HelpDialog } from "./components/HelpDialog";
import { GeneralReportDialog } from "./components/GeneralReportDialog";
import { IndividualReportDialog } from "./components/IndividualReportDialog";
import { sampleData as initialData, categories, regions, DataPoint } from "./data/sampleData";
import { Card, CardContent } from "./components/ui/card";
import { BarChart3, TrendingUp, Target, Filter, Award, LogOut } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { Button } from "./components/ui/button";
import ascanLogo from "figma:asset/7f85546267071cda45da22957d2763990ea2084a.png";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [viewMode, setViewMode] = useState<'charts' | 'table'>('charts');
  
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    region: "all",
    month: "Feb",
    year: new Date().getFullYear().toString()
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  // Edit State
  const [editingSale, setEditingSale] = useState<DataPoint | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Filter data based on current filters and selections
  const filteredData = useMemo(() => {
    return data.filter((item: DataPoint) => {
      const categoryMatch = filters.category === "all" || item.category === filters.category;
      const regionMatch = filters.region === "all" || item.region === filters.region;
      const monthMatch = filters.month === "all" || item.month === filters.month;
      const yearMatch = filters.year === "all" || item.year.toString() === filters.year;
      
      const selectedCategoryMatch = !selectedCategory || item.category === selectedCategory;
      const selectedRegionMatch = !selectedRegion || item.region === selectedRegion;

      return categoryMatch && regionMatch && monthMatch && yearMatch && selectedCategoryMatch && selectedRegionMatch;
    });
  }, [data, filters, selectedCategory, selectedRegion]);

  // Derived lists for Dropdowns
  const uniquePeople = useMemo(() => Array.from(new Set(data.map(d => d.category))).sort(), [data]);
  const uniqueUnits = useMemo(() => Array.from(new Set(data.map(d => d.region))).sort(), [data]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const actualTotalSales = filteredData.reduce((sum, item) => sum + item.sales, 0);
    
    const meta = 100; 
    const remaining = Math.max(0, meta - actualTotalSales);
    const progress = Math.min(100, (actualTotalSales / meta) * 100);

    return {
      totalSales: actualTotalSales,
      meta,
      remaining,
      progress
    };
  }, [filteredData]);

  const handleChartClick = (data: any) => {
    if (data.category) {
      setSelectedCategory(selectedCategory === data.category ? "" : data.category);
    }
    if (data.region) {
      setSelectedRegion(selectedRegion === data.region ? "" : data.region);
    }
  };

  const clearSelections = () => {
    setSelectedCategory("");
    setSelectedRegion("");
  };
  
  const handleExport = () => {
    try {
      const headers = ["ID", "Data", "Mês", "Ano", "Vendedor", "Unidade", "Vendas", "Receita"];
      const rows = filteredData.map(item => [
        item.id,
        item.date,
        item.month,
        item.year,
        item.category,
        item.region,
        item.sales,
        item.revenue
      ]);
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Vendas_Ascan_${filters.month}_${filters.year}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Relatório exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar dados.");
    }
  };

  // Data Management Handlers
  const handleAddSale = (newSale: { date: string; salesperson: string; unit: string; count: number }) => {
    const year = parseInt(newSale.date.split('-')[0]);
    const dateObj = new Date(newSale.date);
    const monthLong = dateObj.toLocaleString('en-US', { month: 'short' }); 
    
    const entry: DataPoint = {
      id: `${Date.now()}-${Math.random()}`,
      date: newSale.date,
      month: monthLong,
      year,
      category: newSale.salesperson,
      region: newSale.unit,
      sales: newSale.count,
      revenue: newSale.count * 1000, 
      previousYearSales: 0,
      previousYearRevenue: 0,
      units: newSale.count,
      customers: newSale.count
    };

    setData(prev => [...prev, entry]);
    toast.success("Venda registrada com sucesso!");
  };

  const handleDeleteSale = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    toast.success("Venda removida.");
  };

  const handleEditSaleTrigger = (sale: DataPoint) => {
    setEditingSale(sale);
    setIsEditOpen(true);
  };

  const handleUpdateSale = (updatedSale: DataPoint) => {
    setData(prev => prev.map(item => item.id === updatedSale.id ? updatedSale : item));
    toast.success("Venda atualizada com sucesso!");
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    toast.success("Login realizado com sucesso!");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Toaster />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] font-inter">
      <Toaster />
      <div className="w-full max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg p-2 shrink-0">
              <img src={ascanLogo} alt="Ascan Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight uppercase">
                Ranking de Vendas
              </h1>
              <p className="text-gray-300 mt-1 text-sm font-medium">
                Relatório de Performance - {filters.month === 'all' ? 'Anual' : filters.month} {filters.year}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <ManageSalesDialog 
              data={data}
              onAddSale={handleAddSale}
              onDeleteSale={handleDeleteSale}
              existingPeople={uniquePeople}
              existingUnits={uniqueUnits}
            />
            
            {(selectedCategory || selectedRegion) && (
              <button
                onClick={clearSelections}
                className="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-lg shadow-orange-500/20"
              >
                <Filter className="w-4 h-4" />
                Limpar Filtros
              </button>
            )}

            <HelpDialog />

            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-transparent border-white/20 text-white hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 gap-2"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Global Filters & Controls */}
        <DashboardFilters
          filters={filters}
          onFiltersChange={setFilters}
          categories={uniquePeople} 
          regions={uniqueUnits}
          onExport={handleExport}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Individual Profile Drilldown */}
        {selectedCategory && (
          <SalespersonProfile 
            salesperson={selectedCategory}
            data={data} // Pass all data for global context ranking
            onClose={() => setSelectedCategory("")}
          />
        )}

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-white/10 shadow-lg bg-[#1e293b]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Meta (Goal)</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {summaryMetrics.meta}
                  </p>
                  <p className="text-xs text-orange-500 mt-1 font-medium">Target Sales</p>
                </div>
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 shadow-lg bg-[#1e293b]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Realizado</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {summaryMetrics.totalSales}
                  </p>
                  <p className="text-xs text-green-500 mt-1 font-medium">Current Sales</p>
                </div>
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 shadow-lg bg-[#1e293b]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Faltam</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {summaryMetrics.remaining}
                  </p>
                  <p className="text-xs text-red-500 mt-1 font-medium">Remaining to Goal</p>
                </div>
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20">
                  <BarChart3 className="w-5 h-5 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/10 shadow-lg bg-[#1e293b]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Progresso</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {summaryMetrics.progress.toFixed(1)}%
                  </p>
                  <p className="text-xs text-purple-500 mt-1 font-medium">Of Goal Achieved</p>
                </div>
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Section */}
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                📊 Geração de Relatórios Profissionais
              </h3>
              <p className="text-sm text-gray-400">
                Baixe relatórios completos em formato PNG, ideais para compartilhamento e apresentações
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <GeneralReportDialog data={filteredData} filters={filters} />
              <IndividualReportDialog data={data} filters={filters} />
            </div>
          </div>
        </div>

        {/* Charts or Table View */}
        {viewMode === 'charts' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <SalesTrendChart
                data={filteredData}
                onDataClick={handleChartClick}
                selectedCategory={selectedCategory}
              />
              
              <RevenueBreakdownChart
                data={filteredData}
                onDataClick={handleChartClick}
                selectedCategory={selectedCategory}
              />
              
              <YoYGrowthChart
                data={filteredData}
                onDataClick={handleChartClick}
                selectedRegion={selectedRegion}
              />
              
              <PerformanceMetricsChart
                data={filteredData}
                onDataClick={handleChartClick}
              />
            </div>

            <div className="w-full">
              <RegionSalesChart
                data={filteredData}
                onDataClick={handleChartClick}
                selectedRegion={selectedRegion}
              />
            </div>
          </>
        ) : (
          <div className="w-full animate-in fade-in zoom-in-95 duration-200">
             <DetailedSalesTable 
              data={filteredData} 
              onEditSale={handleEditSaleTrigger}
              onDeleteSale={handleDeleteSale}
             />
          </div>
        )}

        <EditSaleDialog 
          sale={editingSale}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSave={handleUpdateSale}
          existingPeople={uniquePeople}
          existingUnits={uniqueUnits}
        />
      </div>
    </div>
  );
}