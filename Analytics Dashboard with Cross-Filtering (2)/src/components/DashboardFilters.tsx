import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { Filter, Calendar, MapPin, Package, Download, Table as TableIcon, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";

export interface FilterState {
  category: string;
  region: string;
  month: string;
  year: string;
}

interface DashboardFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: string[];
  regions: string[];
  onExport: () => void;
  viewMode: 'charts' | 'table';
  onViewModeChange: (mode: 'charts' | 'table') => void;
}

export function DashboardFilters({ 
  filters, 
  onFiltersChange, 
  categories, 
  regions, 
  onExport,
  viewMode,
  onViewModeChange
}: DashboardFiltersProps) {
  const months = [
    { value: 'all', label: 'Todos os Meses' },
    { value: 'Jan', label: 'Janeiro' },
    { value: 'Feb', label: 'Fevereiro' },
    { value: 'Mar', label: 'Março' },
    { value: 'Apr', label: 'Abril' },
    { value: 'May', label: 'Maio' },
    { value: 'Jun', label: 'Junho' },
    { value: 'Jul', label: 'Julho' },
    { value: 'Aug', label: 'Agosto' },
    { value: 'Sep', label: 'Setembro' },
    { value: 'Oct', label: 'Outubro' },
    { value: 'Nov', label: 'Novembro' },
    { value: 'Dec', label: 'Dezembro' },
  ];

  // Dynamic years based on current date + past years
  const currentYear = new Date().getFullYear();
  const years = [currentYear.toString(), (currentYear - 1).toString(), (currentYear - 2).toString()];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="border border-white/10 shadow-lg bg-[#1e293b]">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Filtros & Opções</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-[#0f172a] p-1 rounded-lg border border-white/10 flex">
              <button
                onClick={() => onViewModeChange('charts')}
                className={`p-2 rounded-md transition-all ${viewMode === 'charts' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                title="Visualização em Gráficos"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                title="Visualização em Tabela Detalhada"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
            
            <Button 
              variant="outline" 
              onClick={onExport}
              className="bg-[#0f172a] border-white/10 text-gray-300 hover:bg-white/5 hover:text-white hover:border-orange-500/50 transition-all gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
              <Calendar className="w-4 h-4 text-blue-400" />
              Mês
            </label>
            <Select 
              value={filters.month} 
              onValueChange={(value) => handleFilterChange('month', value)}
            >
              <SelectTrigger className="w-full bg-[#0f172a] border-gray-700 text-white focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Selecione o Mês" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border border-gray-700 text-white max-h-[200px]">
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="focus:bg-gray-700 focus:text-white">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
              <Calendar className="w-4 h-4 text-blue-400" />
              Ano
            </label>
            <Select 
              value={filters.year} 
              onValueChange={(value) => handleFilterChange('year', value)}
            >
              <SelectTrigger className="w-full bg-[#0f172a] border-gray-700 text-white focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Selecione o Ano" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border border-gray-700 text-white">
                {years.map((y) => (
                  <SelectItem key={y} value={y} className="focus:bg-gray-700 focus:text-white">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
              <Package className="w-4 h-4 text-blue-400" />
              Vendedor
            </label>
            <Select 
              value={filters.category} 
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger className="w-full bg-[#0f172a] border-gray-700 text-white focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Todos os Vendedores" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border border-gray-700 text-white">
                <SelectItem value="all" className="focus:bg-gray-700 focus:text-white">Todos os Vendedores</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="focus:bg-gray-700 focus:text-white">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
              <MapPin className="w-4 h-4 text-blue-400" />
              Unidade
            </label>
            <Select 
              value={filters.region} 
              onValueChange={(value) => handleFilterChange('region', value)}
            >
              <SelectTrigger className="w-full bg-[#0f172a] border-gray-700 text-white focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Todas as Unidades" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border border-gray-700 text-white">
                <SelectItem value="all" className="focus:bg-gray-700 focus:text-white">Todas as Unidades</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region} className="focus:bg-gray-700 focus:text-white">
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
