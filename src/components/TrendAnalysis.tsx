
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SheetData, analyzeSpendingTrends } from "@/services/sheetService";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type TrendAnalysisProps = {
  sheetData: SheetData;
};

const TrendAnalysis = ({ sheetData }: TrendAnalysisProps) => {
  const isMobile = useIsMobile();
  const trends = analyzeSpendingTrends(sheetData);
  
  // Prepare data for the chart
  const chartData = sheetData.historicalData.months.map((month) => {
    const dataPoint: any = { month };
    
    // Add top 5 categories by spending
    const topCategories = [...sheetData.categories]
      .sort((a, b) => b.spent - a.spent)
      .slice(0, isMobile ? 3 : 5);
    
    topCategories.forEach((category) => {
      if (sheetData.historicalData.spending[category.name]) {
        dataPoint[category.name] = sheetData.historicalData.spending[category.name][month] || 0;
      }
    });
    
    return dataPoint;
  });
  
  const colors = ["#2563eb", "#dc2626", "#16a34a", "#eab308", "#8b5cf6"];
  
  return (
    <Card>
      <CardHeader className={isMobile ? "px-4 pt-4 pb-2" : undefined}>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          Spending Trends
        </CardTitle>
        <CardDescription>
          How your spending has changed over time
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`space-y-6 ${isMobile ? "px-2 pb-4 pt-2" : undefined}`}>
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
        
        {trends.length > 0 && (
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium">Notable Trends</h3>
            <div className="space-y-3">
              {trends.map((trend, index) => {
                const isIncrease = parseFloat(trend.change) > 0;
                return (
                  <div key={index} className="flex items-start gap-2">
                    <div className={`p-1 rounded-full mt-0.5 ${isIncrease ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                      {isIncrease ? 
                        <ArrowTrendingUpIcon className="h-4 w-4" /> : 
                        <ArrowTrendingDownIcon className="h-4 w-4" />
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
