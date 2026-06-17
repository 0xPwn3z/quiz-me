import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ConfettiProps {
  /** When true (and changed to true), fire the burst. */
  fire: boolean;
  count?: number;
}

const COLORS = ["#6d28d9", "#db2777", "#2563eb", "#16a34a", "#f59e0b", "#a78bfa"];

/**
 * Lightweight DOM-based confetti burst. Renders nothing visible until fired.
 */
export function Confetti({ fire, count = 90 }: ConfettiProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fire) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const container = containerRef.current;
    if (!container || reduce) return;

    const pieces: HTMLSpanElement[] = [];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      const size = 6 + Math.random() * 8;
      piece.style.cssText = `position:absolute;left:50%;top:30%;width:${size}px;height:${size * (0.4 + Math.random())}px;border-radius:${Math.random() > 0.5 ? "50%" : "2px"};background:${COLORS[i % COLORS.length]};pointer-events:none;will-change:transform,opacity;`;
      container.appendChild(piece);
      pieces.push(piece);
    }

    const ctx = gsap.context(() => {
      pieces.forEach((p) => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 80 + Math.random() * 260;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity - 120;
        const rot = (Math.random() - 0.5) * 720;
        gsap.fromTo(
          p,
          { x: 0, y: 0, opacity: 1, rotation: 0, scale: 1 },
          {
            x: dx,
            y: dy + 240,
            rotation: rot,
            scale: 0.6,
            opacity: 0,
            duration: 1.3 + Math.random() * 0.9,
            ease: "power2.out",
            delay: 0.15,
          },
        );
      });
    }, container);

    const timeout = setTimeout(() => ctx.revert(), 2600);
    return () => {
      clearTimeout(timeout);
      ctx.revert();
    };
  }, [fire, count]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    />
  );
}
