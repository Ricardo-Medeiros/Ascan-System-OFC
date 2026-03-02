import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DataPoint } from "../data/sampleData";
import { ListChecks } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface PerformanceMetricsChartProps {
  data: DataPoint[];
  onDataClick?: (data: any) => void;
}

export function PerformanceMetricsChart({ data, onDataClick }: PerformanceMetricsChartProps) {
  // Group by person
  const personData = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {
        name: item.category,
        unit: item.region,
        sales: 0
      };
    }
    acc[item.category].sales += item.sales;
    return acc;
  }, {} as Record<string, any>);

  const sortedData = Object.values(personData).sort((a: any, b: any) => b.sales - a.sales);

  return (
    <Card className="h-[400px] border border-white/10 shadow-lg bg-[#1e293b] overflow-hidden flex flex-col min-w-0">
      <CardHeader className="pb-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white text-lg font-semibold">
            <ListChecks className="w-5 h-5 text-indigo-400" />
            Detalhamento de Vendas
          </CardTitle>
          <div className="text-xl font-bold text-white">{sortedData.length} Vendedores</div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-[#0f172a] sticky top-0">
            <TableRow className="border-b border-white/10 hover:bg-[#0f172a]">
              <TableHead className="w-[60px] text-center text-gray-400">#</TableHead>
              <TableHead className="text-gray-400">Vendedor</TableHead>
              <TableHead className="text-gray-400">Unidade</TableHead>
              <TableHead className="text-right text-gray-400">Vendas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item: any, index: number) => (
              <TableRow 
                key={item.name} 
                className="cursor-pointer hover:bg-white/5 border-b border-white/5"
                onClick={() => onDataClick && onDataClick({ category: item.name })}
              >
                <TableCell className="text-center font-medium text-gray-500">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium text-gray-200">
                  {item.name}
                </TableCell>
                <TableCell className="text-gray-500 text-xs">
                  {item.unit}
                </TableCell>
                <TableCell className="text-right font-bold text-orange-400">
                  {item.sales}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
