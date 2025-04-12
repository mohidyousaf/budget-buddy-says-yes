
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SheetData, analyzeSpendingTrends, getFilteredTrendData } from "@/services/sheetService";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TrendAnalysisProps = {
  sheetData: SheetData;
};

const TrendAnalysis = ({ sheetData }: TrendAnalysisProps) => {
  const isMobile = useIsMobile();
  const [monthsToShow, setMonthsToShow] = useState(3); // Default to showing 3 months
  const [selectedView, setSelectedView] = useState<"spending" | "savings">("spending");
  
  const trends = analyzeSpendingTrends(sheetData);
  const maxMonths = sheetData.historicalData.months.length;
  
  // Get filtered months based on selection
  const { filteredMonths, filteredSpending } = getFilteredTrendData(sheetData, monthsToShow);
  
  // Calculate monthly savings data
  const savingsData = filteredMonths.map((month) => {
    const income = sheetData.historicalData.income[month] || 0;
    
    // Calculate total spending for the month
    let totalSpending = 0;
    Object.keys(filteredSpending).forEach((category) => {
      if (filteredSpending[category][month]) {
        totalSpending += filteredSpending[category][month];
      }
    });
    
    // Calculate savings amount and rate
    const savingsAmount = income - totalSpending;
    const savingsRate = income > 0 ? (savingsAmount / income) * 100 : 0;
    
    return {
      month,
      "Total Income": income,
      "Total Expenses": totalSpending,
      "Savings": savingsAmount,
      "Savings Rate (%)": parseFloat(savingsRate.toFixed(1))
    };
  });
  
  // Prepare data for the chart
  const chartData = filteredMonths.map((month) => {
    const dataPoint: { [key: string]: string | number } = { month };
    
    // Add top categories by spending
    const topCategories = [...sheetData.categories]
      .sort((a, b) => b.spent - a.spent)
      .slice(0, isMobile ? 3 : 5);
    
    topCategories.forEach((category) => {
      if (filteredSpending[category.name] && filteredSpending[category.name][month]) {
        dataPoint[category.name] = filteredSpending[category.name][month] || 0;
      }
    });
    
    return dataPoint;
  });
  
  const colors = ["#2563eb", "#dc2626", "#16a34a", "#eab308", "#8b5cf6"];
  const savingsColors = ["#16a34a", "#dc2626", "#2563eb", "#8b5cf6"];
  
  // Handle month selection change
  const handleMonthsChange = (value: string) => {
    setMonthsToShow(Number(value));
  };
  
  // Calculate average monthly spending and savings
  const calculateMonthlyAverages = () => {
    const months = filteredMonths.length;
    if (months === 0) return { avgSpending: 0, avgSavings: 0, avgSavingsRate: 0 };
    
    let totalSpending = 0;
    let totalSavings = 0;
    
    filteredMonths.forEach((month) => {
      let monthSpending = 0;
      Object.keys(filteredSpending).forEach((category) => {
        if (filteredSpending[category][month]) {
          monthSpending += filteredSpending[category][month];
        }
      });
      
      totalSpending += monthSpending;
      
      const income = sheetData.historicalData.income[month] || 0;
      totalSavings += (income - monthSpending);
    });
    
    const avgSpending = totalSpending / months;
    const avgSavings = totalSavings / months;
    
    // Calculate average income
    let totalIncome = 0;
    filteredMonths.forEach((month) => {
      totalIncome += sheetData.historicalData.income[month] || 0;
    });
    
    const avgIncome = totalIncome / months;
    const avgSavingsRate = avgIncome > 0 ? (avgSavings / avgIncome) * 100 : 0;
    
    return {
      avgSpending,
      avgSavings,
      avgSavingsRate
    };
  };
  
  const { avgSpending, avgSavings, avgSavingsRate } = calculateMonthlyAverages();
  
  // Handle view change
  const handleViewChange = (value: string) => {
    setSelectedView(value as "spending" | "savings");
  };
  
  return (
    <Card>
      <CardHeader className={isMobile ? "px-4 pt-4 pb-2" : undefined}>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              Spending & Savings Trends
            </CardTitle>
            <CardDescription>
              How your finances have changed over time
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="months-select">Show:</Label>
            <Select value={monthsToShow.toString()} onValueChange={handleMonthsChange}>
              <SelectTrigger id="months-select" className="w-[140px]">
                <SelectValue placeholder="Select months" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(maxMonths)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Last {i + 1} {i === 0 ? "month" : "months"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`space-y-6 ${isMobile ? "px-2 pb-4 pt-2" : undefined}`}>
        <Tabs value={selectedView} onValueChange={handleViewChange} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="spending">
            <div style={{ width: "100%", height: isMobile ? 200 : 250 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`PKR ${value.toLocaleString()}`, ``]}
                    labelFormatter={(month) => `Month: ${month}`}
                  />
                  <Legend />
                  {sheetData.categories
                    .sort((a, b) => b.spent - a.spent)
                    .slice(0, isMobile ? 3 : 5)
                    .map((category, index) => (
                      <Line 
                        key={category.name}
                        type="monotone" 
                        dataKey={category.name} 
                        stroke={colors[index % colors.length]} 
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    ))
                  }
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 bg-muted/40 p-3 rounded-md">
              <p className="text-sm font-medium mb-1">Spending Analysis</p>
              <p className="text-sm text-muted-foreground">
                Your average monthly spending over the selected period is <span className="font-medium">PKR {avgSpending.toLocaleString()}</span>.
                {avgSpending > sheetData.summary.totalCredits * 0.8 ? 
                  " This is more than 80% of your current income, which may limit your ability to save." :
                  " This represents a healthy spending level relative to your income."
                }
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="savings">
            <div style={{ width: "100%", height: isMobile ? 200 : 250 }}>
              <ResponsiveContainer>
                <LineChart data={savingsData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name.includes('Rate') ? `${value.toFixed(1)}%` : `PKR ${value.toLocaleString()}`,
                      name
                    ]}
                    labelFormatter={(month) => `Month: ${month}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Total Income" 
                    stroke={savingsColors[0]} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Total Expenses" 
                    stroke={savingsColors[1]} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Savings" 
                    stroke={savingsColors[2]} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 bg-muted/40 p-3 rounded-md">
              <p className="text-sm font-medium mb-1">Savings Analysis</p>
              <p className="text-sm text-muted-foreground">
                Your average monthly savings is <span className="font-medium">PKR {avgSavings.toLocaleString()}</span> ({avgSavingsRate.toFixed(1)}% of income).
                {avgSavingsRate < 20 ? 
                  " Financial experts recommend saving at least 20% of your income. Consider reducing discretionary spending." :
                  " You're exceeding the recommended 20% savings rate, which is excellent for long-term financial health."
                }
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        {trends.length > 0 && (
          <div className="space-y-2 mt-6">
            <h3 className="text-sm font-medium">Notable Trends & Insights</h3>
            <div className="space-y-3">
              {trends.map((trend, index) => {
                const isIncrease = parseFloat(trend.change) > 0;
                return (
                  <div key={index} className="flex items-start gap-2">
                    <div className={`p-1 rounded-full mt-0.5 ${
                      trend.category === "Overall" || trend.category === "Savings" 
                        ? 'bg-amber-500/20 text-amber-500'
                        : isIncrease 
                          ? 'bg-red-500/20 text-red-500' 
                          : 'bg-green-500/20 text-green-500'
                    }`}>
                      {trend.category === "Overall" || trend.category === "Savings" 
                        ? <AlertCircle className="h-4 w-4" />
                        : isIncrease 
                          ? <TrendingUp className="h-4 w-4" /> 
                          : <TrendingDown className="h-4 w-4" />
                      }
                    </div>
                    <p className="text-sm text-muted-foreground">{trend.message}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendAnalysis;
