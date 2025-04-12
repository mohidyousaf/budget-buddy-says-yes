import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";

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

// Fetch saved sheet URL from Supabase
export const getSavedSheetUrl = async (): Promise<string | null> => {
  try {
    // Use the Supabase RPC function to fetch sheet URL
    const { data, error } = await supabase.rpc('get_sheet_url');
    
    if (error) {
      console.error("Error fetching saved sheet URL:", error);
      // Fallback to localStorage
      return localStorage.getItem('sheetUrl');
    }
    
    if (data) {
      return data.sheet_url;
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
    });
    
    if (error) throw error;
  } catch (error) {
    console.error("Error saving sheet URL:", error);
    toast.error("Failed to save sheet URL to cloud");
  }
};

// Function to parse Google Sheets CSV data
const parseGoogleSheetCSV = async (url: string): Promise<any> => {
  try {
    // Extract the sheet ID from the URL
    const sheetIdMatch = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      throw new Error("Invalid Google Sheet URL");
    }
    
    const sheetId = sheetIdMatch[1];
    // Form the CSV export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    
    // Fetch the CSV data
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch Google Sheet data");
    }
    
    const csvText = await response.text();
    
    // Parse CSV using PapaParse
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("Error parsing Google Sheet:", error);
    throw error;
  }
};

// Function to get current month and year
const getCurrentMonthYear = (): { month: string; year: number } => {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return { month, year };
};

// Function to save current month data to Supabase
const saveCurrentMonthToSupabase = async (
  sheetData: any,
  month: string,
  year: number
): Promise<void> => {
  try {
    // First check if this month already exists
    const { data: existingMonth } = await supabase
      .from('financial_data')
      .select('id')
      .eq('month', month)
      .eq('year', year)
      .single();
    
    // If it exists, update it instead of inserting
    if (existingMonth) {
      // Delete existing data for this month to replace with fresh data
      await supabase
        .from('category_data')
        .delete()
        .eq('financial_data_id', existingMonth.id);
      
      await supabase
        .from('transactions')
        .delete()
        .eq('financial_data_id', existingMonth.id);
      
      // Update financial data summary
      await supabase
        .from('financial_data')
        .update({
          total_credits: sheetData.summary.totalCredits,
          total_debits: sheetData.summary.totalDebits,
          current_balance: sheetData.summary.currentBalance,
          cash_in_hand: sheetData.summary.cashInHand
        })
        .eq('id', existingMonth.id);
      
      // Re-insert category data
      for (const category of sheetData.categories) {
        await supabase.from('category_data').insert({
          financial_data_id: existingMonth.id,
          name: category.name,
          spent: category.spent,
          budget_limit: category.limit,
          remaining: category.remaining
        });
      }
      
      // Re-insert transactions
      for (const debit of sheetData.debits) {
        await supabase.from('transactions').insert({
          financial_data_id: existingMonth.id,
          description: debit.description,
          amount: debit.amount,
          transaction_type: 'debit',
          category: debit.type,
          expense_type: debit.expenseType,
          transaction_date: debit.date
        });
      }
      
      for (const credit of sheetData.credits) {
        await supabase.from('transactions').insert({
          financial_data_id: existingMonth.id,
          description: credit.description,
          amount: credit.amount,
          transaction_type: 'credit',
          transaction_date: new Date().toISOString().split('T')[0]
        });
      }
    } else {
      // Insert new month data
      const { data: newMonth, error } = await supabase
        .from('financial_data')
        .insert({
          month,
          year,
          total_credits: sheetData.summary.totalCredits,
          total_debits: sheetData.summary.totalDebits,
          current_balance: sheetData.summary.currentBalance,
          cash_in_hand: sheetData.summary.cashInHand
        })
        .select('id')
        .single();
        
      if (error || !newMonth) {
        throw error || new Error("Failed to insert financial data");
      }
      
      // Insert category data
      for (const category of sheetData.categories) {
        await supabase.from('category_data').insert({
          financial_data_id: newMonth.id,
          name: category.name,
          spent: category.spent,
          budget_limit: category.limit,
          remaining: category.remaining
        });
      }
      
      // Insert transactions
      for (const debit of sheetData.debits) {
        await supabase.from('transactions').insert({
          financial_data_id: newMonth.id,
          description: debit.description,
          amount: debit.amount,
          transaction_type: 'debit',
          category: debit.type,
          expense_type: debit.expenseType,
          transaction_date: debit.date
        });
      }
      
      for (const credit of sheetData.credits) {
        await supabase.from('transactions').insert({
          financial_data_id: newMonth.id,
          description: credit.description,
          amount: credit.amount,
          transaction_type: 'credit',
          transaction_date: new Date().toISOString().split('T')[0]
        });
      }
    }
    
    toast.success(`Updated ${month} ${year} data in database`);
  } catch (error) {
    console.error("Error saving current month to Supabase:", error);
    toast.error("Failed to save current month data");
  }
};

