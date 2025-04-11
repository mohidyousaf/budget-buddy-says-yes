
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Enhanced data model based on user requirements
export type SheetData = {
  credits: Array<{
    description: string;
    amount: number;
  }>;
  debits: Array<{
    description: string;
    amount: number;
    date: string;
    type: string;
    expenseType: string;
  }>;
  categories: Array<{
    name: string;
    spent: number;
    limit: number;
    remaining: number;
  }>;
  summary: {
    totalCredits: number;
    totalDebits: number;
    currentBalance: number;
    inflow: number;
    outflow: number;
    net: number;
    month: string; // Added to track the current month
  };
  // New fields to track historical data
  historicalData: {
    months: string[];
    spending: Record<string, Record<string, number>>;
    income: Record<string, number>;
  };
  assets: Array<{
    type: string;
    value: number;
    growth: number;
  }>;
  specialExpenses: Array<{
    type: string;
    amount: number;
    date: string;
  }>;
};

// Fetch saved sheet URL from localStorage as a fallback
export const getSavedSheetUrl = async (): Promise<string | null> => {
  try {
    // Use the Supabase RPC function to fetch sheet URL
    const { data, error } = await supabase
      .rpc('get_sheet_url')
      .single();
    
    if (error) {
      console.error("Error fetching saved sheet URL:", error);
      // Fallback to localStorage
      return localStorage.getItem('sheetUrl');
    }
    
    return data?.sheet_url || localStorage.getItem('sheetUrl');
  } catch (error) {
    console.error("Error fetching saved sheet URL:", error);
    // Fallback to localStorage
    return localStorage.getItem('sheetUrl');
  }
};

// Save sheet URL to Supabase and localStorage for future use
export const saveSheetUrl = async (url: string): Promise<void> => {
  try {
    // Save to localStorage as fallback
    localStorage.setItem('sheetUrl', url);
    
    // Use the Supabase RPC function to save sheet URL
    const { error } = await supabase
      .rpc('save_sheet_url', { 
        p_id: 'default', 
        p_url: url 
      });
    
    if (error) throw error;
  } catch (error) {
    console.error("Error saving sheet URL:", error);
    toast.error("Failed to save sheet URL to cloud");
  }
};

// Function to fetch and parse Google Sheet data
export const fetchSheetData = async (url: string): Promise<SheetData> => {
  // Save the URL for future use
  await saveSheetUrl(url);
  
  // In a real app, this would connect to the Google Sheets API
  // For demo purposes, we'll simulate a network request
  
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Updated mock data based on user's latest information - March 2025
      const mockData: SheetData = {
        credits: [
          { description: "salary", amount: 322000 }
        ],
        debits: [
          { description: "shopping", amount: 55400, date: "2025-03-15", type: "Shopping", expenseType: "Discretionary" },
          { description: "car", amount: 7000, date: "2025-03-10", type: "Car", expenseType: "Fixed" },
          { description: "cat", amount: 7200, date: "2025-03-05", type: "Pets", expenseType: "Fixed" },
          { description: "noor", amount: 68256, date: "2025-03-20", type: "Education", expenseType: "Fixed" },
          { description: "domestic", amount: 25000, date: "2025-03-13", type: "Utilities", expenseType: "Fixed" },
          { description: "shipping", amount: 35000, date: "2025-03-13", type: "Shipping", expenseType: "Fixed" },
          { description: "food", amount: 5000, date: "2025-03-13", type: "Food", expenseType: "Fixed" },
          { description: "entertainment", amount: 3000, date: "2025-03-13", type: "Entertainment", expenseType: "Discretionary" },
          { description: "grocery", amount: 10000, date: "2025-03-13", type: "Grocery", expenseType: "Fixed" },
        ],
        categories: [
          { name: "Car", spent: 7000, limit: 10000, remaining: 3000 },
          { name: "Pets", spent: 7200, limit: 10000, remaining: 2800 },
          { name: "Shopping", spent: 55400, limit: 60000, remaining: 4600 },
          { name: "Education", spent: 68256, limit: 70000, remaining: 1744 },
          { name: "Shipping", spent: 35000, limit: 40000, remaining: 5000 },
          { name: "Food", spent: 5000, limit: 20000, remaining: 15000 },
          { name: "Entertainment", spent: 3000, limit: 4000, remaining: 1000 },
          { name: "Grocery", spent: 10000, limit: 10000, remaining: 0 },
          { name: "Utilities", spent: 25000, limit: 40000, remaining: 15000 },
        ],
        summary: {
          totalCredits: 322000,
          totalDebits: 215856,
          currentBalance: 1684144,
          inflow: 322000,
          outflow: 215856,
          net: 106144,
          month: "March 2025"
        },
        // Added historical data for trend analysis
        historicalData: {
          months: ["Jan 2025", "Feb 2025", "Mar 2025"],
          spending: {
            "Car": { "Jan 2025": 6500, "Feb 2025": 6800, "Mar 2025": 7000 },
            "Pets": { "Jan 2025": 5000, "Feb 2025": 6100, "Mar 2025": 7200 },
            "Shopping": { "Jan 2025": 42000, "Feb 2025": 48000, "Mar 2025": 55400 },
            "Education": { "Jan 2025": 65000, "Feb 2025": 67000, "Mar 2025": 68256 },
            "Shipping": { "Jan 2025": 32000, "Feb 2025": 33500, "Mar 2025": 35000 },
            "Food": { "Jan 2025": 8000, "Feb 2025": 6500, "Mar 2025": 5000 },
            "Entertainment": { "Jan 2025": 4500, "Feb 2025": 3800, "Mar 2025": 3000 },
            "Grocery": { "Jan 2025": 12000, "Feb 2025": 11000, "Mar 2025": 10000 },
            "Utilities": { "Jan 2025": 27000, "Feb 2025": 26000, "Mar 2025": 25000 }
          },
          income: { "Jan 2025": 315000, "Feb 2025": 318000, "Mar 2025": 322000 }
        },
        // Added asset data
        assets: [
          { type: "Savings", value: 2500000, growth: 0.03 },
          { type: "Investments", value: 1200000, growth: 0.07 },
          { type: "Property", value: 8000000, growth: 0.05 }
        ],
        // Added special expenses
        specialExpenses: [
          { type: "Wedding", amount: 1200000, date: "2024-12-15" },
          { type: "Renovation", amount: 800000, date: "2025-01-10" },
          { type: "Umrah", amount: 650000, date: "2025-02-05" }
        ]
      };

      toast.success("Balance sheet data loaded for " + mockData.summary.month);
      resolve(mockData);
    }, 1500);
  });
};

