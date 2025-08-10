import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";

export interface ChromaItem {
  id: string;
  title: string;
  score: number;
  url?: string;
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
      {items.map((it) => (
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
          <footer className="chroma-info">
            <h3 className="name">{it.title}</h3>
            <span className="score-badge" aria-label="Leadscore">{it.score}</span>
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
