
// This service would integrate with an AI model to provide intelligent analysis
// For demo purposes, we'll simulate AI responses

// AI analysis types
export type AIAnalysis = {
  additionalInsights: string[];
  suggestion: string;
  confidence: number;
};

// Simulate AI analysis of purchase decision
export const generateAIAnalysis = async (
  category: string,
  amount: number,
  description: string,
  currentSpending: number,
  budget: number
): Promise<AIAnalysis> => {
  // In a real app, this would call an AI API
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      let insights: string[] = [];
      let suggestion = "";
      let confidence = 0.8;
      
      // Generate custom insights based on category and spending patterns
      const percentOfBudget = (currentSpending / budget) * 100;
      const newPercentOfBudget = ((currentSpending + amount) / budget) * 100;
      
      if (category === "Food") {
        if (newPercentOfBudget > 80) {
          insights.push("Your food spending is trending higher than previous months.");
          insights.push("Consider meal planning to reduce costs for the rest of the month.");
          suggestion = "Look for grocery deals or cook more at home";
          confidence = 0.85;
        } else {
          insights.push("Your food spending is within normal ranges.");
          suggestion = "This purchase aligns with your typical food spending patterns";
          confidence = 0.9;
        }
      } else if (category === "Entertainment") {
        if (newPercentOfBudget > 90) {
          insights.push("You're approaching your entertainment budget limit this month.");
          insights.push("Consider free activities for the remainder of the month.");
          suggestion = "Wait until next month for additional entertainment expenses";
          confidence = 0.75;
        } else {
          insights.push("This entertainment expense fits within your typical spending pattern.");
          suggestion = "Enjoy your purchase while staying within your entertainment budget";
          confidence = 0.85;
        }
      } else if (category === "Shopping") {
        // Check if it's a large one-time purchase
        if (amount > budget * 0.5) {
          insights.push("This is a significant one-time shopping expense.");
          insights.push("Consider if this item is a necessity or if it can wait.");
          suggestion = "For large purchases, consider the 24-hour rule before buying";
          confidence = 0.7;
        } else {
          insights.push("This shopping expense is within reasonable limits.");
          suggestion = "This purchase fits your shopping patterns";
          confidence = 0.85;
        }
      } else {
        // Generic insights for other categories
        if (newPercentOfBudget > 85) {
          insights.push(`You'll be using ${newPercentOfBudget.toFixed(1)}% of your ${category} budget after this purchase.`);
          suggestion = "Consider if this purchase can wait until next month";
          confidence = 0.75;
        } else {
          insights.push(`This ${category} expense appears reasonable based on your spending patterns.`);
          suggestion = "This purchase aligns with your budget priorities";
          confidence = 0.85;
        }
      }
      
      resolve({
        additionalInsights: insights,
        suggestion,
        confidence
      });
    }, 700);
  });
};
