import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Animate a number from 0 to `value` when `active` becomes true.
 * Returns the current displayed value.
 */
export function useCountUp(
  value: number,
  active: boolean,
  options: { duration?: number; decimals?: number; delay?: number } = {},
) {
  const { duration = 1.1, decimals = 0, delay = 0.1 } = options;
  const [display, setDisplay] = useState(0);
  const obj = useRef({ v: 0 });

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tween = gsap.to(obj.current, {
      v: value,
      duration: reduce ? 0.001 : duration,
      delay: reduce ? 0 : delay,
      ease: "power2.out",
      onUpdate: () => setDisplay(obj.current.v),
    });
    return () => {
      tween.kill();
    };
  }, [value, active, duration, delay]);

  const rounded = decimals > 0 ? display.toFixed(decimals) : Math.round(display);
  return { value: rounded, raw: display };
}
