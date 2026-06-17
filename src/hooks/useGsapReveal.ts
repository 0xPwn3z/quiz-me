import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";

type RevealOptions = {
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  deps?: unknown[];
};

/**
 * Reveal-on-mount animation. Animates direct children with the `reveal` class
 * (or the element itself if no children have it) with a staggered entrance.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T | null>,
  options: RevealOptions = {},
) {
  const {
    y = 22,
    duration = 0.7,
    stagger = 0.08,
    delay = 0,
    ease = "power3.out",
    deps = [],
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const childTargets = el.querySelectorAll<HTMLElement>(".reveal");
    const targets: gsap.TweenTarget = childTargets.length ? childTargets : el;

    if (reduce) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration, stagger, delay, ease, clearProps: "transform" },
      );
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, y, duration, stagger, delay, ease, ...deps]);
}
