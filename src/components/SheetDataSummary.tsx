
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, DollarSign, ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

type SheetDataSummaryProps = {
  isConnected: boolean;
  summary: {
    totalCredits: number;
    totalDebits: number;
    currentBalance: number;
    categories: Array<{
      name: string;
      spent: number;
      limit: number;
    }>;
  } | null;
};

const SheetDataSummary = ({ isConnected, summary }: SheetDataSummaryProps) => {
  if (!isConnected || !summary) {
    return null;
  }

  const { totalCredits, totalDebits, currentBalance, categories } = summary;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          <span>Balance Sheet Summary</span>
        </CardTitle>
        <CardDescription>
          Overview of your current financial situation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary p-4 rounded-lg flex items-center gap-3">
            <div className="p-2.5 bg-budget-green/20 rounded-full">
              <ArrowUpRight className="h-5 w-5 text-budget-green" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Credits</p>
              <p className="text-xl font-medium">${totalCredits.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="bg-secondary p-4 rounded-lg flex items-center gap-3">
            <div className="p-2.5 bg-budget-red/20 rounded-full">
              <ArrowDownRight className="h-5 w-5 text-budget-red" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Debits</p>
              <p className="text-xl font-medium">${totalDebits.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="bg-secondary p-4 rounded-lg flex items-center gap-3">
            <div className="p-2.5 bg-primary/20 rounded-full">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-xl font-medium">${currentBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Category Spending</h3>
          <div className="space-y-3">
            {categories.map((category) => {
              const percentUsed = Math.min((category.spent / category.limit) * 100, 100);
              
              return (
                <div key={category.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span>${category.spent.toFixed(2)} / ${category.limit.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        percentUsed > 90 ? 'bg-budget-red' : 
                        percentUsed > 70 ? 'bg-budget-yellow' : 
                        'bg-primary'
                      }`}
                      style={{ width: `${percentUsed}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SheetDataSummary;
