
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type PurchaseFormProps = {
  onSubmit: (amount: number, category: string, description: string) => void;
  categories: string[];
  isLoading: boolean;
};

const PurchaseForm = ({ onSubmit, categories, isLoading }: PurchaseFormProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const purchaseAmount = parseFloat(amount);
    
    if (isNaN(purchaseAmount) || purchaseAmount <= 0) {
      return;
    }
    
    onSubmit(purchaseAmount, category, description);
  };

  return (
    <Card className="w-full">
      <CardHeader className={isMobile ? "px-4 pt-4 pb-2" : undefined}>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <ShoppingBag className="h-5 w-5" />
          <span>Can I buy this?</span>
        </CardTitle>
        <CardDescription>
          Enter the details of what you want to purchase
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className={`space-y-4 ${isMobile ? "px-4 py-2" : undefined}`}>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (PKR)</Label>
            <Input
              id="amount"
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="text-right"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Expense Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent position={isMobile ? "popper" : "item-aligned"} className="bg-card border-border">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="What are you buying?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
        
        <CardFooter className={isMobile ? "px-4 pb-4 pt-2" : undefined}>
          <Button type="submit" className="w-full" disabled={isLoading || !amount || !category}>
            {isLoading ? "Analyzing..." : "Check if I can buy this"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PurchaseForm;
