
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SheetData, getFinancialWellnessScore } from "@/services/sheetService";
import { BadgeCheck, AlertTriangle, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type FinancialWellnessProps = {
  sheetData: SheetData;
};

const FinancialWellness = ({ sheetData }: FinancialWellnessProps) => {
  const isMobile = useIsMobile();
  const wellness = getFinancialWellnessScore(sheetData);
  
  // Calculate savings rate as percentage
  const savingsRatePercent = Math.round(wellness.savingsRate * 100);
  
  // Get interpretation color
  const getScoreColor = () => {
    if (wellness.score >= 80) return "text-emerald-500";
    if (wellness.score >= 60) return "text-blue-500";
    if (wellness.score >= 40) return "text-amber-500";
    return "text-rose-500";
  };
  
  const getProgressColor = () => {
    if (wellness.score >= 80) return "bg-emerald-500";
    if (wellness.score >= 60) return "bg-blue-500";
    if (wellness.score >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };
  
  return (
    <Card>
      <CardHeader className={isMobile ? "px-4 pt-4 pb-2" : undefined}>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          Financial Wellness
        </CardTitle>
        <CardDescription>
          How healthy are your finances compared to peers?
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`space-y-6 ${isMobile ? "px-4 pb-4 pt-2" : undefined}`}>
        <div className="flex flex-col items-center space-y-2">
          <div className="relative w-32 h-32 mb-2">
            <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor()}`}>{wellness.score}</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-background px-3 py-1 rounded-full border">
              <span className="text-xs font-medium">{wellness.interpretation}</span>
            </div>
          </div>
          
          <Progress value={wellness.score} className={`w-full h-2 ${getProgressColor()}`} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-secondary p-3 rounded-lg space-y-1">
            <p className="text-xs text-muted-foreground">Savings Rate</p>
            <p className="text-base font-medium">{savingsRatePercent}% of Income</p>
            <Progress value={wellness.breakdown.savings} max={40} className="h-1 mt-1" />
          </div>
          
          <div className="bg-secondary p-3 rounded-lg space-y-1">
            <p className="text-xs text-muted-foreground">Budget Management</p>
            <p className="text-base font-medium">{wellness.categoriesOverBudget} Categories Over</p>
            <Progress value={wellness.breakdown.budget} max={30} className="h-1 mt-1" />
          </div>
          
          <div className="bg-secondary p-3 rounded-lg space-y-1">
            <p className="text-xs text-muted-foreground">Asset Growth</p>
            <p className="text-base font-medium">{(wellness.assetGrowth * 100).toFixed(1)}% Annual</p>
            <Progress value={wellness.breakdown.assets} max={30} className="h-1 mt-1" />
          </div>
        </div>
        
        <div className="pt-2 space-y-3">
          <div className="flex items-start gap-2">
            <User className="h-5 w-5 text-blue-500 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              At 25, your financial wellness score is {wellness.score >= 60 ? "above" : "below"} average. 
              {wellness.score >= 70 
                ? " You're in the top 20% of your age group!"
                : wellness.score >= 50 
                  ? " You're doing better than half of your peers."
                  : " Focus on improving your savings rate and budget management."}
            </p>
          </div>
          
          {wellness.score >= 60 ? (
            <div className="flex items-start gap-2">
              <BadgeCheck className="h-5 w-5 text-emerald-500 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                You're maintaining a healthy savings rate of {savingsRatePercent}%, which puts you in a good position for future financial goals.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Aim to increase your savings rate above 20% to improve your financial stability and reach your long-term goals.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialWellness;
