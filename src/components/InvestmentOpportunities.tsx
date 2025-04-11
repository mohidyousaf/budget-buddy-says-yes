
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SheetData } from "@/services/sheetService";
import { TrendingUp, PiggyBank, Building, PieChart, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

type InvestmentOpportunitiesProps = {
  sheetData: SheetData;
};

type InvestmentOption = {
  name: string;
  type: string;
  risk: number;
  expectedReturn: number;
  minInvestment: number;
  description: string;
  icon: React.ReactNode;
};

const InvestmentOpportunities = ({ sheetData }: InvestmentOpportunitiesProps) => {
  const isMobile = useIsMobile();
  const [selectedOption, setSelectedOption] = useState<InvestmentOption | null>(null);
  
  // Calculate available funds for investment (20% of current balance)
  const availableForInvestment = Math.round(sheetData.summary.currentBalance * 0.2);
  
  // Based on the user's financial data, suggest appropriate investment options
  const monthlyIncome = sheetData.summary.totalCredits;
  const monthlyExpenses = sheetData.summary.totalDebits;
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlySavings / monthlyIncome;
  
  const investmentOptions: InvestmentOption[] = [
    {
      name: "National Savings",
      type: "Fixed Income",
      risk: 1,
      expectedReturn: 13.5,
      minInvestment: 100000,
      description: "Government-backed savings certificates with guaranteed returns, ideal for risk-averse investors looking for stability.",
      icon: <PiggyBank className="h-5 w-5 text-emerald-500" />
    },
    {
      name: "Mutual Funds",
      type: "Mixed",
      risk: 3,
      expectedReturn: 16.0,
      minInvestment: 50000,
      description: "Professionally managed investment funds that pool money from multiple investors to invest in diversified assets.",
      icon: <PieChart className="h-5 w-5 text-blue-500" />
    },
    {
      name: "Pakistan Stock Exchange",
      type: "Equity",
      risk: 4,
      expectedReturn: 20.0,
      minInvestment: 100000,
      description: "Direct investment in shares of public companies listed on the Pakistan Stock Exchange for potential high returns.",
      icon: <TrendingUp className="h-5 w-5 text-violet-500" />
    },
    {
      name: "Real Estate Investment",
      type: "Property",
      risk: 3,
      expectedReturn: 15.0,
      minInvestment: 500000,
      description: "Investment in residential or commercial properties for rental income and potential capital appreciation.",
      icon: <Building className="h-5 w-5 text-amber-500" />
    }
  ];
  
  // Filter options based on user's financial situation
  const recommendedOptions = investmentOptions.filter(option => {
    if (savingsRate < 0.1 && option.risk > 2) return false; // Low savings rate, avoid risky investments
    if (option.minInvestment > availableForInvestment) return false; // Can't afford minimum investment
    return true;
  });
  
  return (
    <Card>
      <CardHeader className={isMobile ? "px-4 pt-4 pb-2" : undefined}>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <TrendingUp className="h-5 w-5" />
          Investment Opportunities
        </CardTitle>
        <CardDescription>
          Options to grow your wealth based on your financial profile
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`space-y-6 ${isMobile ? "px-4 pb-4 pt-2" : undefined}`}>
        <div className="bg-secondary p-3 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Available for Investment</p>
            <p className="text-xl font-medium">PKR {availableForInvestment.toLocaleString()}</p>
          </div>
          <Button size="sm" variant="outline">
            Adjust Amount
          </Button>
        </div>
        
        <div className="space-y-4 mt-4">
          {recommendedOptions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Based on your current financial situation, focus on building savings before investing.
            </p>
          ) : (
            recommendedOptions.map((option) => (
              <div 
                key={option.name}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedOption?.name === option.name ? 'border-primary bg-primary/5' : 'hover:border-primary/30'
                }`}
                onClick={() => setSelectedOption(option)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {option.icon}
                    <div>
                      <h4 className="font-medium">{option.name}</h4>
                      <p className="text-xs text-muted-foreground">{option.type} • {option.expectedReturn}% Expected Return</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right hidden md:block">
                      <p className="text-xs font-medium">Risk Level</p>
                      <div className="w-16 h-2 bg-secondary rounded-full mt-1">
                        <div 
                          className={`h-full rounded-full ${
                            option.risk <= 2 ? 'bg-emerald-500' :
                            option.risk <= 3 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${option.risk * 20}%` }}
                        ></div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                {selectedOption?.name === option.name && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm">Min Investment: <span className="font-medium">PKR {option.minInvestment.toLocaleString()}</span></p>
                      <Button size="sm">Learn More</Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            These recommendations are based on your current financial profile. 
            Consider consulting with a financial advisor before making investment decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentOpportunities;
