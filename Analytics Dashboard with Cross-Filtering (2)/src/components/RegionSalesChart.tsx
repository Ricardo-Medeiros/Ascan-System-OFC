import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DataPoint } from "../data/sampleData";
import { Building2 } from "lucide-react";

interface RegionSalesChartProps {
  data: DataPoint[];
  onDataClick?: (data: any) => void;
  selectedRegion?: string;
}

const REGION_COLORS: Record<string, string> = {
  'UNIDADE CARPINA': '#0ea5e9', // Blue
  'UNIDADE RECIFE': '#f97316'   // Orange
};

export function RegionSalesChart({ data, onDataClick, selectedRegion }: RegionSalesChartProps) {
  // Aggregate sales by region
  const regionData = data.reduce((acc, item) => {
    if (!acc[item.region]) {
      acc[item.region] = {
        region: item.region,
        sales: 0
      };
    }
    acc[item.region].sales += item.sales;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(regionData).sort((a: any, b: any) => b.sales - a.sales);

  const totalSales = chartData.reduce((sum: number, item: any) => sum + item.sales, 0);

  const handleRegionClick = (data: any) => {
    if (onDataClick) {
      onDataClick({ region: data.region });
    }
  };

  return (
    <Card className="border border-white/10 shadow-lg bg-[#1e293b] min-w-0">
      <CardHeader className="pb-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-white text-xl font-semibold">
            <Building2 className="w-6 h-6 text-orange-500" />
            Performance por Unidade
          </CardTitle>
          <div className="text-2xl font-bold text-white">{totalSales} Vendas</div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2 min-w-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} onClick={handleRegionClick} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="region" 
                  type="category" 
                  width={150}
                  tick={{ fontSize: 14, fill: '#94a3b8', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)'
                  }}
                />
                <Bar 
                  dataKey="sales" 
                  radius={[0, 4, 4, 0]} 
                  barSize={40}
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={REGION_COLORS[entry.region] || '#8b5cf6'}
                      opacity={selectedRegion && selectedRegion !== entry.region ? 0.3 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {chartData.map((item: any) => (
              <Card 
                key={item.region}
                className={`cursor-pointer transition-all duration-200 border ${
                  selectedRegion === item.region 
                    ? 'border-orange-500 shadow-md bg-orange-500/10' 
                    : 'border-white/10 hover:border-white/20 hover:bg-[#2d3b52]'
                } bg-[#0f172a]`}
                onClick={() => handleRegionClick(item)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400 font-medium mb-1">{item.region}</div>
                    <div className="text-2xl font-bold text-white">{item.sales}</div>
                    <div className="text-xs text-gray-500">Vendas Totais</div>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-[#1e293b] shadow-sm border border-white/5"
                    style={{ color: REGION_COLORS[item.region] || '#8b5cf6' }}
                  >
                    <Building2 className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
