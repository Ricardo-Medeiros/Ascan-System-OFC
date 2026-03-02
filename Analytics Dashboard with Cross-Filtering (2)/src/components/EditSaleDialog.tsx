import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DataPoint } from "../data/sampleData";
import { Save } from "lucide-react";

interface EditSaleDialogProps {
  sale: DataPoint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedSale: DataPoint) => void;
  existingPeople: string[];
  existingUnits: string[];
}

export function EditSaleDialog({ 
  sale, 
  open, 
  onOpenChange, 
  onSave,
  existingPeople,
  existingUnits
}: EditSaleDialogProps) {
  const [date, setDate] = useState("");
  const [salesperson, setSalesperson] = useState("");
  const [unit, setUnit] = useState("");
  const [count, setCount] = useState(1);
  const [revenue, setRevenue] = useState(1000);

  useEffect(() => {
    if (sale) {
      setDate(sale.date);
      setSalesperson(sale.category);
      setUnit(sale.region);
      setCount(sale.sales);
      setRevenue(sale.revenue);
    }
  }, [sale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sale) return;

    const dateObj = new Date(date);
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const year = dateObj.getFullYear();

    const updatedSale: DataPoint = {
      ...sale,
      date,
      month,
      year,
      category: salesperson,
      region: unit,
      sales: count,
      revenue: revenue,
      units: count,
      customers: count
    };

    onSave(updatedSale);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#1e293b] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Editar Venda</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-date" className="text-gray-300">Data</Label>
            <Input 
              id="edit-date" 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="bg-[#0f172a] border-white/10 text-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-person" className="text-gray-300">Vendedor</Label>
            <Select value={salesperson} onValueChange={setSalesperson}>
              <SelectTrigger className="bg-[#0f172a] border-white/10 text-white">
                <SelectValue placeholder="Selecione Vendedor" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                {existingPeople.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-unit" className="text-gray-300">Unidade</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="bg-[#0f172a] border-white/10 text-white">
                <SelectValue placeholder="Selecione Unidade" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-white/10 text-white">
                {existingUnits.map(u => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-count" className="text-gray-300">Quantidade</Label>
              <Input 
                id="edit-count" 
                type="number" 
                min="1"
                value={count} 
                onChange={(e) => setCount(parseInt(e.target.value) || 1)} 
                className="bg-[#0f172a] border-white/10 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-revenue" className="text-gray-300">Valor (R$)</Label>
              <Input 
                id="edit-revenue" 
                type="number" 
                min="0"
                step="0.01"
                value={revenue} 
                onChange={(e) => setRevenue(parseFloat(e.target.value) || 0)} 
                className="bg-[#0f172a] border-white/10 text-white"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white hover:bg-white/10">
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}