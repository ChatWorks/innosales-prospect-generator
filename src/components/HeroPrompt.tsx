import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const HeroPrompt = () => {
  const [value, setValue] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    toast({
      title: "Prompt verstuurd",
      description: "Zodra de backend klaar is, gebruiken we dit om prospects te genereren.",
    });
    // Keep value for now so the user can adjust; remove next line if you prefer clearing it
    // setValue("");
  };

  return (
    <section aria-label="Prospect prompt" className="relative">
      {/* Dotted background */}
      <div className="absolute inset-0 bg-dots pointer-events-none" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-8 text-center">
          <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
            Genereer prospects met één krachtige prompt
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Bouw later je workflow — vandaag start je met één duidelijke instructie.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="glass-panel focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 focus-within:ring-offset-background transition-all duration-300"
        >
          <div className="relative flex items-center">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Beschrijf je ideale prospect…"
              className="h-14 md:h-16 pr-24 bg-transparent border-0 shadow-none focus-visible:ring-0 text-lg md:text-xl"
              aria-label="Prompt invoerveld"
            />
            <div className="absolute right-2">
              <Button type="submit" variant="brand" size="lg" aria-label="Verstuur">
                <Send className="opacity-90" />
              </Button>
            </div>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Je kunt je prompt later altijd aanpassen.
        </p>
      </div>
    </section>
  );
};

export default HeroPrompt;

