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
        <h1 className="sr-only">Innosales – Prospect Generator</h1>

        <div className="mb-5 flex items-center justify-center gap-2 text-muted-foreground">
          <span className="inline-block size-2.5 rounded-full bg-brand" />
          <span className="text-sm tracking-wide">Innosales</span>
        </div>

        <div className="ambient-gold" aria-hidden="true" />

        <form
          onSubmit={onSubmit}
          className="glass-panel border-transparent transition-all duration-300 focus-within:border-brand focus-within:shadow-elegant"
        >
          <div className="relative flex items-center p-5 md:p-6">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Beschrijf je ideale prospect…"
              className="h-14 md:h-16 pr-24 bg-transparent border-0 shadow-none focus-visible:ring-0 text-base md:text-lg"
              aria-label="Prompt invoerveld"
            />
            <div className="absolute right-4 bottom-4 md:right-5 md:bottom-5">
              <Button type="submit" variant="brand" size="lg" aria-label="Verstuur" className="rounded-full">
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

