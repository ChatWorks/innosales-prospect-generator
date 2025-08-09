import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--dot)) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0.6) 100%)",
        }}
      />

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
          className="group relative w-full rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 focus-within:shadow-[0_12px_40px_hsla(var(--gold)/0.15)] focus-within:ring-2 focus-within:ring-[hsl(var(--gold))]/50"
        >
          <label htmlFor="prospect-prompt" className="sr-only">
            Beschrijf je ideale prospect
          </label>
          <Textarea
            id="prospect-prompt"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Beschrijf je ideale prospect…"
            className="w-full resize-none bg-transparent outline-none text-base md:text-lg leading-relaxed placeholder:text-neutral-400 p-5 md:p-6 pr-16 md:pr-20 min-h-[120px] md:min-h-[140px] border-0 shadow-none focus-visible:ring-0"
            rows={4}
            aria-label="Prompt invoerveld"
          />
          <div className="absolute bottom-3 right-3">
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 rounded-full bg-gradient-to-b from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white shadow-md transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
              aria-label="Verstuur prompt"
            >
              <Send className="h-4 w-4" />
            </Button>
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