// Function to parse Google Sheet data into our format
const parseGoogleSheetData = async (rawData: any[]): Promise<SheetData> => {
  try {
    // Extract credits (income)
    const credits = rawData
      .filter(row => row.Type === 'credit')
      .map(row => ({
        description: row.Description || 'INFLOW',
        amount: Number(row.Amount) || 0
      }));
      
    // Extract debits (expenses)
    const debits = rawData
      .filter(row => row.Type === 'debit')
      .map(row => ({
        description: row.Description || '',
        amount: Number(row.Amount) || 0,
        date: row.Date || new Date().toISOString().split('T')[0],
        type: row.Category || 'Other',
        expenseType: row.ExpenseType || 'Fixed'
      }));
      
    // Calculate totals
    const totalCredits = credits.reduce((sum, credit) => sum + credit.amount, 0);
    const totalDebits = debits.reduce((sum, debit) => sum + debit.amount, 0);
    const currentBalance = rawData.find(row => row.Description === 'BALANCE')?.Amount || 0;
    const cashInHand = rawData.find(row => row.Description === 'CASH_IN_HAND')?.Amount || 0;
    
    // Extract categories and budgets
    const categoriesMap = new Map();
    rawData
      .filter(row => row.Type === 'category')
      .forEach(row => {
        categoriesMap.set(row.Category, {
          name: row.Category,
          spent: Number(row.Spent) || 0,
          limit: Number(row.Budget) || 0,
          remaining: Number(row.Remaining) || 0
        });
      });
      
    // Convert map to array for categories
    const categories = Array.from(categoriesMap.values());
    
    // Get current month and year
    const { month, year } = getCurrentMonthYear();
    
    // Create basic SheetData object
    const sheetData: SheetData = {
      credits,
      debits,
      categories,
      summary: {
        totalCredits,
        totalDebits,
        currentBalance: Number(currentBalance),
        inflow: totalCredits,
        outflow: totalDebits,
        net: totalCredits - totalDebits,
        month: `${month} ${year}`,
        cashInHand: Number(cashInHand)
      },
      historicalData: {
        months: [`${month} ${year}`],
        spending: {},
        income: { [`${month} ${year}`]: totalCredits }
      },
      assets: [
        { type: "Savings", value: Number(rawData.find(row => row.Type === 'asset' && row.Category === 'Savings')?.Amount) || 0, growth: 0.03 },
        { type: "Investments", value: Number(rawData.find(row => row.Type === 'asset' && row.Category === 'Investments')?.Amount) || 0, growth: 0.07 },
        { type: "Property", value: Number(rawData.find(row => row.Type === 'asset' && row.Category === 'Property')?.Amount) || 0, growth: 0.05 }
      ],
      specialExpenses: [
        { type: "renovation", amount: Number(rawData.find(row => row.Type === 'special' && row.Category === 'renovation')?.Amount) || 0, date: "2025-01-10" },
        { type: "Shadi", amount: Number(rawData.find(row => row.Type === 'special' && row.Category === 'Shadi')?.Amount) || 0, date: "2024-12-15" },
        { type: "umrah", amount: Number(rawData.find(row => row.Type === 'special' && row.Category === 'umrah')?.Amount) || 0, date: "2025-02-05" }
      ]
    };
    
    // Set up spending data for the current month
    categories.forEach(category => {
      if (!sheetData.historicalData.spending[category.name]) {
        sheetData.historicalData.spending[category.name] = {};
      }
      sheetData.historicalData.spending[category.name][`${month} ${year}`] = category.spent;
    });
    
    return sheetData;
  } catch (error) {
    console.error("Error parsing Google Sheet data:", error);
    throw error;
  }
};

