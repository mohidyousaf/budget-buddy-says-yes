
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, AlertCircle, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

type DecisionResultProps = {
  decision: "yes" | "no" | "caution";
  amount: number;
  category: string;
  reasoning: string[];
  metrics: {
    categoryBudget: number;
    categorySpent: number;
    balanceAfterPurchase: number;
    overallBudgetImpact: string;
  };
};

const DecisionResult = ({ decision, amount, category, reasoning, metrics }: DecisionResultProps) => {
  const { categoryBudget, categorySpent, balanceAfterPurchase, overallBudgetImpact } = metrics;
  
  const categoryRemaining = categoryBudget - categorySpent;
  const categoryUsedPercentage = Math.min((categorySpent / categoryBudget) * 100, 100);
  const newCategoryUsedPercentage = Math.min(((categorySpent + amount) / categoryBudget) * 100, 100);
  
  // Decision icon and styling
  const getDecisionDetails = () => {
    switch(decision) {
      case "yes":
        return {
          icon: <Check className="h-8 w-8" />,
          title: "Yes, Go Ahead!",
          color: "bg-budget-green/20 text-budget-green border-budget-green/50",
          iconBg: "bg-budget-green text-white"
        };
      case "no":
        return {
          icon: <X className="h-8 w-8" />,
          title: "No, Better Wait",
          color: "bg-budget-red/20 text-budget-red border-budget-red/50",
          iconBg: "bg-budget-red text-white"
        };
      case "caution":
        return {
          icon: <AlertCircle className="h-8 w-8" />,
          title: "Proceed with Caution",
          color: "bg-budget-yellow/20 text-budget-yellow border-budget-yellow/50",
          iconBg: "bg-budget-yellow text-foreground"
        };
      default:
        return {
          icon: <AlertCircle className="h-8 w-8" />,
          title: "Proceed with Caution",
          color: "bg-budget-yellow/20 text-budget-yellow border-budget-yellow/50",
          iconBg: "bg-budget-yellow text-foreground"
        };
    }
  };
  
  const { icon, title, color, iconBg } = getDecisionDetails();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className={`border-2 ${color}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <div className={`p-2 rounded-full ${iconBg}`}>
                {icon}
              </div>
              <span>{title}</span>
            </CardTitle>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">Amount</span>
              <p className="text-xl font-bold">${amount.toFixed(2)}</p>
            </div>
          </div>
          <CardDescription>Category: {category}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reasoning Section */}
          <div className="space-y-3">
            <h3 className="font-medium">Decision Reasoning:</h3>
            <ul className="space-y-2">
              {reasoning.map((reason, index) => (
                <li key={index} className="flex gap-2 items-start">
                  <ArrowRight className="h-5 w-5 min-w-5 mt-0.5 text-primary" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Budget Metrics */}
          <div className="space-y-4">
            <h3 className="font-medium">Budget Impact:</h3>
            
            {/* Category Budget */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Category Budget ({category})</span>
                <span>
                  ${categorySpent.toFixed(2)} / ${categoryBudget.toFixed(2)}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${categoryUsedPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>If purchased:</span>
                <span>
                  ${(categorySpent + amount).toFixed(2)} / ${categoryBudget.toFixed(2)}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${newCategoryUsedPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Balance After Purchase */}
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Balance After Purchase</p>
                <p className="text-lg font-medium">${balanceAfterPurchase.toFixed(2)}</p>
              </div>
              <div className={`p-2 rounded-full ${
                  balanceAfterPurchase > 0 
                    ? "bg-budget-green/20" 
                    : "bg-budget-red/20"
                }`}>
                {balanceAfterPurchase > 0 
                  ? <TrendingUp className="h-5 w-5 text-budget-green" /> 
                  : <TrendingDown className="h-5 w-5 text-budget-red" />
                }
              </div>
            </div>
            
            {/* Overall Budget Impact */}
            <div className="text-sm">
              <span className="text-muted-foreground">Overall Budget Impact: </span>
              <span>{overallBudgetImpact}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DecisionResult;
