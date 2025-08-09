import { useEffect, useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthGate from "@/components/AuthGate";

const HeroPrompt = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Prefill when coming from Dashboard -> "Bewerk prompt"
  useEffect(() => {
    const p = sessionStorage.getItem("pendingPrompt");
    if (p) setValue(p);
  }, []);

  const stats = useMemo(() => {
    const trimmed = value.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const length = trimmed.length;
    return { words, length, trimmed };
  }, [value]);

  const isValid = stats.words >= 10 && stats.length <= 800;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError(
        stats.length > 800
          ? "Je prompt is te lang (max. 800 tekens)."
          : "Je prompt moet minimaal 10 woorden bevatten."
      );
      return;
    }

    setError(null);
    console.info("prompt_submitted", { length: stats.length, ts: Date.now() });

    sessionStorage.setItem("pendingPrompt", stats.trimmed);

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setAuthOpen(true); // Open auth modal
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  const handleAuthSuccess = () => {
    // After auth, go to dashboard and keep pendingPrompt intact
    navigate("/dashboard");
    setAuthOpen(false);
  };

  return (
    <section aria-label="Prospect prompt" className="relative">
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-10 md:mb-12 text-center">
          <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
            Genereer prospects met één krachtige prompt
          </h1>
          <p className="mt-6 md:mt-8 text-lg text-muted-foreground leading-relaxed">
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
            aria-label="Prospect prompt"
            aria-describedby={error ? "prompt-error" : undefined}
          />
          <div className="absolute bottom-3 right-3">
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 rounded-full bg-gradient-to-b from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-white shadow-md transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Verstuur prompt"
              disabled={!isValid || loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>

        <div className="mt-2 min-h-[1.25rem]" role="status" aria-live="polite">
          {error && (
            <p id="prompt-error" className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          ≥10 woorden, ≤800 tekens. Je kunt je prompt later altijd aanpassen.
        </p>
      </div>

      <AuthGate open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </section>
  );
};

export default HeroPrompt;

