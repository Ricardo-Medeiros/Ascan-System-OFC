import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DataPoint } from "../data/sampleData";
import { Target } from "lucide-react";

interface YoYGrowthChartProps {
  data: DataPoint[];
  onDataClick?: (data: any) => void;
  selectedRegion?: string;
}

export function YoYGrowthChart({ data, onDataClick, selectedRegion }: YoYGrowthChartProps) {
  // If filtered, totalSales reflects the filter. Meta is global so 100 might look weird if filtered.
  // But usually Meta is for the whole context. I'll keep it simple.
  const totalSales = data.length;
  const meta = 100;

  const chartData = [
    { name: 'Meta', value: meta, color: '#334155' }, // Dark Slate for Meta background
    { name: 'Realizado', value: totalSales, color: '#f97316' } // Orange for Actual
  ];

  return (
    <Card className="h-[400px] border border-white/10 shadow-lg bg-[#1e293b] min-w-0">
      <CardHeader className="pb-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white text-lg font-semibold">
            <Target className="w-5 h-5 text-purple-400" />
            Meta vs Realizado
          </CardTitle>
          <div className="text-xl font-bold text-white">{((totalSales / meta) * 100).toFixed(1)}%</div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#334155" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={80}
              tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
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
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
