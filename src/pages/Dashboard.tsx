import { useEffect, useMemo, useRef, useState } from "react";
import HeroPrompt from "@/components/HeroPrompt";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Home, Activity, Plus, RefreshCcw, Zap, X } from "lucide-react";

const navSegments = [
  "AI-curious Twente",
  ">50 fte Randstad",
  "Competitor Analysis",
  "Untitled Segment",
];

const SUGGESTIONS_POOL: string[] = [
  "Ik zoek bedrijven in Enschede die mogelijk geïnteresseerd zijn in mijn services.",
  "Bedrijven in Twente met 10–50 medewerkers die willen groeien.",
  "Mkb's in Overijssel met een actieve website en interesse in automatisering.",
  "Scale-ups in de Randstad die recent vacatures voor IT/AI plaatsten.",
  "Nieuwe inschrijvingen van de afgelopen 30 dagen in mijn regio.",
  "Bedrijven ouder dan 5 jaar met meerdere vestigingen in Oost-Nederland.",
  "Organisaties in Utrecht met een datagedreven profiel en digitale ambitie.",
  "Familiebedrijven in Gelderland die moderniseren of digitaliseren.",
  "Dienstverleners in Noord-Brabant met 5–25 medewerkers en online zichtbaarheid.",
  "Bedrijven in Zwolle met potentieel voor procesautomatisering.",
  "B2B-bedrijven in Zuid-Holland die internationaal actief zijn.",
  "Bedrijven met hoofdkantoor in Amsterdam en >3 vestigingen.",
  "Bedrijven in Brabant met groei in het afgelopen jaar.",
  "Organisaties met een duidelijke AI- of datafocus op hun website.",
  "Bedrijven in Rotterdam die mogelijk openstaan voor AI-consultancy.",
  "Startups in Eindhoven met 1–3 jaar bestaansduur.",
  "Bedrijven met recente naamswijziging of rebranding (signaal voor verandering).",
  "Bedrijven in Friesland met een technische of digitale propositie.",
  "Bedrijven die actief zijn op LinkedIn en regelmatig publiceren.",
  "Bedrijven in Den Haag met 25–100 medewerkers.",
  "Nieuwe vestigingen in mijn provincie in de laatste 90 dagen.",
  "Bedrijven met een duidelijke innovatie-afdeling of lab.",
  "Bedrijven met remote-first teams en digitale processen.",
  "Bedrijven in Enschede met groeiende vacaturevolumes.",
  "Bedrijven met een duidelijke IT/Cloud vermelding op de site.",
  "Bedrijven met internationale vestigingen maar Nederlands hoofdkantoor.",
  "Bedrijven in Noord-Holland die een webshop en B2B focus combineren.",
];

interface Prospect {
  kvk_nummer: string;
  naam: string;
  plaats: string;
  provincie: string;
  vestigingen_count: number;
  total_emp?: number | null;
  reg_date?: string | null;
  rechtsvorm?: string | null;
  websites?: string[];
  non_mailing?: boolean;
  score: number; // 0-100
}