// Helper function to get category spending information
export const getCategoryData = (sheetData: SheetData, categoryName: string) => {
  const category = sheetData.categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
  
  if (!category) {
    // If category doesn't exist, return default values
    return {
      spent: 0,
      limit: 1000, // Default budget limit
      remaining: 1000
    };
  }
  
  return category;
};

// New function to analyze spending trends
export const analyzeSpendingTrends = (sheetData: SheetData) => {
  const trends = [];
  
  // Check for categories with increasing spending
  for (const category of sheetData.categories) {
    const categoryHistory = sheetData.historicalData.spending[category.name];
    if (!categoryHistory) continue;
    
    const months = Object.keys(categoryHistory);
    if (months.length < 2) continue;
    
    const latestMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];
    
    const latestSpending = categoryHistory[latestMonth];
    const previousSpending = categoryHistory[previousMonth];
    
    const percentChange = ((latestSpending - previousSpending) / previousSpending) * 100;
    
    if (percentChange > 5) {
      trends.push({
        category: category.name,
        change: percentChange.toFixed(1),
        message: `Your ${category.name} spending has increased by ${percentChange.toFixed(1)}% since last month.`
      });
    } else if (percentChange < -5) {
      trends.push({
        category: category.name,
        change: percentChange.toFixed(1),
        message: `Great job! You've reduced your ${category.name} spending by ${Math.abs(percentChange).toFixed(1)}% since last month.`
      });
    }
  }
  
  return trends;
};

// New function to get financial wellness score (0-100)
export const getFinancialWellnessScore = (sheetData: SheetData) => {
  // Factors to consider:
  // 1. Savings rate (income - expenses / income)
  // 2. Budget adherence (how many categories are over budget)
  // 3. Asset growth
  // 4. Debt (not implemented yet)
  
  const latestMonth = sheetData.summary.month;
  const monthlyIncome = sheetData.summary.totalCredits;
  const monthlyExpenses = sheetData.summary.totalDebits;
  
  // Calculate savings rate (0-40 points)
  const savingsRate = (monthlyIncome - monthlyExpenses) / monthlyIncome;
  const savingsScore = Math.min(40, Math.round(savingsRate * 100));
  
  // Calculate budget adherence (0-30 points)
  const categoriesOverBudget = sheetData.categories.filter(cat => cat.remaining < 0).length;
  const budgetScore = Math.max(0, 30 - (categoriesOverBudget * 5));
  
  // Calculate asset growth (0-30 points)
  const totalAssetValue = sheetData.assets.reduce((sum, asset) => sum + asset.value, 0);
  const weightedGrowth = sheetData.assets.reduce((sum, asset) => sum + (asset.growth * (asset.value / totalAssetValue)), 0);
  const assetScore = Math.min(30, Math.round(weightedGrowth * 300));
  
  // Calculate total score
  const totalScore = savingsScore + budgetScore + assetScore;
  
  return {
    score: totalScore,
    savingsRate: savingsRate,
    categoriesOverBudget: categoriesOverBudget,
    assetGrowth: weightedGrowth,
    breakdown: {
      savings: savingsScore,
      budget: budgetScore,
      assets: assetScore
    },
    interpretation: totalScore >= 80 ? "Excellent" : 
                   totalScore >= 60 ? "Good" :
                   totalScore >= 40 ? "Fair" : "Needs Improvement"
  };
};
