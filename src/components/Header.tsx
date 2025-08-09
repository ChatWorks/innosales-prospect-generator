import { cn } from "@/lib/utils";

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
            <div className="inline-flex items-center gap-2 select-none">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand" aria-hidden="true" />
              <span className="text-sm md:text-base text-muted-foreground font-medium">Innosales</span>
            </div>
            {/* Right area left intentionally minimal */}
          </div>
        </div>
      </div>
    </header>
  );
}