const placeholderProspects: Prospect[] = [
  {
    kvk_nummer: "12345678",
    naam: "TechNova B.V.",
    plaats: "Enschede",
    provincie: "Overijssel",
    vestigingen_count: 2,
    total_emp: 24,
    reg_date: "2016-04-12",
    rechtsvorm: "Besloten Vennootschap",
    websites: ["https://technova.example"],
    non_mailing: false,
    score: 84,
  },
  {
    kvk_nummer: "23456789",
    naam: "DataForge VOF",
    plaats: "Hengelo",
    provincie: "Overijssel",
    vestigingen_count: 1,
    total_emp: 12,
    reg_date: "2019-09-02",
    rechtsvorm: "Vennootschap onder firma",
    websites: ["https://dataforge.example"],
    non_mailing: false,
    score: 76,
  },
  {
    kvk_nummer: "34567890",
    naam: "CloudPeak Solutions",
    plaats: "Zwolle",
    provincie: "Overijssel",
    vestigingen_count: 3,
    total_emp: 48,
    reg_date: "2013-01-22",
    rechtsvorm: "Besloten Vennootschap",
    websites: ["https://cloudpeak.example"],
    non_mailing: true,
    score: 71,
  },
  {
    kvk_nummer: "45678901",
    naam: "AutomateX",
    plaats: "Deventer",
    provincie: "Overijssel",
    vestigingen_count: 1,
    total_emp: 8,
    reg_date: "2021-06-15",
    rechtsvorm: "Eenmanszaak",
    websites: ["https://automatex.example"],
    non_mailing: false,
    score: 65,
  },
  {
    kvk_nummer: "56789012",
    naam: "InsightWorks B.V.",
    plaats: "Apeldoorn",
    provincie: "Gelderland",
    vestigingen_count: 2,
    total_emp: 33,
    reg_date: "2015-11-05",
    rechtsvorm: "Besloten Vennootschap",
    websites: ["https://insightworks.example"],
    non_mailing: false,
    score: 80,
  },
  {
    kvk_nummer: "67890123",
    naam: "NextGen Analytics",
    plaats: "Utrecht",
    provincie: "Utrecht",
    vestigingen_count: 1,
    total_emp: 18,
    reg_date: "2018-03-30",
    rechtsvorm: "Besloten Vennootschap",
    websites: ["https://nextgen.example"],
    non_mailing: false,
    score: 69,
  },
];

const Dashboard = () => {
  const [keySeed, setKeySeed] = useState(0);
  const shellRef = useRef<HTMLDivElement>(null);
const [mobileOpen, setMobileOpen] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);
// Suggestie: maximaal 1 tegelijk, doorrouleren met de knop
const [suggestionIndex, setSuggestionIndex] = useState(0);
const currentSuggestion = useMemo(
  () => SUGGESTIONS_POOL[suggestionIndex % SUGGESTIONS_POOL.length],
  [suggestionIndex]
);

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

  const handleLogoClick = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setSidebarOpen((o) => !o);
    } else {
      setMobileOpen(true);
    }
  };

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
      {/* Subtle animated golden gradient overlay */}
      <div aria-hidden="true" className="ambient-gold" />

      <div ref={shellRef} className="relative z-10 min-h-screen">
        {/* Sidebar */}
        <>
          {/* Header with logo (click = toggle sidebar) */}
          {/* Full-width header with logo */}
          <header className="fixed inset-x-0 top-0 z-30 bg-white/70 backdrop-blur-md border-b border-white/60">
            <div className="w-full px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
              <button
                onClick={handleLogoClick}
                className="inline-flex items-center gap-3 select-none"
                aria-label="Toggle menu"
              >
                <img
                  src="/lovable-uploads/56606f98-8f2c-42df-bc47-d3cf8c50cfff.png"
                  alt="Innosales logo"
                  className="h-11 md:h-12 w-auto object-contain"
                  loading="eager"
                />
                <span className="hidden sm:inline text-lg md:text-xl text-foreground font-semibold">Innosales</span>
              </button>

              <div className="hidden md:flex items-center gap-2 rounded-full border bg-white/70 backdrop-blur-md px-3 py-1 text-xs">
                <Zap className="h-4 w-4" />
                <span>0 / 100 runs gebruikt</span>
              </div>
            </div>
          </header>

          {/* Desktop overlay sidebar - only visible when toggled */}
          {sidebarOpen && (
            <div
              className="fixed left-0 top-0 z-40 hidden lg:flex h-dvh w-64 transition-all duration-300 ease-out bg-white/70 backdrop-blur-md border-r border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              aria-expanded={sidebarOpen}
            >
              <div className="flex h-full w-full flex-col p-3">
                {/* Sidebar top brand */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 h-14 w-full rounded-md text-left hover:bg-muted/60"
                >
                  <img
                    src="/lovable-uploads/56606f98-8f2c-42df-bc47-d3cf8c50cfff.png"
                    alt="Innosales logo"
                    className="h-10 w-auto object-contain"
                  />
                  <span className="text-base font-semibold">Innosales</span>
                </button>

                {/* Nav */}
                <div className="mt-2 space-y-1">
                  <button className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/60">
                    <Home className="h-4 w-4" />
                    <span className="whitespace-nowrap text-sm text-muted-foreground">Home</span>
                  </button>

                  <div className="mt-2 px-2">
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Activiteit</div>
                  </div>
                  <button className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/60">
                    <Activity className="h-4 w-4" />
                    <span className="whitespace-nowrap text-sm text-muted-foreground">Alle activiteit</span>
                  </button>
                </div>

                {/* Segmenten */}
                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between px-2">
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Segmenten</div>
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
                          <span className="whitespace-nowrap text-sm">{s}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom */}
                <div className="mt-auto space-y-3">
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
          )}

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

                <div className="flex items-center gap-3 h-14 mt-1">
                  <img
                    src="/lovable-uploads/56606f98-8f2c-42df-bc47-d3cf8c50cfff.png"
                    alt="Innosales logo"
                    className="h-10 w-auto object-contain"
                  />
                  <span className="text-base font-semibold">Innosales</span>
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

          <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-32 md:pt-36 pb-10 md:pb-12">
