
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrendAnalysis from "@/components/TrendAnalysis";
import FinancialWellness from "@/components/FinancialWellness";
import InvestmentOpportunities from "@/components/InvestmentOpportunities";
import { fetchSheetData, SheetData, getSavedSheetUrl } from "@/services/sheetService";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const Analysis = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sheetData, setSheetData] = useState<SheetData | null>(null);

  // Auto-load the last used sheet URL on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedUrl = await getSavedSheetUrl();
        
        if (savedUrl) {
          const data = await fetchSheetData(savedUrl);
          setSheetData(data);
        } else {
          toast.error("Please connect your balance sheet first");
        }
      } catch (error) {
        console.error("Failed to load balance sheet data:", error);
        toast.error("Could not load your financial data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading your financial analysis...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!sheetData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-xl font-medium">No Financial Data Found</p>
            <p className="text-muted-foreground">Please connect your balance sheet first</p>
            <Button asChild>
              <a href="/">Go to Home Page</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-6 md:py-8 px-3 md:px-8 space-y-6 md:space-y-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Financial Analysis</h1>
          <p className="text-muted-foreground">
            Insights from your financial data for {sheetData.summary.month}
          </p>
          
          <Tabs defaultValue="trends" className="mt-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="wellness">Wellness Score</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends">
              <TrendAnalysis sheetData={sheetData} />
            </TabsContent>
            
            <TabsContent value="wellness">
              <FinancialWellness sheetData={sheetData} />
            </TabsContent>
            
            <TabsContent value="investments">
              <InvestmentOpportunities sheetData={sheetData} />
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-bold">Special Expenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sheetData.specialExpenses.map((expense, index) => (
                <div key={index} className="bg-card border rounded-lg p-4">
                  <h3 className="font-medium">{expense.type}</h3>
                  <p className="text-2xl font-bold mt-1">PKR {expense.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analysis;
