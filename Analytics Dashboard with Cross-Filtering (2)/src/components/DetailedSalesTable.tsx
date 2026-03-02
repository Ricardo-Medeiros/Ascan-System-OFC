import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DataPoint } from "../data/sampleData";
import { FileText, Calendar, User, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface DetailedSalesTableProps {
  data: DataPoint[];
  onEditSale: (sale: DataPoint) => void;
  onDeleteSale: (id: string) => void;
}

export function DetailedSalesTable({ data, onEditSale, onDeleteSale }: DetailedSalesTableProps) {
  // Sort by date descending
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="border border-white/10 shadow-lg bg-[#1e293b]">
      <CardHeader className="pb-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white text-lg font-semibold">
            <FileText className="w-5 h-5 text-blue-400" />
            Registro Detalhado de Vendas
          </CardTitle>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 flex items-center gap-2">
              <Pencil className="w-3 h-3 text-blue-400" />
              <span>Clique em <span className="text-blue-400 font-semibold">Editar</span> para modificar valores</span>
            </div>
            <div className="text-sm text-gray-400">
              {data.length} registros encontrados
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-[#0f172a] sticky top-0 z-10">
              <TableRow className="border-b border-white/10 hover:bg-[#0f172a]">
                <TableHead className="text-gray-400 w-[120px]">Data</TableHead>
                <TableHead className="text-gray-400">Vendedor</TableHead>
                <TableHead className="text-gray-400">Unidade</TableHead>
                <TableHead className="text-gray-400 text-right">Qtd</TableHead>
                <TableHead className="text-gray-400 text-right">Valor (Est.)</TableHead>
                <TableHead className="text-gray-400 text-center w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhum registro encontrado para os filtros selecionados.
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((item) => (
                  <TableRow key={item.id} className="border-b border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-orange-500" />
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-blue-500" />
                        {item.category}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        {item.region}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-orange-400">
                      {item.sales}
                    </TableCell>
                    <TableCell className="text-right text-gray-300">
                      R$ {item.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                          onClick={() => onEditSale(item)}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          onClick={() => onDeleteSale(item.id)}
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}