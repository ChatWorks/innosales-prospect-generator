import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";

export interface ChromaItem {
  id: string;
  title: string; // bedrijfsnaam
  score: number;
  url?: string; // voor detail of externe link
  image?: string; // hero afbeelding optioneel
  subtitle?: string; // sector of korte beschrijving
  location?: string;
  employees?: number;
  sector?: string;
  ctaLabel?: string; // knop label
}

interface Props {
  items: ChromaItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number; // not used but kept for API parity
  damping?: number;
  fadeOut?: number;
  ease?: string;
  onItemClick?: (id: string) => void;
}

const ChromaGrid = ({
  items,
  className = "",
  radius = 280,
  columns = 3,
  rows = 0,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
  onItemClick,
}: Props) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fadeRef = useRef<HTMLDivElement | null>(null);
  const setX = useRef<((v: number) => void) | null>(null);
  const setY = useRef<((v: number) => void) | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  // Abstract hero backgrounds for cards without images (9 styles)
  const ART_BG = [
    "radial-gradient(60% 100% at 50% 0%, hsl(var(--primary) / 0.25), transparent 60%), linear-gradient(135deg, hsl(var(--card)), transparent)",
    "conic-gradient(from 180deg at 50% 50%, hsl(var(--gold) / 0.15), transparent 40%, hsl(var(--primary) / 0.15))",
    "linear-gradient(145deg, hsl(var(--primary) / 0.18), hsl(var(--background)))",
    "radial-gradient(80% 80% at 20% 20%, hsl(var(--gold) / 0.18), transparent 60%)",
    "linear-gradient(120deg, hsl(var(--primary) / 0.15), transparent), radial-gradient(50% 60% at 80% 20%, hsl(var(--gold) / 0.14), transparent 60%)",
    "conic-gradient(from 90deg at 50% 50%, hsl(var(--primary) / 0.16), transparent 30%, hsl(var(--gold) / 0.12))",
    "linear-gradient(180deg, hsl(var(--card)), hsl(var(--primary) / 0.08)), radial-gradient(60% 60% at 70% 30%, hsl(var(--gold) / 0.12), transparent 60%)",
    "radial-gradient(100% 100% at 50% 100%, hsl(var(--primary) / 0.2), transparent 60%)",
    "conic-gradient(from 45deg at 50% 50%, hsl(var(--gold) / 0.12), hsl(var(--primary) / 0.12), transparent)"
  ];

  // Default hero image used when no per-item image is provided
  const DEFAULT_HERO = "/lovable-uploads/c9a7c320-addb-4ca4-805d-31a8962de3c0.png";

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el as HTMLElement, "--x", "px") as unknown as (v: number) => void;
    setY.current = gsap.quickSetter(el as HTMLElement, "--y", "px") as unknown as (v: number) => void;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return;
    moveTo(e.clientX - r.left, e.clientY - r.top);
    if (fadeRef.current) {
      gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    }
  };

  const handleLeave = () => {
    if (fadeRef.current) {
      gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true });
    }
  };

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        // @ts-ignore CSS custom properties
        "--r": `${radius}px`,
        // @ts-ignore
        "--cols": columns,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {items.map((it, i) => (
        <article
          key={it.id}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => onItemClick?.(it.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onItemClick?.(it.id);
            }
          }}
          aria-label={`${it.title} – score ${it.score}`}
        >
          <div
            className="chroma-hero"
            style={{
              // @ts-ignore custom property for background
              "--hero-bg": it.image ? undefined : ART_BG[i % ART_BG.length],
            }}
          >
            <img
              src={it.image || DEFAULT_HERO}
              alt={`Afbeelding van ${it.title}`}
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = DEFAULT_HERO;
              }}
            />
          </div>

          <section className="chroma-info">
            <div className="chroma-text">
              <h3 className="name">{it.title}</h3>
              {(it.subtitle || it.sector || it.location) && (
                <p className="subtitle">
                  {it.subtitle || [it.sector, it.location].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>

            <div className="chroma-metrics">
              <span className="score-badge" aria-label="Leadscore">{it.score}</span>
              {it.location && <span className="metric">{it.location}</span>}
            </div>

            <footer className="chroma-actions">
              <button
                type="button"
                className="chroma-cta"
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick?.(it.id);
                }}
                aria-label={`Bekijk prospect ${it.title}`}
              >
                {it.ctaLabel || "Bekijk prospect"}
              </button>
            </footer>
          </section>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