<header className="text-center">
  <h1 className="text-2xl md:text-3xl font-semibold">Start je segment</h1>
  <p className="mt-1 text-sm text-muted-foreground">Geef je wensen op en laat AI je prospectlijst genereren.</p>
</header>

            {/* Chips row */}
<div className="mt-6 flex flex-wrap items-center justify-center gap-2">
  <button
    onClick={() => prefillPrompt(currentSuggestion)}
    className="rounded-full border bg-white/80 backdrop-blur px-3 py-1 text-sm hover:bg-white"
  >
    {currentSuggestion}
  </button>
  <button
    aria-label="Vernieuw suggestie"
    onClick={() => setSuggestionIndex((i) => i + 1)}
    className="ml-1 inline-flex items-center rounded-full border bg-white/80 px-2 py-1 text-sm hover:bg-white"
  >
    <RefreshCcw className="h-4 w-4" />
  </button>
</div>

            {/* Prompt card */}
            <div className="mt-4">
              <HeroPrompt key={keySeed} showHeader={false} />
            </div>

<section className="mt-8">
  <header className="mb-3">
    <h2 className="text-lg font-semibold">Prospects (voorbeelddata)</h2>
    <p className="text-sm text-muted-foreground">Dit is een voorbeeldlijst met velden die we uit de KVK-API zullen vullen.</p>
  </header>
  <div className="overflow-auto rounded-xl border bg-white/70 backdrop-blur-md">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Naam</TableHead>
          <TableHead>KVK</TableHead>
          <TableHead>Plaats</TableHead>
          <TableHead>Provincie</TableHead>
          <TableHead>Vest.</TableHead>
          <TableHead>Medew.</TableHead>
          <TableHead>Inschrijfdatum</TableHead>
          <TableHead>Rechtsvorm</TableHead>
          <TableHead>Website</TableHead>
          <TableHead>Non-mailing</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {placeholderProspects.map((p) => (
          <TableRow key={p.kvk_nummer}>
            <TableCell className="font-medium">{p.naam}</TableCell>
            <TableCell className="font-mono text-xs">{p.kvk_nummer}</TableCell>
            <TableCell>{p.plaats}</TableCell>
            <TableCell>{p.provincie}</TableCell>
            <TableCell>{p.vestigingen_count}</TableCell>
            <TableCell>{p.total_emp ?? "—"}</TableCell>
            <TableCell>{p.reg_date ?? "—"}</TableCell>
            <TableCell>{p.rechtsvorm ?? "—"}</TableCell>
            <TableCell>
              {p.websites?.[0] ? (
                <a
                  href={p.websites[0]}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  {(p.websites[0] || "").replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                {p.non_mailing ? "Ja" : "Nee"}
              </span>
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-[hsl(var(--gold))] text-white">
                {p.score}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</section>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
