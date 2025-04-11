
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
    cashInHand: number;
  };
  // Historical data for trend analysis
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

// Type definitions for RPC functions
type GetSheetUrlResponse = {
  sheet_url: string | null;
};

type SaveSheetUrlParams = {
  p_id: string;
  p_url: string;
};

// Fetch saved sheet URL from localStorage as a fallback
export const getSavedSheetUrl = async (): Promise<string | null> => {
  try {
    // Use the Supabase RPC function to fetch sheet URL with proper typing
    const { data, error } = await supabase.rpc('get_sheet_url') as {
      data: GetSheetUrlResponse | null;
      error: any;
    };
    
    if (error) {
      console.error("Error fetching saved sheet URL:", error);
      // Fallback to localStorage
      return localStorage.getItem('sheetUrl');
    }
    
    if (data) {
      return data.sheet_url || localStorage.getItem('sheetUrl');
    }
    
    // Fallback to localStorage if no data
    return localStorage.getItem('sheetUrl');
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
    const { error } = await supabase.rpc('save_sheet_url', {
      p_id: 'default',
      p_url: url
    }) as { error: any };
    
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
          { description: "INFLOW", amount: 378000 }
        ],
        debits: [
          { description: "car", amount: 7000, date: "2025-03-15", type: "Car", expenseType: "Fixed" },
          { description: "shopping", amount: 55400, date: "2025-03-10", type: "Shopping", expenseType: "Discretionary" },
          { description: "Petrol", amount: 6000, date: "2025-03-05", type: "Petrol", expenseType: "Fixed" },
          { description: "FixedCost", amount: 24000, date: "2025-03-20", type: "FixedCost", expenseType: "Fixed" },
          { description: "Food", amount: 2500, date: "2025-03-13", type: "Food", expenseType: "Fixed" },
          { description: "Entertainment", amount: 0, date: "2025-03-13", type: "Entertainment", expenseType: "Discretionary" },
          { description: "Grocery", amount: 6595, date: "2025-03-13", type: "Grocery", expenseType: "Fixed" },
          { description: "Payable", amount: 169748, date: "2025-03-13", type: "Payable", expenseType: "Fixed" },
          { description: "Grooming", amount: 0, date: "2025-03-13", type: "Grooming", expenseType: "Discretionary" },
          { description: "Loans", amount: 0, date: "2025-03-13", type: "Loans", expenseType: "Fixed" },
          { description: "Cat", amount: 7200, date: "2025-03-13", type: "Cat", expenseType: "Fixed" },
          { description: "umrah", amount: 0, date: "2025-03-13", type: "umrah", expenseType: "Discretionary" },
          { description: "Shadi", amount: 12000, date: "2025-03-13", type: "Shadi", expenseType: "Variable" },
          { description: "noor", amount: 68256, date: "2025-03-20", type: "noor", expenseType: "Variable" },
        ],
        categories: [
          { name: "Car", spent: 7000, limit: 5000, remaining: -2000 },
          { name: "Shopping", spent: 55400, limit: 8000, remaining: -47400 },
          { name: "Petrol", spent: 6000, limit: 20000, remaining: 14000 },
          { name: "FixedCost", spent: 24000, limit: 15000, remaining: -9000 },
          { name: "Food", spent: 2500, limit: 8000, remaining: 5500 },
          { name: "Entertainment", spent: 0, limit: 4000, remaining: 4000 },
          { name: "Grocery", spent: 6595, limit: 40000, remaining: 33405 },
          { name: "Payable", spent: 169748, limit: 85000, remaining: -84748 },
          { name: "Grooming", spent: 0, limit: 5000, remaining: 5000 },
          { name: "Loans", spent: 0, limit: 0, remaining: 0 },
          { name: "Cat", spent: 7200, limit: 0, remaining: -7200 },
          { name: "umrah", spent: 0, limit: 190000, remaining: 190000 },
          { name: "Shadi", spent: 12000, limit: 0, remaining: -12000 },
          { name: "noor", spent: 68256, limit: 0, remaining: -68256 },
        ],
        summary: {
          totalCredits: 378000,
          totalDebits: 350604,
          currentBalance: 1596612,
          inflow: 378000,
          outflow: 350604,
          net: 27396,
          month: "March 2025",
          cashInHand: 1577311
        },
        // Added historical data for trend analysis
        historicalData: {
          months: ["Jan 2025", "Feb 2025", "Mar 2025"],
          spending: {
            "Car": { "Jan 2025": 6500, "Feb 2025": 6800, "Mar 2025": 7000 },
            "Shopping": { "Jan 2025": 42000, "Feb 2025": 48000, "Mar 2025": 55400 },
            "Petrol": { "Jan 2025": 5800, "Feb 2025": 5900, "Mar 2025": 6000 },
            "FixedCost": { "Jan 2025": 20000, "Feb 2025": 22000, "Mar 2025": 24000 },
            "Food": { "Jan 2025": 3000, "Feb 2025": 2800, "Mar 2025": 2500 },
            "Entertainment": { "Jan 2025": 2000, "Feb 2025": 1000, "Mar 2025": 0 },
            "Grocery": { "Jan 2025": 6000, "Feb 2025": 6200, "Mar 2025": 6595 },
            "Payable": { "Jan 2025": 145000, "Feb 2025": 155000, "Mar 2025": 169748 },
            "Cat": { "Jan 2025": 6800, "Feb 2025": 7000, "Mar 2025": 7200 },
            "Shadi": { "Jan 2025": 10000, "Feb 2025": 11000, "Mar 2025": 12000 },
            "noor": { "Jan 2025": 65000, "Feb 2025": 67000, "Mar 2025": 68256 }
          },
          income: { "Jan 2025": 360000, "Feb 2025": 370000, "Mar 2025": 378000 }
        },
        // Added asset data
        assets: [
          { type: "Savings", value: 2500000, growth: 0.03 },
          { type: "Investments", value: 1200000, growth: 0.07 },
          { type: "Property", value: 8000000, growth: 0.05 }
        ],
        // Added special expenses
        specialExpenses: [
          { type: "renovation", amount: 800000, date: "2025-01-10" },
          { type: "Shadi", amount: 1200000, date: "2024-12-15" },
          { type: "umrah", amount: 650000, date: "2025-02-05" }
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

// Function to analyze spending trends
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

// Function to get financial wellness score (0-100)
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

// NEW: Function to filter trend data for selected months
export const getFilteredTrendData = (sheetData: SheetData, monthsToShow: number): {
  filteredMonths: string[];
  filteredSpending: Record<string, Record<string, number>>;
} => {
  const allMonths = [...sheetData.historicalData.months];
  const filteredMonths = allMonths.slice(-monthsToShow); // Get last n months
  
  // Create filtered spending data
  const filteredSpending: Record<string, Record<string, number>> = {};
  
  Object.entries(sheetData.historicalData.spending).forEach(([category, monthlyData]) => {
    filteredSpending[category] = {};
    
    filteredMonths.forEach(month => {
      if (monthlyData[month] !== undefined) {
        filteredSpending[category][month] = monthlyData[month];
      }
    });
  });
  
  return { filteredMonths, filteredSpending };
};
