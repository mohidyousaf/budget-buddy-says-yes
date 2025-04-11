
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleSheetInput from "@/components/GoogleSheetInput";
import PurchaseForm from "@/components/PurchaseForm";
import DecisionResult from "@/components/DecisionResult";
import SheetDataSummary from "@/components/SheetDataSummary";
import TrendAnalysis from "@/components/TrendAnalysis";
import FinancialWellness from "@/components/FinancialWellness";
import InvestmentOpportunities from "@/components/InvestmentOpportunities";
import { fetchSheetData, SheetData, getSavedSheetUrl } from "@/services/sheetService";
import { analyzePurchase, Decision } from "@/services/decisionService";
import { generateAIAnalysis, AIAnalysis } from "@/services/aiService";
import { Loader2, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAutoLoading, setIsAutoLoading] = useState(true);
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState<{ amount: number; category: string } | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const isMobile = useIsMobile();

  // Auto-load the last used sheet URL on component mount
  useEffect(() => {
    const autoLoadSavedSheet = async () => {
      try {
        const savedUrl = await getSavedSheetUrl();
        
        if (savedUrl) {
          setIsConnecting(true);
          const data = await fetchSheetData(savedUrl);
          setSheetData(data);
          
          // Save current balance to localStorage for offline reference
          if (data.summary.currentBalance) {
            localStorage.setItem('currentBalance', data.summary.currentBalance.toString());
          }
        }
      } catch (error) {
        console.error("Failed to auto-load saved sheet:", error);
      } finally {
        setIsConnecting(false);
        setIsAutoLoading(false);
      }
    };
    
    autoLoadSavedSheet();
  }, []);

  // Handle Google Sheet submission
  const handleSheetSubmit = async (url: string) => {
    setIsConnecting(true);
    
    try {
      const data = await fetchSheetData(url);
      setSheetData(data);
      
      // Save current balance for potential offline use
      if (data.summary.currentBalance) {
        localStorage.setItem('currentBalance', data.summary.currentBalance.toString());
      }
      
      toast.success(`Connected to your balance sheet for ${data.summary.month}!`);
    } catch (error) {
      toast.error("Failed to connect to your balance sheet");
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle purchase form submission
  const handlePurchaseSubmit = async (amount: number, category: string, description: string) => {
    if (!sheetData) {
      toast.error("Please connect your balance sheet first");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Analyze the purchase
      const purchaseDecision = analyzePurchase(sheetData, amount, category, description);
      setDecision(purchaseDecision);
      setPurchaseDetails({ amount, category });
      
      // Get AI insights
      const categoryData = sheetData.categories.find(
        cat => cat.name.toLowerCase() === category.toLowerCase()
      ) || { spent: 0, limit: 1000, remaining: 1000 };
      
      const aiResult = await generateAIAnalysis(
        category,
        amount,
        description,
        categoryData.spent,
        categoryData.limit,
        sheetData
      );
      
      setAiAnalysis(aiResult);
    } catch (error) {
      toast.error("Failed to analyze purchase");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Extract available categories from sheet data
  const categories = sheetData 
    ? sheetData.categories.map(cat => cat.name)
    : ["Food", "Entertainment", "Car", "Shopping", "Grocery", "Shipping", "Utilities", "Pets", "Education"];

  // Data summary for the connected sheet
  const summary = sheetData 
    ? {
        totalCredits: sheetData.summary.totalCredits,
        totalDebits: sheetData.summary.totalDebits,
        currentBalance: sheetData.summary.currentBalance,
        categories: sheetData.categories.map(cat => ({
          name: cat.name,
          spent: cat.spent,
          limit: cat.limit
        }))
      }
    : null;

  // Show loading indicator while auto-loading
  if (isAutoLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading your balance sheet data...</p>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-4 md:py-8 px-3 md:px-8 space-y-6 md:space-y-8">
        {/* Connect Sheet Section */}
        {!sheetData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto py-6"
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Mohid Budget Buddy</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Connect your balance sheet and get intelligent insights for smarter financial decisions
              </p>
            </div>
            
            <GoogleSheetInput onSheetSubmit={handleSheetSubmit} isLoading={isConnecting} />
          </motion.div>
        )}
        
        {/* Main App Content */}
        {sheetData && (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
                  Welcome to Mohid Budget Buddy
                </h1>
                <p className="text-muted-foreground">
                  Your financial data for {sheetData.summary.month} is loaded
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="outline">
                  <Link to="/analysis" className="flex items-center gap-1">
                    View Full Analysis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/learn">
                    Financial Education
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'}`}>
              {/* Left Column - Sheet Summary */}
              <div className="md:col-span-1">
                <SheetDataSummary isConnected={!!sheetData} summary={summary} />
              </div>
              
              {/* Middle Column - Purchase Form */}
              <div className="md:col-span-1">
                <PurchaseForm 
                  onSubmit={handlePurchaseSubmit}
                  categories={categories}
                  isLoading={isAnalyzing}
                />
              </div>
              
              {/* Right Column - Decision Result */}
              <div className="md:col-span-1">
                {decision && purchaseDetails && (
                  <DecisionResult
                    decision={decision.decision}
                    amount={purchaseDetails.amount}
                    category={purchaseDetails.category}
                    reasoning={decision.reasoning}
                    metrics={decision.metrics}
                  />
                )}
              </div>
            </div>
            
            {/* Expanded content for connected users */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <FinancialWellness sheetData={sheetData} />
              <TrendAnalysis sheetData={sheetData} />
            </div>
            
            <div className="mt-6">
              <InvestmentOpportunities sheetData={sheetData} />
            </div>
          </>
        )}
        
        {/* AI Analysis */}
        {aiAnalysis && decision && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 md:mt-8"
          >
            <div className="bg-secondary/50 border rounded-lg p-4 md:p-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-base md:text-lg font-medium">AI Budget Assistant</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {(aiAnalysis.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              
              <div className="space-y-3 md:space-y-4 text-sm md:text-base">
                {aiAnalysis.additionalInsights.map((insight, index) => (
                  <p key={index} className="text-muted-foreground">{insight}</p>
                ))}
                
                <div className="pt-2 border-t">
                  <p className="font-medium">Suggestion:</p>
                  <p>{aiAnalysis.suggestion}</p>
                </div>
                
                {aiAnalysis.investmentAdvice && (
                  <div className="pt-2 border-t">
                    <p className="font-medium">Investment Advice:</p>
                    <p>{aiAnalysis.investmentAdvice}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
