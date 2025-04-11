
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SheetData, getFinancialWellnessScore } from "./sheetService";

// AI analysis types
export type AIAnalysis = {
  additionalInsights: string[];
  suggestion: string;
  confidence: number;
  investmentAdvice?: string;
};

// Enhanced AI analysis of purchase decision using Supabase Edge Function
export const generateAIAnalysis = async (
  category: string,
  amount: number,
  description: string,
  currentSpending: number,
  budget: number,
  sheetData?: SheetData
): Promise<AIAnalysis> => {
  try {
    // Get the current balance from localStorage or use a default
    const balanceString = localStorage.getItem('currentBalance');
    const balance = balanceString ? parseFloat(balanceString) : 100000;
    
    // Calculate financial wellness if sheet data is available
    const financialWellness = sheetData ? getFinancialWellnessScore(sheetData) : null;
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-budget', {
      body: {
        category,
        amount,
        description,
        categorySpent: currentSpending,
        categoryLimit: budget,
        balance,
        historicalData: sheetData?.historicalData,
        financialWellness
      }
    });

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message);
    }
    
    return data as AIAnalysis;
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    
    // Fallback to basic analysis
    const insights = [
      `Analyzing your ${category} budget of PKR ${budget.toLocaleString()}.`,
      `You've already spent PKR ${currentSpending.toLocaleString()} in this category.`
    ];
    
    if (currentSpending + amount > budget) {
      insights.push("This purchase would exceed your category budget.");
    } else {
      insights.push("This purchase fits within your budget for this category.");
    }
    
    if (sheetData) {
      const wellness = getFinancialWellnessScore(sheetData);
      insights.push(`Your financial wellness score is ${wellness.score}/100 (${wellness.interpretation}).`);
    }
    
    toast.error("Failed to connect to AI service, using basic analysis instead");
    
    return {
      additionalInsights: insights,
      suggestion: "Consider your budget priorities when making this purchase",
      confidence: 0.7
    };
  }
};
