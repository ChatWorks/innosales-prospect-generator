import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={cn(
            "mt-4 md:mt-6",
            "rounded-xl border bg-background/60 backdrop-blur-md",
            "shadow-soft"
          )}
        >
          <div className="h-12 md:h-14 px-4 sm:px-5 flex items-center justify-between">
            <div className="inline-flex items-center gap-2.5 select-none">
              <svg
                className="h-5 w-5 text-brand"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="7" r="1.4" fill="currentColor" />
                <path d="M12 10.5v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="text-sm md:text-base text-muted-foreground font-medium">Innosales</span>
            </div>
            <Link to="/dashboard" className="shrink-0">
              <Button
                className={cn(
                  "h-9 md:h-10 rounded-full px-4",
                  "bg-[hsl(var(--gold))]",
                  "text-white shadow-elegant transition-transform duration-150",
                  "hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                <span className="hidden sm:inline">Dashboard</span>
                <ArrowRight className="h-4 w-4 sm:ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
