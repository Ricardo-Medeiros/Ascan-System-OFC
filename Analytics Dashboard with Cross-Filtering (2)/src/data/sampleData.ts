export interface DataPoint {
  id: string;
  date: string;
  month: string;
  year: number;
  category: string; // Used for Salesperson Name
  region: string;   // Used for Unit Name
  sales: number;    // Sales Count
  revenue: number;  // Placeholder (Sales * 1000 for visuals if needed)
  previousYearSales: number;
  previousYearRevenue: number;
  units: number;
  customers: number;
}

export const categories = [
  'Antonio Neto',
  'Thomas Moura',
  'José Ednaldo',
  'Rildo Junior',
  'Igor Pacheco',
  'Base Carpina',
  'Hugo Hichene',
  'Ricardo Medeiros',
  'Base Recife'
];

export const regions = ['UNIDADE CARPINA', 'UNIDADE RECIFE'];

const salesDataFeb = [
  { name: 'Antonio Neto', unit: 'UNIDADE CARPINA', count: 7 },
  { name: 'Thomas Moura', unit: 'UNIDADE CARPINA', count: 3 },
  { name: 'José Ednaldo', unit: 'UNIDADE CARPINA', count: 2 },
  { name: 'Rildo Junior', unit: 'UNIDADE CARPINA', count: 4 },
  { name: 'Igor Pacheco', unit: 'UNIDADE CARPINA', count: 3 },
  { name: 'Base Carpina', unit: 'UNIDADE CARPINA', count: 10 },
  { name: 'Hugo Hichene', unit: 'UNIDADE RECIFE', count: 3 },
  { name: 'Ricardo Medeiros', unit: 'UNIDADE RECIFE', count: 5 },
  { name: 'Base Recife', unit: 'UNIDADE RECIFE', count: 1 },
];

const salesDataJan = [
  { name: 'Antonio Neto', unit: 'UNIDADE CARPINA', count: 5 },
  { name: 'Thomas Moura', unit: 'UNIDADE CARPINA', count: 4 },
  { name: 'Hugo Hichene', unit: 'UNIDADE RECIFE', count: 2 },
  { name: 'Ricardo Medeiros', unit: 'UNIDADE RECIFE', count: 6 },
];

const salesDataMar = [ 
  { name: 'Antonio Neto', unit: 'UNIDADE CARPINA', count: 2 },
];

export const generateSampleData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const year = new Date().getFullYear(); // Use current year (2026)
  
  const addData = (items: typeof salesDataFeb, monthNum: number, monthName: string) => {
     items.forEach(person => {
      for (let i = 0; i < person.count; i++) {
        // Random day
        const day = Math.floor(Math.random() * 28) + 1;
        const dateStr = `${year}-${monthNum.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        data.push({
          id: `${monthName}-${person.name}-${i}`,
          date: dateStr,
          month: monthName,
          year,
          category: person.name,
          region: person.unit,
          sales: 1, 
          revenue: 1000, 
          previousYearSales: 0,
          previousYearRevenue: 0,
          units: 1,
          customers: 1
        });
      }
    });
  }

  addData(salesDataJan, 1, 'Jan');
  addData(salesDataFeb, 2, 'Feb');
  addData(salesDataMar, 3, 'Mar');

  return data;
};

export const sampleData = generateSampleData();
