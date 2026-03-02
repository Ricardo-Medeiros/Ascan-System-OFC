import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Plus, Trash2, Save, X } from "lucide-react";
import { DataPoint } from "../data/sampleData";

interface ManageSalesDialogProps {
  data: DataPoint[];
  onAddSale: (sale: { date: string; salesperson: string; unit: string; count: number }) => void;
  onDeleteSale: (id: string) => void;
  existingPeople: string[];
  existingUnits: string[];
}

export function ManageSalesDialog({ 
  data, 
  onAddSale, 
  onDeleteSale,
  existingPeople,
  existingUnits
}: ManageSalesDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("add");

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [salesperson, setSalesperson] = useState("");
  const [unit, setUnit] = useState("");
  const [count, setCount] = useState(1);
  const [isNewPerson, setIsNewPerson] = useState(false);
  const [isNewUnit, setIsNewUnit] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salesperson || !unit) return;
    
    onAddSale({
      date,
      salesperson,
      unit,
      count
    });
    
    // Reset form slightly but keep context
    setCount(1);
    // setOpen(false); // Keep open to add more?
    // Maybe show success toast
  };

  // Sort data for the list view (newest first)
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Gerenciar Vendas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Gerenciamento de Vendas</DialogTitle>
          <DialogDescription>
            Adicione novas vendas ou remova registros existentes.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Registrar Venda</TabsTrigger>
            <TabsTrigger value="list">Histórico ({data.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="flex-1 overflow-y-auto p-4 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data da Venda</Label>
                <Input 
                  id="date" 
                  type="date" 
                  required
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>

              <div className="space-y-2">
                <Label>Vendedor</Label>
                {!isNewPerson ? (
                  <div className="flex gap-2">
                    <Select value={salesperson} onValueChange={setSalesperson}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um vendedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingPeople.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setIsNewPerson(true)} title="Novo Vendedor">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Nome do novo vendedor" 
                      value={salesperson} 
                      onChange={(e) => setSalesperson(e.target.value)}
                      required
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => setIsNewPerson(false)} title="Cancelar">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Unidade</Label>
                {!isNewUnit ? (
                  <div className="flex gap-2">
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingUnits.map(u => (
                          <SelectItem key={u} value={u}>{u}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setIsNewUnit(true)} title="Nova Unidade">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Nome da nova unidade" 
                      value={unit} 
                      onChange={(e) => setUnit(e.target.value)}
                      required
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => setIsNewUnit(false)} title="Cancelar">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">Quantidade</Label>
                <Input 
                  id="count" 
                  type="number" 
                  min="1" 
                  required
                  value={count} 
                  onChange={(e) => setCount(parseInt(e.target.value))} 
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Salvar Venda
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="list" className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Qtd</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="py-2 text-xs">
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="py-2 font-medium">{item.category}</TableCell>
                      <TableCell className="py-2 text-xs text-gray-500">{item.region}</TableCell>
                      <TableCell className="py-2 text-right">{item.sales}</TableCell>
                      <TableCell className="py-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDeleteSale(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
