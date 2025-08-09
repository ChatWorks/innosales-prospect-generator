import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import HeroPrompt from "@/components/HeroPrompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const segments = [
  "AI-curious Twente",
  ">50 fte Randstad",
  "Scale-ups NL",
  "Diensten MKB",
];

const exportsRecent = [
  { name: "HubSpot lijst A", date: "2025-08-01", status: "Klaar" },
  { name: "CSV Export 0729", date: "2025-07-29", status: "Klaar" },
];

const chipPresets: { label: string; value: string }[] = [
  { label: "Nieuwe inschrijvingen (deze week)", value: "Nieuwe inschrijvingen deze week" },
  { label: "AI-ready bedrijven", value: "AI-ready bedrijven" },
  { label: "50 medewerkers", value: "50 medewerkers" },
  { label: "Regio Twente", value: "Regio Twente" },
  { label: "Consultancy & IT (SBI)", value: "Consultancy & IT (SBI)" },
];

const Dashboard = () => {
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [keySeed, setKeySeed] = useState(0);
  const [status] = useState<"Idle" | "Running" | "Done">("Idle");
  const mainRef = useRef<HTMLDivElement>(null);

  // SEO
  useEffect(() => {
    document.title = "Dashboard – Segmenten | Innosales";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Beheer je segmenten en start runs in het Innosales dashboard.";

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${window.location.origin}/dashboard`;
  }, []);

  // State & handover from pendingPrompt
  useEffect(() => {
    const pending = sessionStorage.getItem("pendingPrompt");
    if (pending) {
      setLastPrompt(pending);
      sessionStorage.removeItem("pendingPrompt");
    }
  }, []);

  const hasPrompt = useMemo(() => Boolean(lastPrompt && lastPrompt.trim().length > 0), [lastPrompt]);

  useEffect(() => {
    console.info("dashboard_loaded");
  }, []);

  const focusPrompt = () => {
    // Focus the prompt textarea
    setTimeout(() => {
      const el = document.getElementById("prospect-prompt") as HTMLTextAreaElement | null;
      el?.focus();
    }, 0);
  };

  const prefillPrompt = (value: string) => {
    sessionStorage.setItem("pendingPrompt", value.trim().slice(0, 800));
    setKeySeed((k) => k + 1); // force remount HeroPrompt to read sessionStorage
    focusPrompt();
  };

  const handleChipClick = (preset: { label: string; value: string }) => {
    console.info("chip_clicked", { label: preset.label });
    prefillPrompt(preset.value);
  };

  const handleTemplateUse = (id: string, value?: string) => {
    console.info("template_used", { id });
    if (value) prefillPrompt(value);
    if (!value) focusPrompt();
  };

  const useLastPrompt = () => {
    if (!lastPrompt) return;
    prefillPrompt(lastPrompt);
  };

  const reuseAndRun = () => {
    useLastPrompt();
    // trigger submit by clicking the gold send button inside main section
    setTimeout(() => {
      const scope = mainRef.current || document;
      const btn = scope.querySelector('button[aria-label="Verstuur prompt"]') as HTMLButtonElement | null;
      btn?.click();
    }, 30);
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Dotted background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--dot)) 2px, transparent 2px)",
          backgroundSize: "24px 24px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      <Header />

      <div ref={mainRef} className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-24">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[280px_1fr_320px]">
          {/* Sidebar */}
          <aside className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-4 md:p-5 h-fit">
            <h2 className="text-lg font-semibold">Segmenten</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {segments.map((s) => (
                <li key={s} className="flex items-center justify-between">
                  <button className="text-left hover:underline">{s}</button>
                  <span className="ml-3 inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Run</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground">Exports (recent)</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {exportsRecent.map((e) => (
                  <li key={e.name} className="flex items-center justify-between">
                    <span>{e.name}</span>
                    <span className="ml-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-muted px-2 py-0.5">{e.status}</span>
                      <time className="tabular-nums">{e.date}</time>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <Button className="w-full bg-[hsl(var(--gold))] text-white" onClick={() => { handleTemplateUse("new-segment"); }}>
                + Nieuw segment
              </Button>
            </div>
          </aside>

          {/* Main canvas */}
          <section>
            <h1 className="text-2xl md:text-3xl font-semibold">Start je segment</h1>

            {/* Last prompt mini-card */}
            {hasPrompt && (
              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-muted-foreground">Laatste prompt</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="rounded-md border bg-muted/20 p-3 whitespace-pre-wrap text-sm">
                    {lastPrompt}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={useLastPrompt}>Bewerk</Button>
                    <Button className="bg-[hsl(var(--gold))] text-white" onClick={reuseAndRun}>Gebruik opnieuw</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              {chipPresets.map((c) => (
                <button
                  key={c.label}
                  onClick={() => handleChipClick(c)}
                  className="rounded-full border bg-white/70 backdrop-blur-md px-3 py-1 text-sm hover:bg-white"
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Prompt card (reuse from home) */}
            <div className="mt-4">
              <HeroPrompt key={keySeed} />
            </div>

            {/* Templates */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button onClick={() => handleTemplateUse("empty")} className="text-left rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md p-4 hover:bg-white">
                <div className="font-medium">Leeg segment</div>
                <p className="mt-1 text-sm text-muted-foreground">Focust de PromptCard</p>
              </button>
              <button onClick={() => handleTemplateUse("basic", "Grotere bedrijven in omgeving Enschede met AI-belang")} className="text-left rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md p-4 hover:bg-white">
                <div className="font-medium">Basis prompt</div>
                <p className="mt-1 text-sm text-muted-foreground">\"Grotere bedrijven in omgeving Enschede met AI-belang\"</p>
              </button>
              <button onClick={() => handleTemplateUse("kvk", "KVK-lijst verrijken en scoren op AI-gereedheid")} className="text-left rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md p-4 hover:bg-white">
                <div className="font-medium">KVK-lijst verrijken & scoren</div>
                <p className="mt-1 text-sm text-muted-foreground">Gebruik een KVK-lijst en verrijk met signalen</p>
              </button>
              <button onClick={() => handleTemplateUse("hubspot", "Exporteer het segment naar HubSpot lijsten")} className="text-left rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md p-4 hover:bg-white">
                <div className="font-medium">Export naar HubSpot</div>
                <p className="mt-1 text-sm text-muted-foreground">Maak of werk een HubSpot-lijst bij</p>
              </button>
            </div>
          </section>

          {/* Right panel */}
          <aside className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-4 md:p-5 h-fit">
            <h2 className="text-lg font-semibold">Activiteit & Kosten</h2>

            <div className="mt-3">
              <h3 className="text-sm font-medium text-muted-foreground">Activiteit</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li>Prompt ontvangen</li>
                <li>Harvest gestart</li>
                <li>Verrijking in wachtrij</li>
                <li>Export klaar</li>
              </ul>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-medium text-muted-foreground">Kosten & limieten</h3>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between"><span>Zoeken</span><span className="tabular-nums">12/100</span></div>
                <div className="flex justify-between"><span>Basis</span><span className="tabular-nums">34/500</span></div>
                <div className="flex justify-between"><span>Vestiging</span><span className="tabular-nums">5/100</span></div>
              </div>
              <div className="mt-3">
                <div className="text-xs text-muted-foreground mb-1">Budget (€)</div>
                <Progress value={24} className="h-2" />
              </div>
              <div className="mt-3">
                <div className="text-xs text-muted-foreground mb-1">LLM tokens</div>
                <Progress value={12} className="h-2" />
              </div>
            </div>

            <div className="mt-5">
              <span className="inline-flex items-center rounded-full border bg-white/70 px-2.5 py-1 text-xs">
                Status: <span className="ml-1 font-medium">{status}</span>
              </span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
