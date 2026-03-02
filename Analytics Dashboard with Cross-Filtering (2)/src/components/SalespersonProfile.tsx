import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DataPoint } from "../data/sampleData";
import { User, Trophy, Calendar, Target, TrendingUp, DollarSign, Download } from "lucide-react";
import { Button } from "./ui/button";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { toast } from "sonner@2.0.3";

interface SalespersonProfileProps {
  salesperson: string;
  data: DataPoint[]; // All data to calculate rankings
  onClose: () => void;
}

export function SalespersonProfile({ salesperson, data, onClose }: SalespersonProfileProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  // Filter data for this person
  const personData = data.filter(d => d.category === salesperson);
  if (personData.length === 0) return null;

  const unit = personData[0].region;
  const totalSales = personData.reduce((sum, d) => sum + d.sales, 0);
  
  // Calculate Rank
  const salesByPerson = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.sales;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedPeople = Object.entries(salesByPerson)
    .sort(([, a], [, b]) => b - a)
    .map(([name]) => name);
    
  const rank = sortedPeople.indexOf(salesperson) + 1;
  
  // Unit Stats
  const unitData = data.filter(d => d.region === unit);
  const unitTotal = unitData.reduce((sum, d) => sum + d.sales, 0);
  const percentOfUnit = unitTotal > 0 ? ((totalSales / unitTotal) * 100).toFixed(1) : "0";

  // Recent Sales
  const recentSales = [...personData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleDownloadPNG = async () => {
    if (!reportRef.current) return;
    
    try {
      toast.info("Gerando relatório...");
      
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#1e293b',
        scale: 2,
        logging: false,
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Relatorio_${salesperson.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.png`;
      link.click();
      
      toast.success("Relatório baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar relatório PNG.");
      console.error(error);
    }
  };

  return (
    <Card ref={reportRef} className="border border-orange-500/30 shadow-2xl bg-[#1e293b] mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <CardHeader className="pb-4 border-b border-white/10 bg-orange-500/10 flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white/20 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-bold text-white">{salesperson}</CardTitle>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Rank #{rank}
              </span>
            </div>
            <p className="text-gray-400 font-medium">{unit}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleDownloadPNG}
            className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
            size="sm"
          >
            <Download className="w-4 h-4" />
            Baixar Relatório PNG
          </Button>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-[#0f172a] rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <Target className="w-4 h-4 text-orange-500" />
              Total Vendas
            </div>
            <div className="text-3xl font-bold text-white">{totalSales}</div>
            <div className="text-xs text-green-400 font-medium mt-1">Contribuição Direta</div>
          </div>
          
          <div className="p-4 bg-[#0f172a] rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              % da Unidade
            </div>
            <div className="text-3xl font-bold text-white">{percentOfUnit}%</div>
            <div className="text-xs text-blue-400 font-medium mt-1">Participação em {unit}</div>
          </div>

          <div className="p-4 bg-[#0f172a] rounded-xl border border-white/10">
             <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <DollarSign className="w-4 h-4 text-green-500" />
              Ticket Médio (Est.)
            </div>
            <div className="text-3xl font-bold text-white">R$ {(totalSales * 1000).toLocaleString()}</div>
            <div className="text-xs text-gray-500 font-medium mt-1">Baseado em est.</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            Últimas Vendas Registradas
          </h4>
          <div className="space-y-2">
            {recentSales.map((sale, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#0f172a] border border-white/10 rounded-lg hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-300">
                    {new Date(sale.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">+{sale.sales} Venda(s)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}