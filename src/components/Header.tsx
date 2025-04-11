
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { CircleDollarSign, BarChart2, BookOpen } from "lucide-react";

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-6 w-6 text-primary" />
          <Link to="/" className="font-bold text-lg md:text-xl">
            Mohid Budget Buddy
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/analysis" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
            <BarChart2 className="h-4 w-4" />
            Analysis
          </Link>
          <Link to="/learn" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Financial Education
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button variant="ghost" size="sm" className="px-0 text-base">
              <Link to="/" className="px-2">
                Home
              </Link>
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
