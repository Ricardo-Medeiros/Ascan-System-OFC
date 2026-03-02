import { useRef } from "react";
import { Button } from "./ui/button";
import { FileDown } from "lucide-react";
import { DataPoint } from "../data/sampleData";
import html2canvas from "html2canvas";
import { toast } from "sonner@2.0.3";
import ascanLogo from "figma:asset/7f85546267071cda45da22957d2763990ea2084a.png";

interface GeneralReportDialogProps {
  data: DataPoint[];
  filters: {
    month: string;
    year: string;
  };
}

export function GeneralReportDialog({ data, filters }: GeneralReportDialogProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  // Calculate general metrics
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalContracts = data.length;
  const meta = 100;
  const progress = Math.min(100, (totalSales / meta) * 100);

  // Sales by salesperson
  const salesBySalesperson = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {
        name: item.category,
        sales: 0,
        revenue: 0,
        contracts: 0,
        unit: item.region
      };
    }
    acc[item.category].sales += item.sales;
    acc[item.category].revenue += item.revenue;
    acc[item.category].contracts += 1;
    return acc;
  }, {} as Record<string, any>);

  const salesData = Object.values(salesBySalesperson).sort((a: any, b: any) => b.sales - a.sales);

  // Sales by unit
  const salesByUnit = data.reduce((acc, item) => {
    acc[item.region] = (acc[item.region] || 0) + item.sales;
    return acc;
  }, {} as Record<string, number>);

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;
    
    try {
      toast.info("Gerando relatório geral...");
      
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
      link.download = `Relatorio_Geral_Vendas_${filters.month}_${filters.year}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.png`;
      link.click();
      
      toast.success("Relatório geral baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar relatório.");
      console.error(error);
    }
  };

  return (
    <>
      <Button 
        onClick={handleDownloadReport}
        className="bg-blue-500 hover:bg-blue-600 text-white gap-2 shadow-lg shadow-blue-500/20"
      >
        <FileDown className="w-4 h-4" />
        Relatório Geral
      </Button>

      {/* Hidden Report Template */}
      <div ref={reportRef} style={{ display: 'none' }} className="w-[1200px] bg-[#1e293b] p-8 rounded-2xl space-y-6">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg p-2">
              <img src={ascanLogo} alt="Ascan Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white uppercase">Relatório Geral de Vendas</h1>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <div className="text-blue-400 text-2xl">🎯</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase font-medium">Meta</div>
                <div className="text-2xl font-bold text-white">{meta}</div>
              </div>
            </div>
            <div className="text-xs text-blue-400">Objetivo de Vendas</div>
          </div>

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
            <div className="text-xs text-orange-400">Faturamento Estimado</div>
          </div>

          <div className="bg-[#0f172a] p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <div className="text-purple-400 text-2xl">🏆</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase font-medium">Progresso</div>
                <div className="text-2xl font-bold text-white">{progress.toFixed(1)}%</div>
              </div>
            </div>
            <div className="text-xs text-purple-400">Da Meta Atingida</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#0f172a] p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white uppercase">Progresso da Meta</h3>
            <span className="text-sm text-gray-400">{totalSales} / {meta} vendas</span>
          </div>
          <div className="w-full h-4 bg-gray-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-green-400 font-medium">✓ Realizado: {totalSales}</span>
            <span className="text-red-400 font-medium">Faltam: {Math.max(0, meta - totalSales)}</span>
          </div>
        </div>

        {/* Performance by Unit */}
        <div className="bg-[#0f172a] p-6 rounded-xl border border-white/10">
          <h3 className="text-sm font-semibold text-white uppercase mb-4 flex items-center gap-2">
            📍 Desempenho por Unidade
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(salesByUnit).map(([unit, sales]) => (
              <div key={unit} className="flex items-center justify-between p-4 bg-[#1e293b] rounded-lg border border-white/5">
                <span className="text-sm font-medium text-gray-300">{unit}</span>
                <span className="text-lg font-bold text-white">{sales} vendas</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Sales Table */}
        <div className="bg-[#0f172a] p-6 rounded-xl border border-white/10">
          <h3 className="text-sm font-semibold text-white uppercase mb-4 flex items-center gap-2">
            👥 Desempenho Individual dos Vendedores
          </h3>
          <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="w-full">
              <thead className="bg-[#0f172a]">
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Vendedor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Unidade</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Vendas</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Contratos</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Valor Total</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">% Meta</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((person: any, index: number) => (
                  <tr key={person.name} className="border-b border-white/5">
                    <td className="px-4 py-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        index === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' :
                        index === 2 ? 'bg-orange-700/20 text-orange-400 border border-orange-700/30' :
                        'bg-white/5 text-gray-400'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-white">{person.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{person.unit}</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-orange-400">{person.sales}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-300">{person.contracts}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-white">R$ {person.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-green-400">
                      {((person.sales / meta) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#0f172a]">
                <tr className="border-t-2 border-orange-500/30">
                  <td colSpan={3} className="px-4 py-4 text-sm font-bold text-white uppercase">TOTAL GERAL</td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-orange-400">{totalSales}</td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-white">{totalContracts}</td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-white">R$ {totalRevenue.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-sm font-bold text-green-400">{progress.toFixed(1)}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0f172a] p-4 rounded-lg border border-white/10 text-center">
            <div className="text-xs text-gray-400 mb-1">Total de Vendedores</div>
            <div className="text-2xl font-bold text-white">{salesData.length}</div>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-lg border border-white/10 text-center">
            <div className="text-xs text-gray-400 mb-1">Ticket Médio</div>
            <div className="text-2xl font-bold text-white">R$ {totalSales > 0 ? (totalRevenue / totalSales).toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}</div>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-lg border border-white/10 text-center">
            <div className="text-xs text-gray-400 mb-1">Unidades Ativas</div>
            <div className="text-2xl font-bold text-white">{Object.keys(salesByUnit).length}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/10 text-center">
          <div className="text-xs text-gray-500">
            Relatório gerado automaticamente pelo Sistema Ascan • {new Date().toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Este documento é confidencial e destinado exclusivamente para uso interno
          </div>
        </div>
      </div>
    </>
  );
}
