
import { SheetData, getCategoryData } from "./sheetService";

export type DecisionType = "yes" | "no" | "caution";

export type DecisionMetrics = {
  categoryBudget: number;
  categorySpent: number;
  balanceAfterPurchase: number;
  overallBudgetImpact: string;
};

export type Decision = {
  decision: DecisionType;
  reasoning: string[];
  metrics: DecisionMetrics;
};

export const analyzePurchase = (
  sheetData: SheetData,
  amount: number,
  category: string,
  description: string
): Decision => {
  const categoryData = getCategoryData(sheetData, category);
  const balance = sheetData.summary.currentBalance;
  const balanceAfterPurchase = balance - amount;
  
  const reasoning: string[] = [];
  
  // Check if purchase exceeds current balance
  const hasEnoughBalance = balanceAfterPurchase > 0;
  
  // Check if purchase exceeds category budget
  const newCategorySpent = categoryData.spent + amount;
  const exceedsCategoryBudget = newCategorySpent > categoryData.limit;
  const categoryRemainingAfterPurchase = categoryData.limit - newCategorySpent;
  
  // Check what percentage of the category budget will be used after purchase
  const categoryUsagePercentage = (newCategorySpent / categoryData.limit) * 100;
  
  // Check overall budget impact
  const purchaseToBalanceRatio = (amount / balance) * 100;
  
  // Calculate metrics
  const metrics: DecisionMetrics = {
    categoryBudget: categoryData.limit,
    categorySpent: categoryData.spent,
    balanceAfterPurchase,
    overallBudgetImpact: purchaseToBalanceRatio < 1 
      ? "Minimal impact on overall budget" 
      : purchaseToBalanceRatio < 5 
        ? "Moderate impact on overall budget" 
        : "Significant impact on overall budget"
  };
  
  // Begin determining decision
  let decision: DecisionType;
  
  // If balance would be negative, immediate no
  if (!hasEnoughBalance) {
    decision = "no";
    reasoning.push(`This purchase would put your account in the negative with a balance of PKR ${balanceAfterPurchase.toLocaleString()}.`);
    reasoning.push(`You currently have PKR ${balance.toLocaleString()} available.`);
  }
  // If exceeds category budget substantially, likely no
  else if (exceedsCategoryBudget && categoryRemainingAfterPurchase < -0.1 * categoryData.limit) {
    decision = "no";
    reasoning.push(`This would exceed your ${category} budget by PKR ${(-categoryRemainingAfterPurchase).toLocaleString()}.`);
    reasoning.push(`You've already spent PKR ${categoryData.spent.toLocaleString()} of your PKR ${categoryData.limit.toLocaleString()} ${category} budget.`);
    reasoning.push(`Consider postponing this purchase to next month or adjusting your budget.`);
  }
  // If just slightly exceeds category budget, caution
  else if (exceedsCategoryBudget) {
    decision = "caution";
    reasoning.push(`This would slightly exceed your ${category} budget by PKR ${(-categoryRemainingAfterPurchase).toLocaleString()}.`);
    reasoning.push(`You have PKR ${categoryData.remaining.toLocaleString()} remaining in your ${category} budget.`);
    reasoning.push(`You might need to reduce spending in this category for the rest of the month.`);
  }
  // If close to category budget, caution
  else if (categoryUsagePercentage > 85) {
    decision = "caution";
    reasoning.push(`This purchase would use ${categoryUsagePercentage.toFixed(1)}% of your ${category} budget.`);
    reasoning.push(`You'll have only PKR ${categoryRemainingAfterPurchase.toLocaleString()} remaining in your ${category} budget after this purchase.`);
    reasoning.push(`Be mindful of additional ${category} expenses for the rest of the month.`);
  }
  // If significant portion of overall balance, caution
  else if (purchaseToBalanceRatio > 10) {
    decision = "caution";
    reasoning.push(`This purchase represents ${purchaseToBalanceRatio.toFixed(1)}% of your current balance.`);
    reasoning.push(`While you can afford it, it's a significant expense relative to your total funds.`);
    reasoning.push(`Consider if this purchase is a priority right now.`);
  }
  // Otherwise, yes
  else {
    decision = "yes";
    reasoning.push(`You have sufficient funds for this purchase (PKR ${balance.toLocaleString()} available).`);
    reasoning.push(`You'll still have PKR ${categoryRemainingAfterPurchase.toLocaleString()} remaining in your ${category} budget after this purchase.`);
    reasoning.push(`This purchase fits well within your budget plan.`);
  }
  
  return {
    decision,
    reasoning,
    metrics
  };
};
