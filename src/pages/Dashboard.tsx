import { useEffect, useMemo, useRef, useState } from "react";
import HeroPrompt from "@/components/HeroPrompt";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Home, Activity, Plus, RefreshCcw, Zap, CalendarDays, Menu, X } from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

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

      <div ref={shellRef} className="relative z-10 min-h-screen">
        {/* Sidebar */}
        <>
          {/* Mobile hamburger */}
          <button
            aria-label="Open sidebar"
            onClick={() => setMobileOpen(true)}
            className="fixed left-4 top-4 z-50 inline-flex lg:hidden items-center justify-center h-10 w-10 rounded-lg border bg-white/70 backdrop-blur-md shadow-soft"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop overlay rail */}
          <div
            className="group fixed left-0 top-0 z-40 hidden lg:flex h-dvh w-14 hover:w-64 focus-within:w-64 transition-all duration-300 ease-out bg-white/70 backdrop-blur-md border-r border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] after:absolute after:right-[-16px] after:top-0 after:h-full after:w-4"
          >
            <div className="flex h-full w-full flex-col p-3">
              {/* Logo hit-area */}
              <button
                className="h-14 w-14 rounded-md border bg-[hsl(var(--gold))] flex items-center justify-center"
                aria-label="Innosales"
              />

              {/* Nav */}
              <div className="mt-4 space-y-1">
                <button className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/60">
                  <Home className="h-4 w-4" />
                  <span className="ml-3 whitespace-nowrap text-sm text-muted-foreground opacity-0 translate-x-1 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0">Home</span>
                </button>

                <div className="mt-2 px-2">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0">Activiteit</div>
                </div>
                <button className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/60">
                  <Activity className="h-4 w-4" />
                  <span className="ml-3 whitespace-nowrap text-sm text-muted-foreground opacity-0 translate-x-1 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0">Alle activiteit</span>
                </button>
              </div>

              {/* Segmenten */}
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between px-2">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0">Segmenten</div>
                  <button
                    aria-label="Nieuw segment"
                    onClick={() => handleTemplateUse("new-segment")}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border hover:bg-muted/60"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <ul className="space-y-1">
                  {navSegments.map((s) => (
                    <li key={s}>
                      <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/60">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/50" aria-hidden />
                        <span className="ml-3 whitespace-nowrap text-sm opacity-0 translate-x-1 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0">{s}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom */}
              <div className="mt-auto space-y-3 opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0">
                <div className="rounded-xl border bg-white/70 backdrop-blur-md p-3 shadow-soft">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded bg-muted" aria-hidden />
                    <div className="text-sm font-medium">Default Project</div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">Runs: 0 / 100</div>
                  <Progress value={0} className="mt-2" />
                </div>
                <Button
                  className="w-full justify-center bg-[hsl(var(--gold))] text-white"
                  onClick={() => handleTemplateUse("new-segment")}
                >
                  + Nieuw segment
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile drawer */}
          {mobileOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setMobileOpen(false)} />
              <div className="fixed left-0 top-0 z-50 h-dvh w-64 bg-white/70 backdrop-blur-md border-r border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-3">
                <button
                  aria-label="Sluit sidebar"
                  onClick={() => setMobileOpen(false)}
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white/70"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="mt-1">
                  <div className="h-12 w-12 rounded-md border bg-[hsl(var(--gold))]" aria-hidden />
                </div>

                <nav className="mt-4 space-y-1 text-sm">
                  <button className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/60">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </button>

                  <div className="mt-2 px-2 text-[11px] uppercase tracking-wide text-muted-foreground">Activiteit</div>
                  <button className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/60">
                    <Activity className="h-4 w-4" />
                    <span>Alle activiteit</span>
                  </button>

                  <div className="mt-3 mb-2 flex items-center justify-between px-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                    <span>Segmenten</span>
                    <button
                      aria-label="Nieuw segment"
                      onClick={() => handleTemplateUse("new-segment")}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border hover:bg-muted/60"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {navSegments.map((s) => (
                      <li key={s}>
                        <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/60">
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/50" aria-hidden />
                          <span className="truncate">{s}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-auto space-y-3 pt-4">
                  <div className="rounded-xl border bg-white/70 backdrop-blur-md p-3 shadow-soft">
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded bg-muted" aria-hidden />
                      <div className="text-sm font-medium">Default Project</div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Runs: 0 / 100</div>
                    <Progress value={0} className="mt-2" />
                  </div>
                  <Button
                    className="w-full justify-center bg-[hsl(var(--gold))] text-white"
                    onClick={() => {
                      handleTemplateUse("new-segment");
                      setMobileOpen(false);
                    }}
                  >
                    + Nieuw segment
                  </Button>
                </div>
              </div>
            </>
          )}
        </>

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
