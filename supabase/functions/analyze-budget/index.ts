
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, amount, description, categorySpent, categoryLimit, balance } = await req.json();

    // Enhanced analysis logic
    const insights = [];
    let suggestion = "";
    let confidence = 0.8;

    // Calculate metrics
    const percentOfBudget = (categorySpent / categoryLimit) * 100;
    const newPercentOfBudget = ((categorySpent + amount) / categoryLimit) * 100;
    const impactOnTotal = (amount / balance) * 100;
    
    // Categorize purchase size
    const isPurchaseLarge = amount > categoryLimit * 0.4;
    const isBudgetNearlyDepleted = newPercentOfBudget > 85;
    const isBudgetExceeded = newPercentOfBudget > 100;
    
    // Generate insights based on category and spending patterns
    if (category.toLowerCase() === "food") {
      if (isBudgetExceeded) {
        insights.push("You've already exceeded your food budget this month.");
        insights.push("Consider more economical food options for the rest of the month.");
        suggestion = "Look for grocery deals or cook more at home instead of eating out";
        confidence = 0.9;
      } else if (isBudgetNearlyDepleted) {
        insights.push("You're approaching your food budget limit this month.");
        insights.push("This purchase would use " + newPercentOfBudget.toFixed(1) + "% of your monthly food budget.");
        suggestion = "This purchase fits your budget but be careful with additional food expenses this month";
        confidence = 0.85;
      } else {
        insights.push("Your food spending is within normal ranges.");
        suggestion = "This purchase aligns with your typical food spending patterns";
        confidence = 0.9;
      }
    } else if (category.toLowerCase() === "entertainment") {
      if (isBudgetExceeded) {
        insights.push("You've already exceeded your entertainment budget this month.");
        insights.push("Consider free entertainment options for the remainder of the month.");
        suggestion = "Wait until next month for additional entertainment expenses";
        confidence = 0.85;
      } else if (isPurchaseLarge) {
        insights.push("This is a significant entertainment expense.");
        suggestion = "Consider if this entertainment purchase is a priority right now";
        confidence = 0.75;
      } else {
        insights.push("This entertainment expense fits within your typical spending pattern.");
        suggestion = "Enjoy your purchase while staying within your entertainment budget";
        confidence = 0.85;
      }
    } else if (category.toLowerCase() === "shopping") {
      // Check if it's a large one-time purchase
      if (isPurchaseLarge) {
        insights.push("This is a significant one-time shopping expense.");
        insights.push("Consider if this item is a necessity or if it can wait.");
        suggestion = "For large purchases, consider the 24-hour rule before buying";
        confidence = 0.75;
      } else if (isBudgetNearlyDepleted) {
        insights.push("You're nearing your shopping budget limit this month.");
        suggestion = "Consider waiting until next month for non-essential purchases";
        confidence = 0.8;
      } else {
        insights.push("This shopping expense is within reasonable limits.");
        suggestion = "This purchase fits your shopping patterns";
        confidence = 0.85;
      }
    } else {
      // Generic insights for other categories
      if (isBudgetExceeded) {
        insights.push(`This purchase would exceed your ${category} budget by ${(newPercentOfBudget - 100).toFixed(1)}%.`);
        suggestion = "Consider if this purchase can wait until next month";
        confidence = 0.8;
      } else if (isBudgetNearlyDepleted) {
        insights.push(`You'll be using ${newPercentOfBudget.toFixed(1)}% of your ${category} budget after this purchase.`);
        suggestion = "Be cautious with other expenses in this category for the rest of the month";
        confidence = 0.85;
      } else {
        insights.push(`This ${category} expense appears reasonable based on your spending patterns.`);
        suggestion = "This purchase aligns with your budget priorities";
        confidence = 0.85;
      }
    }
    
    // Add context about overall financial impact
    if (impactOnTotal > 10) {
      insights.push(`This purchase represents a significant ${impactOnTotal.toFixed(1)}% of your total available balance.`);
      confidence *= 0.9;
    }
    
    // Consider the description for more personalized advice
    if (description && description.length > 0) {
      const lowerDesc = description.toLowerCase();
      if (lowerDesc.includes("emergency") || lowerDesc.includes("urgent") || lowerDesc.includes("need")) {
        insights.push("Since this appears to be an urgent purchase, prioritize it appropriately.");
        confidence *= 1.05;
      } else if (lowerDesc.includes("want") || lowerDesc.includes("like")) {
        insights.push("This seems to be a discretionary purchase rather than a necessity.");
        suggestion += ". Consider if it's a want or a need";
        confidence *= 0.95;
      }
    }

    return new Response(
      JSON.stringify({
        additionalInsights: insights,
        suggestion: suggestion,
        confidence: Math.min(confidence, 0.98),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-budget function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to analyze budget",
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
