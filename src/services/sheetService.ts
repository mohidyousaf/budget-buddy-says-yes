
import { toast } from "sonner";

// Mock data model based on the screenshot
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
  };
};

// Function to fetch and parse Google Sheet data
// For now, we'll use mock data since actual Google Sheets API integration would require OAuth
export const fetchSheetData = async (url: string): Promise<SheetData> => {
  // In a real app, this would connect to the Google Sheets API
  // For demo purposes, we'll simulate a network request
  
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Mock data based on the screenshot
      const mockData: SheetData = {
        credits: [
          { description: "salary", amount: 322000 }
        ],
        debits: [
          { description: "shopping", amount: 10000, date: "2023-02-13", type: "Shopping", expenseType: "Discretionary" },
          { description: "domestic", amount: 25000, date: "2023-02-13", type: "Utilities", expenseType: "Fixed" },
          { description: "target", amount: 800, date: "2023-02-13", type: "Food", expenseType: "Fixed" },
          { description: "car", amount: 2800, date: "2023-02-13", type: "Car", expenseType: "Fixed" },
          { description: "shipping", amount: 35000, date: "2023-02-13", type: "Shipping", expenseType: "Fixed" },
          { description: "food", amount: 5000, date: "2023-02-13", type: "Food", expenseType: "Fixed" },
          { description: "entertainment", amount: 3000, date: "2023-02-13", type: "Entertainment", expenseType: "Discretionary" },
          { description: "grocery", amount: 10000, date: "2023-02-13", type: "Grocery", expenseType: "Fixed" },
        ],
        categories: [
          { name: "Car", spent: 2800, limit: 5000, remaining: 2200 },
          { name: "Shipping", spent: 35000, limit: 6000, remaining: -29000 },
          { name: "Food", spent: 5000, limit: 20000, remaining: 15000 },
          { name: "Entertainment", spent: 3000, limit: 4000, remaining: 1000 },
          { name: "Grocery", spent: 10000, limit: 10000, remaining: 0 },
          { name: "Utilities", spent: 25000, limit: 40000, remaining: 15000 },
          { name: "Shopping", spent: 10000, limit: 45000, remaining: 35000 },
        ],
        summary: {
          totalCredits: 322000,
          totalDebits: 218950,
          currentBalance: 1577311,
          inflow: 322000,
          outflow: 218950,
          net: -108000
        }
      };

      toast.success("Balance sheet data loaded");
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
