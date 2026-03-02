import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { UserCircle } from "lucide-react";
import { DataPoint } from "../data/sampleData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import html2canvas from "html2canvas";
import { toast } from "sonner@2.0.3";
import ascanLogo from "figma:asset/7f85546267071cda45da22957d2763990ea2084a.png";

interface IndividualReportDialogProps {
  data: DataPoint[];
  filters: {
    month: string;
    year: string;
  };
}

export function IndividualReportDialog({ data, filters }: IndividualReportDialogProps) {
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>("");
  const reportRef = useRef<HTMLDivElement>(null);

  // Get unique salespeople
  const salespeople = Array.from(new Set(data.map(d => d.category))).sort();

  // Filter data for selected salesperson
  const personData = data.filter(d => d.category === selectedSalesperson);
  const totalSales = personData.reduce((sum, item) => sum + item.sales, 0);
  const totalRevenue = personData.reduce((sum, item) => sum + item.revenue, 0);
  const totalContracts = personData.length;
  const unit = personData[0]?.region || 'N/A';

  // Calculate rank
  const salesByPerson = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.sales;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedPeople = Object.entries(salesByPerson)
    .sort(([, a], [, b]) => b - a)
    .map(([name]) => name);
  
  const rank = sortedPeople.indexOf(selectedSalesperson) + 1;

  // Recent sales
  const recentSales = [...personData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Sales by month
  const salesByMonth = personData.reduce((acc, item) => {
    const monthKey = `${item.month}/${item.year}`;
    acc[monthKey] = (acc[monthKey] || 0) + item.sales;
    return acc;
  }, {} as Record<string, number>);

  // Unit stats
  const unitData = data.filter(d => d.region === unit);
  const unitTotal = unitData.reduce((sum, d) => sum + d.sales, 0);
  const percentOfUnit = unitTotal > 0 ? ((totalSales / unitTotal) * 100).toFixed(1) : "0";

  const meta = 100;
  const percentOfMeta = ((totalSales / meta) * 100).toFixed(1);

  const handleDownloadReport = async () => {
    if (!reportRef.current || !selectedSalesperson) {
      toast.error("Selecione um vendedor primeiro!");
      return;
    }
    
    try {
      toast.info(`Gerando relatório de ${selectedSalesperson}...`);
      
      // Show the hidden element temporarily
      const element = reportRef.current;
      element.style.display = 'block';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '0';
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#1e293b',
        scale: 2,
        logging: false,
        width: 1200,
        height: element.scrollHeight,
      });
      
      // Hide it again
      element.style.display = 'none';
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Relatorio_Individual_${selectedSalesperson.replace(/\s+/g, '_')}_${filters.month}_${filters.year}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.png`;
      link.click();
      
      toast.success(`Relatório de ${selectedSalesperson} baixado!`);
    } catch (error) {
      toast.error("Erro ao gerar relatório.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
          <SelectTrigger className="w-[250px] bg-[#1e293b] border-white/10 text-white">
            <SelectValue placeholder="Selecione um vendedor" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e293b] border-white/10 text-white">
            {salespeople.map(person => (
              <SelectItem key={person} value={person}>{person}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={handleDownloadReport}
          disabled={!selectedSalesperson}
          className="bg-purple-500 hover:bg-purple-600 text-white gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserCircle className="w-4 h-4" />
          Relatório Individual
        </Button>
      </div>

      {/* Hidden Report Template */}
      {selectedSalesperson && (
        <div ref={reportRef} style={{ display: 'none' }} className="w-[1200px] bg-[#1e293b] p-8 rounded-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg p-2">
                <img src={ascanLogo} alt="Ascan Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white uppercase">Relatório Individual</h1>
                <p className="text-gray-400 mt-1">
                  {filters.month === 'all' ? 'Período Completo' : filters.month} {filters.year} • Gerado em {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Sistema Ascan</div>
              <div className="text-xs text-gray-500">Relatório Comercial</div>
            </div>
          </div>

          {/* Salesperson Profile */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {selectedSalesperson.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-white">{selectedSalesperson}</h2>
                  <span className="px-4 py-1.5 bg-yellow-500/20 text-yellow-400 text-sm font-bold rounded-full border border-yellow-500/30 flex items-center gap-2">
                    🏆 Rank #{rank}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    📍 {unit}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{totalContracts} contratos registrados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#0f172a] p-6 rounded-xl border border-green-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <div className="text-green-400 text-2xl">📈</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-medium">Total Vendas</div>
                  <div className="text-2xl font-bold text-white">{totalSales}</div>
                </div>
              </div>
              <div className="text-xs text-green-400">Vendas Realizadas</div>
            </div>

            <div className="bg-[#0f172a] p-6 rounded-xl border border-orange-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <div className="text-orange-400 text-2xl">💰</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-medium">Valor Total</div>
                  <div className="text-2xl font-bold text-white">R$ {totalRevenue.toLocaleString()}</div>
                </div>
              </div>
              <div className="text-xs text-orange-400">Faturamento</div>
            </div>

            <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <div className="text-blue-400 text-2xl">🎯</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-medium">% da Meta</div>
                  <div className="text-2xl font-bold text-white">{percentOfMeta}%</div>
                </div>
              </div>
              <div className="text-xs text-blue-400">Atingimento</div>
            </div>

            <div className="bg-[#0f172a] p-6 rounded-xl border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <div className="text-purple-400 text-2xl">🏆</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-medium">% Unidade</div>
                  <div className="text-2xl font-bold text-white">{percentOfUnit}%</div>
                </div>
              </div>
              <div className="text-xs text-purple-400">Contribuição</div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-[#0f172a] p-6 rounded-xl border border-white/10">
            <h3 className="text-sm font-semibold text-white uppercase mb-4 flex items-center gap-2">
              📊 Desempenho de Vendas
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-gray-400">Progresso da Meta Individual</span>
                  <span className="text-white font-semibold">{totalSales} / {meta}</span>
                </div>
                <div className="w-full h-6 bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${Math.min(100, (totalSales / meta) * 100)}%` }}
                  >
                    <span className="text-xs font-bold text-white">{percentOfMeta}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-gray-400">Contribuição na Unidade</span>
                  <span className="text-white font-semibold">{totalSales} / {unitTotal}</span>
                </div>
                <div className="w-full h-6 bg-gray-700/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${percentOfUnit}%` }}
                  >
                    <span className="text-xs font-bold text-white">{percentOfUnit}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales by Month */}
          {Object.keys(salesByMonth).length > 0 && (
            <div className="bg-[#0f172a] p-6 rounded-xl border border-white/10">
              <h3 className="text-sm font-semibold text-white uppercase mb-4 flex items-center gap-2">
                📅 Vendas por Mês
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(salesByMonth).map(([month, sales]) => (
                  <div key={month} className="flex items-center justify-between p-3 bg-[#1e293b] rounded-lg border border-white/5">
                    <span className="text-sm font-medium text-gray-300">{month}</span>
                    <span className="text-lg font-bold text-white">{sales}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Sales */}
          <div className="bg-[#0f172a] p-6 rounded-xl border border-white/10">
            <h3 className="text-sm font-semibold text-white uppercase mb-4 flex items-center gap-2">
              📅 Histórico Detalhado de Vendas
            </h3>
            <div className="space-y-2">
              {recentSales.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma venda registrada no período
                </div>
              ) : (
                recentSales.map((sale, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#1e293b] rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                        <span className="text-green-400 font-bold text-sm">{idx + 1}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {new Date(sale.date).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500">{sale.region}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">+{sale.sales} venda(s)</div>
                      <div className="text-xs text-gray-400">R$ {sale.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#0f172a] p-4 rounded-lg border border-white/10 text-center">
              <div className="text-xs text-gray-400 mb-1 uppercase">Ticket Médio</div>
              <div className="text-2xl font-bold text-white">
                R$ {totalSales > 0 ? (totalRevenue / totalSales).toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
              </div>
            </div>
            <div className="bg-[#0f172a] p-4 rounded-lg border border-white/10 text-center">
              <div className="text-xs text-gray-400 mb-1 uppercase">Total Contratos</div>
              <div className="text-2xl font-bold text-white">{totalContracts}</div>
            </div>
            <div className="bg-[#0f172a] p-4 rounded-lg border border-white/10 text-center">
              <div className="text-xs text-gray-400 mb-1 uppercase">Ranking Geral</div>
              <div className="text-2xl font-bold text-white">#{rank}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-white/10 text-center">
            <div className="text-xs text-gray-500">
              Relatório Individual • {selectedSalesperson} • Sistema Ascan • {new Date().toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Este documento é confidencial e destinado exclusivamente para uso interno
            </div>
          </div>
        </div>
      )}
    </>
  );
}
