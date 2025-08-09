import { useEffect, useMemo, useRef, useState } from "react";
import HeroPrompt from "@/components/HeroPrompt";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Zap } from "lucide-react";

const navSegments = [
  "AI-curious Twente",
  ">50 fte Randstad",
  "Competitor Analysis",
  "Untitled Segment",
];

const chipPresets: { label: string; value: string }[] = [
  { label: "Chat-based SDS Retrieval", value: "AI-ready bedrijven" },
  { label: "Incident Report Processor", value: "Nieuwe inschrijvingen deze week" },
  { label: "Scheduled Quality Check", value: "50 medewerkers in Regio Twente" },
];

const templateCards = [
  { id: "scratch", title: "Start from scratch", desc: "Build from the ground up with total freedom and creativity" },
  { id: "basic", title: "Basic Prompt", desc: "Execute a simple prompt to explore the mechanisms" },
  { id: "extract", title: "Extract information", desc: "Extract specified information from a document" },
  { id: "kvk", title: "KVK-lijst verrijken & scoren", desc: "Verrijk en scoor bedrijven op AI-gereedheid" },
];

const Dashboard = () => {
  const [keySeed, setKeySeed] = useState(0);
  const shellRef = useRef<HTMLDivElement>(null);

  // SEO
  useEffect(() => {
    document.title = "Dashboard – Segmenten | Innosales";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Start je segment en beheer je runs in het Innosales dashboard.";

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${window.location.origin}/dashboard`;
  }, []);

  useEffect(() => {
    console.info("dashboard_loaded");
  }, []);

  const focusPrompt = () => {
    setTimeout(() => {
      document.getElementById("prospect-prompt")?.focus();
    }, 0);
  };

  const prefillPrompt = (value: string) => {
    sessionStorage.setItem("pendingPrompt", value.trim().slice(0, 800));
    setKeySeed((k) => k + 1);
    focusPrompt();
  };

  const handleChipClick = (preset: { label: string; value: string }) => {
    console.info("chip_clicked", { label: preset.label });
    prefillPrompt(preset.value);
  };

  const handleTemplateUse = (id: string, value?: string) => {
    console.info("template_used", { id });
    if (value) prefillPrompt(value);
    else focusPrompt();
  };

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Dotted background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--dot)) 1.8px, transparent 1.8px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div ref={shellRef} className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 border-r bg-white/80 backdrop-blur-md">
          <div className="flex h-screen flex-col p-4">
            <div className="flex items-center gap-2 px-1 pt-1 pb-4">
              <div className="h-6 w-6 rounded-md border bg-[hsl(var(--gold))]" aria-hidden />
              <span className="text-sm font-semibold">Innosales</span>
            </div>
            <nav className="space-y-5 text-sm">
              <div className="space-y-1">
                <div className="px-1 text-muted-foreground">Home</div>
              </div>
              <div className="space-y-1">
                <div className="px-1 text-muted-foreground">Activiteit</div>
              </div>
              <div>
                <div className="px-1 text-muted-foreground mb-2">Segmenten</div>
                <ul className="space-y-1">
                  {navSegments.map((s) => (
                    <li key={s}>
                      <button className="w-full rounded-md px-2 py-1.5 text-left hover:bg-muted/60">
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="mt-auto space-y-2">
              <Button className="w-full justify-center bg-[hsl(var(--gold))] text-white" onClick={() => handleTemplateUse("new-segment")}>+ New Segment</Button>
              <div className="rounded-md border bg-white/70 p-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><span className="h-4 w-4 rounded bg-muted" /> Default Project</div>
                <div className="mt-2">Runs: 0 / 100</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1">
          {/* Top-right usage pill */}
          <div className="absolute right-4 top-4 hidden md:flex items-center gap-2 rounded-full border bg-white/70 backdrop-blur-md px-3 py-1 text-xs">
            <Zap className="h-4 w-4" />
            <span>0 / 100 runs gebruikt</span>
          </div>

          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 md:py-12">
            <header className="text-center">
              <h1 className="text-2xl md:text-3xl font-semibold">Start building your segment</h1>
              <p className="mt-1 text-sm text-muted-foreground">Specificeer je requirements en laat AI je segment genereren.</p>
            </header>

            {/* Chips row */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {chipPresets.map((c) => (
                <button key={c.label} onClick={() => handleChipClick(c)} className="rounded-full border bg-white/80 backdrop-blur px-3 py-1 text-sm hover:bg-white">
                  {c.label}
                </button>
              ))}
              <button
                aria-label="Vernieuw suggesties"
                className="ml-1 inline-flex items-center rounded-full border bg-white/80 px-2 py-1 text-sm hover:bg-white"
              >
                <RefreshCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Prompt card */}
            <div className="mt-4">
              <HeroPrompt key={keySeed} showHeader={false} />
            </div>

            {/* Divider text */}
            <div className="my-6 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>or explore ready made templates</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Templates grid */}
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {templateCards.map((t) => (
                <button key={t.id} onClick={() => handleTemplateUse(t.id)} className="text-left rounded-xl border bg-white/70 backdrop-blur-md p-4 hover:bg-white">
                  <div className="font-medium">{t.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
