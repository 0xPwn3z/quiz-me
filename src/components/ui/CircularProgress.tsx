import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface CircularProgressProps {
  /** 0..100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

/** Animated SVG ring that fills up on mount. */
export function CircularProgress({
  value,
  size = 180,
  strokeWidth = 12,
  label,
}: CircularProgressProps) {
  const [display, setDisplay] = useState(0);
  const progressRef = useRef<SVGCircleElement>(null);
  const obj = useRef({ v: 0 });

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const c = gsap.context(() => {
      gsap.fromTo(
        obj.current,
        { v: 0 },
        {
          v: clamped,
          duration: reduce ? 0.001 : 1.3,
          delay: reduce ? 0 : 0.15,
          ease: "power2.out",
          onUpdate: () => setDisplay(obj.current.v),
        },
      );
    });
    return () => c.revert();
  }, [clamped]);

  const offset = circumference - (display / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="cp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="50%" stopColor="var(--color-accent-2)" />
            <stop offset="100%" stopColor="var(--color-accent-3)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          ref={progressRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#cp-grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.1s linear",
            filter: "drop-shadow(0 0 8px color-mix(in srgb, var(--color-accent) 50%, transparent))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold tracking-tight">
          {display.toFixed(0)}%
        </span>
        {label && <span className="mt-1 text-xs font-semibold text-gray-400">{label}</span>}
      </div>
    </div>
  );
}
