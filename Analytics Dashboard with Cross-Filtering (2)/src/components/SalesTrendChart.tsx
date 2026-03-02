import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DataPoint } from "../data/sampleData";
import { TrendingUp } from "lucide-react";

interface SalesTrendChartProps {
  data: DataPoint[];
  onDataClick?: (data: any) => void;
  selectedCategory?: string;
}

export function SalesTrendChart({ data, onDataClick, selectedCategory }: SalesTrendChartProps) {
  // Aggregate data by date
  const dailyData = data.reduce((acc, item) => {
    // Format date as DD/MM
    const dateObj = new Date(item.date);
    // Adjust for timezone if needed, but assuming simple ISO date string YYYY-MM-DD
    const dayStr = item.date.split('-')[2]; // Get DD
    const monthStr = item.date.split('-')[1]; // Get MM
    const key = `${dayStr}/${monthStr}`;
    
    if (!acc[key]) {
      acc[key] = {
        dateStr: key,
        fullDate: item.date,
        sales: 0
      };
    }
    acc[key].sales += item.sales;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(dailyData)
    .sort((a: any, b: any) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

  const totalSales = chartData.reduce((sum: number, item: any) => sum + item.sales, 0);

  const handleClick = (data: any) => {
    if (onDataClick) {
      onDataClick(data);
    }
  };

  return (
    <Card className="h-[400px] border border-white/10 shadow-lg bg-[#1e293b] min-w-0">
      <CardHeader className="pb-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white text-lg font-semibold">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Evolução Diária
          </CardTitle>
          <div className="text-right">
            <div className="text-xl font-bold text-white">{totalSales} Vendas</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} onClick={handleClick}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="dateStr" 
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={{ stroke: '#475569' }}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip 
              formatter={(value: number) => [value, 'Vendas']}
              labelFormatter={(label) => `Dia: ${label}`}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#fff',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)'
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#salesGradient)"
              dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#f97316", strokeWidth: 2, fill: "#ffffff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