// Function to merge current month data with historical data from Supabase
const mergeWithHistoricalData = async (currentMonthData: SheetData): Promise<SheetData> => {
  try {
    // Fetch historical financial data from Supabase
    const { data: financialData, error: financialDataError } = await supabase
      .from('financial_data')
      .select('*')
      .order('year', { ascending: true })
      .order('month', { ascending: true });
    
    if (financialDataError) {
      throw financialDataError;
    }
    
    // Fetch all category data
    const { data: categoryData, error: categoryDataError } = await supabase
      .from('category_data')
      .select('*, financial_data!inner(month, year)')
      .order('financial_data.year', { ascending: true })
      .order('financial_data.month', { ascending: true });
    
    if (categoryDataError) {
      throw categoryDataError;
    }
    
    // Create historical data structure
    const months: string[] = [];
    const spending: Record<string, Record<string, number>> = {};
    const income: Record<string, number> = {};
    
    // Process each month's data
    financialData?.forEach((fd) => {
      const monthYear = `${fd.month} ${fd.year}`;
      
      // Skip current month as we already have fresh data
      if (monthYear === currentMonthData.summary.month) {
        return;
      }
      
      months.push(monthYear);
      income[monthYear] = Number(fd.total_credits);
      
      // Get categories for this month
      const monthCategories = categoryData?.filter(
        (cat) => cat.financial_data.month === fd.month && 
                 cat.financial_data.year === fd.year
      ) || [];
      
      // Add spending data for each category
      monthCategories.forEach((cat) => {
        if (!spending[cat.name]) {
          spending[cat.name] = {};
        }
        spending[cat.name][monthYear] = Number(cat.spent);
      });
    });
    
    // Add current month data
    months.push(currentMonthData.summary.month);
    income[currentMonthData.summary.month] = currentMonthData.summary.totalCredits;
    
    // Add current month spending to historical data
    currentMonthData.categories.forEach((cat) => {
      if (!spending[cat.name]) {
        spending[cat.name] = {};
      }
      spending[cat.name][currentMonthData.summary.month] = cat.spent;
    });
    
    // Sort months chronologically
    months.sort((a, b) => {
      const [aMonth, aYear] = a.split(' ');
      const [bMonth, bYear] = b.split(' ');
      const aDate = new Date(`${aMonth} 1, ${aYear}`);
      const bDate = new Date(`${bMonth} 1, ${bYear}`);
      return aDate.getTime() - bDate.getTime();
    });
    
    // Update the historical data in the sheet data object
    currentMonthData.historicalData = {
      months,
      spending,
      income
    };
    
    return currentMonthData;
  } catch (error) {
    console.error("Error merging with historical data:", error);
    // Return current month data if historical data can't be fetched
    return currentMonthData;
  }
};

