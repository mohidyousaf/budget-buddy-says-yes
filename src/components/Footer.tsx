
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-6 md:py-0 md:px-8 w-full border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          Budget Buddy - Your smart financial decision assistant
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          Built with <span className="text-budget-red">♥</span> by Lovable
        </p>
      </div>
    </footer>
  );
};

export default Footer;
