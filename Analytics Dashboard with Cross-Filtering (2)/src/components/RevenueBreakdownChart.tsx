import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { DataPoint } from "../data/sampleData";
import { Award, Download } from "lucide-react";
import { Button } from "./ui/button";
import html2canvas from "html2canvas";
import { toast } from "sonner@2.0.3";
import { useRef } from "react";

interface RevenueBreakdownChartProps {
  data: DataPoint[];
  onDataClick?: (data: any) => void;
  selectedCategory?: string;
}

const CHART_COLORS = [
  "#f97316", // Orange
  "#0ea5e9", // Sky Blue
  "#fdba74", // Light Orange
  "#38bdf8", // Light Blue
  "#c2410c", // Dark Orange
  "#0284c7", // Dark Blue
  "#fb923c", // Orange 400
  "#0369a1", // Sky 700
  "#ea580c", // Orange 600
];

export function RevenueBreakdownChart({ data, onDataClick, selectedCategory }: RevenueBreakdownChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  // Aggregate sales by category (Salesperson)
  const categoryData = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {
        category: item.category,
        sales: 0,
        percentage: 0
      };
    }
    acc[item.category].sales += item.sales; // Count 1 per item
    return acc;
  }, {} as Record<string, any>);

  const totalSales = Object.values(categoryData).reduce((sum: number, item: any) => sum + item.sales, 0);
  
  const chartData = Object.values(categoryData).map((item: any) => ({
    ...item,
    percentage: totalSales > 0 ? ((item.sales / totalSales) * 100).toFixed(1) : 0
  })).sort((a: any, b: any) => b.sales - a.sales);

  const handleClick = (data: any, index: number) => {
    if (onDataClick) {
      onDataClick({ category: data.category });
    }
  };

  const handleDownloadIndividualReport = async (salesperson: string) => {
    try {
      toast.info(`Gerando relatório de ${salesperson}...`);
      
      // Create a temporary detailed report element
      const reportElement = document.createElement('div');
      reportElement.style.cssText = 'position: absolute; left: -9999px; width: 800px; padding: 40px; background: #1e293b; border-radius: 16px;';
      
      const personData = data.filter(d => d.category === salesperson);
      const totalSales = personData.reduce((sum, d) => sum + d.sales, 0);
      const unit = personData[0]?.region || '';
      
      // Calculate rank
      const salesByPerson = data.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.sales;
        return acc;
      }, {} as Record<string, number>);
      
      const sortedPeople = Object.entries(salesByPerson)
        .sort(([, a], [, b]) => b - a)
        .map(([name]) => name);
      
      const rank = sortedPeople.indexOf(salesperson) + 1;
      
      reportElement.innerHTML = `
        <div style="font-family: Inter, sans-serif; color: white;">
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 30px; padding: 20px; background: rgba(249, 115, 22, 0.1); border-radius: 12px; border: 1px solid rgba(249, 115, 22, 0.3);">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: #f97316; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: bold;">
              ${salesperson.charAt(0)}
            </div>
            <div>
              <h1 style="font-size: 32px; font-weight: bold; margin: 0;">${salesperson}</h1>
              <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 18px;">${unit}</p>
              <div style="display: inline-block; margin-top: 8px; padding: 6px 16px; background: rgba(234, 179, 8, 0.2); color: #facc15; border-radius: 20px; border: 1px solid rgba(234, 179, 8, 0.3); font-size: 14px; font-weight: bold;">
                🏆 Rank #${rank}
              </div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
            <div style="padding: 24px; background: #0f172a; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #9ca3af; font-size: 14px; margin-bottom: 8px;">🎯 Total de Vendas</div>
              <div style="font-size: 40px; font-weight: bold;">${totalSales}</div>
              <div style="color: #10b981; font-size: 12px; margin-top: 4px;">Contribuição Direta</div>
            </div>
            
            <div style="padding: 24px; background: #0f172a; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #9ca3af; font-size: 14px; margin-bottom: 8px;">💰 Valor Estimado</div>
              <div style="font-size: 40px; font-weight: bold;">R$ ${(totalSales * 1000).toLocaleString()}</div>
              <div style="color: #10b981; font-size: 12px; margin-top: 4px;">Baseado em estimativa</div>
            </div>
          </div>
          
          <div style="padding: 24px; background: #0f172a; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 16px; color: #f97316;">📅 Detalhamento de Vendas</div>
            ${personData.slice(0, 10).map(sale => `
              <div style="padding: 12px; margin-bottom: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 14px; color: #e5e7eb;">${new Date(sale.date).toLocaleDateString('pt-BR')}</span>
                <span style="font-size: 14px; font-weight: bold;">+${sale.sales} venda(s)</span>
              </div>
            `).join('')}
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; color: #9ca3af; font-size: 14px;">
            Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} • Sistema Ascan
          </div>
        </div>
      `;
      
      document.body.appendChild(reportElement);
      
      const canvas = await html2canvas(reportElement, {
        backgroundColor: '#1e293b',
        scale: 2,
        logging: false,
      });
      
      document.body.removeChild(reportElement);
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Relatorio_${salesperson.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.png`;
      link.click();
      
      toast.success(`Relatório de ${salesperson} baixado!`);
    } catch (error) {
      toast.error("Erro ao gerar relatório PNG.");
      console.error(error);
    }
  };

  return (
    <Card ref={chartRef} className="h-[400px] border border-white/10 shadow-lg bg-[#1e293b] min-w-0">
      <CardHeader className="pb-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white text-lg font-semibold">
            <Award className="w-5 h-5 text-yellow-500" />
            Ranking de Vendedores
          </CardTitle>
          <div className="text-xl font-bold text-white">{totalSales}</div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col h-[320px]">
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="sales"
                onClick={handleClick}
                stroke="none"
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    stroke={selectedCategory === entry.category ? "#fff" : "none"}
                    strokeWidth={selectedCategory === entry.category ? 2 : 0}
                    style={{ 
                      cursor: 'pointer',
                      filter: selectedCategory === entry.category ? 'brightness(1.2)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, 'Vendas']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2 overflow-y-auto max-h-[120px] pr-2 custom-scrollbar">
          {chartData.map((item: any, index: number) => (
            <div 
              key={item.category} 
              className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-200 group ${
                selectedCategory === item.category 
                  ? 'bg-white/10' 
                  : 'hover:bg-white/5'
              }`}
            >
              <div 
                className="flex items-center gap-3 flex-1 cursor-pointer"
                onClick={() => handleClick(item, index)}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0f172a] text-xs font-bold text-gray-400 shrink-0 border border-white/10">
                  #{index + 1}
                </div>
                <div 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span className="text-sm font-medium text-gray-200 truncate max-w-[100px]" title={item.category}>{item.category}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{item.sales}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-orange-400 hover:text-orange-300 hover:bg-orange-500/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadIndividualReport(item.category);
                  }}
                  title="Baixar Relatório PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}