// Function to fetch and parse Google Sheet data from Google Sheets and Supabase
export const fetchSheetData = async (url: string): Promise<SheetData> => {
  // Save the URL for future use
  await saveSheetUrl(url);
  
  try {
    // Step 1: Parse Google Sheet for current month data
    const rawSheetData = await parseGoogleSheetCSV(url);
    const currentMonthData = await parseGoogleSheetData(rawSheetData);
    
    // Step 2: Save current month data to Supabase for historical tracking
    const { month, year } = getCurrentMonthYear();
    await saveCurrentMonthToSupabase(currentMonthData, month, year);
    
    // Step 3: Merge current month data with historical data from Supabase
    const completeData = await mergeWithHistoricalData(currentMonthData);
    
    toast.success(`Balance sheet data loaded for ${completeData.summary.month}`);
    return completeData;
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    toast.error("Failed to load balance sheet data");
    
    // Return mock data as fallback
    return mockFallbackData();
  }
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

// Function to analyze spending trends with improved insights
export const analyzeSpendingTrends = (sheetData: SheetData) => {
  const trends = [];
  
  // Check for categories with increasing or decreasing spending
  for (const category of sheetData.categories) {
    const categoryHistory = sheetData.historicalData.spending[category.name];
    if (!categoryHistory) continue;
    
    const months = Object.keys(categoryHistory).sort((a, b) => {
      const [aMonth, aYear] = a.split(' ');
      const [bMonth, bYear] = b.split(' ');
      const aDate = new Date(`${aMonth} 1, ${aYear}`);
      const bDate = new Date(`${bMonth} 1, ${bYear}`);
      return aDate.getTime() - bDate.getTime();
    });
    
    if (months.length < 2) continue;
    
    const latestMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];
    
    const latestSpending = categoryHistory[latestMonth];
    const previousSpending = categoryHistory[previousMonth];
    
    // Calculate percent change
    const percentChange = ((latestSpending - previousSpending) / previousSpending) * 100;
    
    // Add more meaningful insights
    if (percentChange > 5) {
      // For significant increases
      trends.push({
        category: category.name,
        change: percentChange.toFixed(1),
        message: `Your ${category.name} spending has increased by ${percentChange.toFixed(1)}% since last month. ${
          percentChange > 20 
            ? `This is a substantial increase that needs attention.` 
            : `Consider reviewing this category's expenses.`
        }`
      });
    } else if (percentChange < -5) {
      // For significant decreases (good job!)
      trends.push({
        category: category.name,
        change: percentChange.toFixed(1),
        message: `Great job! You've reduced your ${category.name} spending by ${Math.abs(percentChange).toFixed(1)}% since last month. ${
          Math.abs(percentChange) > 20 
            ? `This is an excellent improvement in your financial discipline.` 
            : `Keep up the good work!`
        }`
      });
    }
    
    // Look for categories over budget
    if (category.remaining < 0) {
      const overBudgetPercent = (Math.abs(category.remaining) / category.limit) * 100;
      trends.push({
        category: category.name,
        change: overBudgetPercent.toFixed(1),
        message: `Your ${category.name} spending is ${overBudgetPercent.toFixed(1)}% over budget this month. ${
          overBudgetPercent > 50 
            ? `This significantly exceeds your planned budget and needs immediate attention.` 
            : `Consider adjusting your spending or budget in this category.`
        }`
      });
    }
  }
  
  // Add overall spending trend
  const months = sheetData.historicalData.months;
  if (months.length >= 3) {
    const last3Months = months.slice(-3);
    
    // Calculate total spending for each of the last 3 months
    const monthlyTotals = last3Months.map(month => {
      let total = 0;
      Object.values(sheetData.historicalData.spending).forEach(categoryData => {
        if (categoryData[month]) {
          total += categoryData[month];
        }
      });
      return { month, total };
    });
    
    // Analyze the 3-month trend
    if (monthlyTotals[2].total > monthlyTotals[1].total && monthlyTotals[1].total > monthlyTotals[0].total) {
      // Consistently increasing spending
      const percentIncrease = ((monthlyTotals[2].total - monthlyTotals[0].total) / monthlyTotals[0].total) * 100;
      trends.push({
        category: "Overall",
        change: percentIncrease.toFixed(1),
        message: `Your overall spending has been consistently increasing over the last 3 months, up ${percentIncrease.toFixed(1)}% in total. This is a concerning trend that may impact your savings goals.`
      });
    } else if (monthlyTotals[2].total < monthlyTotals[1].total && monthlyTotals[1].total < monthlyTotals[0].total) {
      // Consistently decreasing spending
      const percentDecrease = ((monthlyTotals[0].total - monthlyTotals[2].total) / monthlyTotals[0].total) * 100;
      trends.push({
        category: "Overall",
        change: (-percentDecrease).toFixed(1),
        message: `Excellent! Your overall spending has been consistently decreasing over the last 3 months, down ${percentDecrease.toFixed(1)}% in total. You're making great progress toward your financial goals.`
      });
    }
    
    // Calculate savings rate trend
    const savingsRates = last3Months.map(month => {
      const income = sheetData.historicalData.income[month] || 0;
      let expenses = 0;
      
      Object.values(sheetData.historicalData.spending).forEach(categoryData => {
        if (categoryData[month]) {
          expenses += categoryData[month];
        }
      });
      
      const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
      return { month, savingsRate };
    });
    
    // Add savings rate insight
    const latestSavingsRate = savingsRates[2].savingsRate;
    if (latestSavingsRate < 10) {
      trends.push({
        category: "Savings",
        change: latestSavingsRate.toFixed(1),
        message: `Your current savings rate is only ${latestSavingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% of your income. Consider reducing discretionary spending.`
      });
    } else if (latestSavingsRate > 20) {
      trends.push({
        category: "Savings",
        change: latestSavingsRate.toFixed(1),
        message: `Your savings rate of ${latestSavingsRate.toFixed(1)}% is excellent! You're exceeding the recommended 20% savings rate, which will help you reach your financial goals faster.`
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

// Fallback mock data function in case of errors
function mockFallbackData(): SheetData {
  return {
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
    assets: [
      { type: "Savings", value: 2500000, growth: 0.03 },
      { type: "Investments", value: 1200000, growth: 0.07 },
      { type: "Property", value: 8000000, growth: 0.05 }
    ],
    specialExpenses: [
      { type: "renovation", amount: 800000, date: "2025-01-10" },
      { type: "Shadi", amount: 1200000, date: "2024-12-15" },
      { type: "umrah", amount: 650000, date: "2025-02-05" }
    ]
  };
}
