
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link, Loader2 } from "lucide-react";
import { getSavedSheetUrl, DEFAULT_SHEET_URL } from "@/services/sheetService";
import { useIsMobile } from "@/hooks/use-mobile";

type GoogleSheetInputProps = {
  onSheetSubmit: (url: string) => void;
  isLoading: boolean;
};

const GoogleSheetInput = ({ onSheetSubmit, isLoading }: GoogleSheetInputProps) => {
  const [sheetUrl, setSheetUrl] = useState<string>("");
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const isMobile = useIsMobile();

  // Check for previously saved sheet URL on component mount
  useEffect(() => {
    const checkSavedUrl = async () => {
      try {
        console.log("Checking for saved sheet URL");
        const savedUrl = await getSavedSheetUrl();
        const urlToUse = savedUrl || DEFAULT_SHEET_URL;
        
        console.log("Using sheet URL:", urlToUse);
        
        setSheetUrl(urlToUse);
        toast.info("Connecting to your balance sheet");
        
        // Don't submit immediately - wait until dependencies are properly loaded
        setTimeout(() => {
          onSheetSubmit(urlToUse);
        }, 500);
      } catch (error) {
        console.error("Error loading saved sheet URL:", error);
        // Use default URL as fallback
        setSheetUrl(DEFAULT_SHEET_URL);
        setTimeout(() => {
          onSheetSubmit(DEFAULT_SHEET_URL);
        }, 500);
        toast.info("Using default sheet URL");
      } finally {
        setIsLoadingSaved(false);
      }
    };
    
    checkSavedUrl();
  }, [onSheetSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for Google Sheets URL
    if (!sheetUrl || !sheetUrl.includes("docs.google.com/spreadsheets")) {
      toast.error("Please enter a valid Google Sheets URL");
      return;
    }
    
    // Save to localStorage as backup
    localStorage.setItem('sheetUrl', sheetUrl);
    
    onSheetSubmit(sheetUrl);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className={isMobile ? "px-4 pt-4 pb-2" : undefined}>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Link className="h-5 w-5" />
          <span>Connect your balance sheet</span>
        </CardTitle>
        <CardDescription>
          Enter the URL of your Google Sheet containing your financial data
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? "px-4 py-4" : undefined}>
        {isLoadingSaved ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="sr-only">Loading saved sheet...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Make sure your sheet is public or has sharing enabled
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connecting..." : "Connect Sheet"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleSheetInput;
