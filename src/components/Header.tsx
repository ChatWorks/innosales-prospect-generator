import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-white/70 backdrop-blur-md border-b border-white/60">
      <div className="w-full px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
        <div className="inline-flex items-center gap-3 select-none">
          <img
            src="/lovable-uploads/56606f98-8f2c-42df-bc47-d3cf8c50cfff.png"
            alt="Innosales logo"
            className="h-11 md:h-12 w-auto object-contain"
            loading="eager"
          />
          <span className="hidden sm:inline text-lg md:text-xl text-foreground font-semibold">Innosales</span>
        </div>
        <Link to="/dashboard" className="shrink-0">
          <Button
            className={cn(
              "h-9 md:h-10 rounded-md md:rounded-lg px-4 md:px-5",
              "bg-[hsl(var(--gold))]",
              "text-white shadow-elegant transition-transform duration-150",
              "hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            <span className="hidden sm:inline">Dashboard</span>
            <ArrowRight className="h-4 w-4 sm:ml-2" aria-hidden />
          </Button>
        </Link>
      </div>
    </header>
  );
}
