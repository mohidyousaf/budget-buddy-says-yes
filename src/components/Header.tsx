
import { DollarSign } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="w-full bg-primary text-primary-foreground py-3 shadow-md">
      <div className="container flex items-center justify-center gap-2">
        <DollarSign className={isMobile ? "h-6 w-6" : "h-8 w-8"} />
        <h1 className={`font-bold tracking-tight ${isMobile ? "text-xl" : "text-2xl sm:text-3xl"}`}>Budget Buddy</h1>
      </div>
    </header>
  );
};

export default Header;
