
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "lucide-react";

type GoogleSheetInputProps = {
  onSheetSubmit: (url: string) => void;
  isLoading: boolean;
};

const GoogleSheetInput = ({ onSheetSubmit, isLoading }: GoogleSheetInputProps) => {
  const [sheetUrl, setSheetUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for Google Sheets URL
    if (!sheetUrl.includes("docs.google.com/spreadsheets")) {
      toast.error("Please enter a valid Google Sheets URL");
      return;
    }
    
    onSheetSubmit(sheetUrl);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          <span>Connect your balance sheet</span>
        </CardTitle>
        <CardDescription>
          Enter the URL of your Google Sheet containing your financial data
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default GoogleSheetInput;
