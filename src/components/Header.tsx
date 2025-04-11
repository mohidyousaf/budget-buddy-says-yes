
import { DollarSign } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container flex items-center justify-center gap-3">
        <DollarSign className="h-8 w-8" />
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Budget Buddy</h1>
      </div>
    </header>
  );
};

export default Header;
