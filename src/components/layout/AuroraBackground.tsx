/**
 * Decorative animated aurora background.
 * Fixed, pointer-events: none, respects reduced motion via CSS.
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="aurora-blob animate-float-slow"
        style={{
          top: "-12%",
          right: "-8%",
          width: "42vw",
          height: "42vw",
          maxWidth: "640px",
          maxHeight: "640px",
          background:
            "radial-gradient(circle at 30% 30%, var(--color-accent-2), transparent 65%)",
        }}
      />
      <div
        className="aurora-blob animate-float-rev"
        style={{
          top: "8%",
          left: "-10%",
          width: "38vw",
          height: "38vw",
          maxWidth: "560px",
          maxHeight: "560px",
          background:
            "radial-gradient(circle at 60% 40%, var(--color-accent), transparent 65%)",
        }}
      />
      <div
        className="aurora-blob animate-float-slow"
        style={{
          bottom: "-18%",
          left: "30%",
          width: "44vw",
          height: "44vw",
          maxWidth: "700px",
          maxHeight: "700px",
          background:
            "radial-gradient(circle at 50% 50%, var(--color-accent-3), transparent 65%)",
          animationDelay: "-6s",
        }}
      />
      {/* subtle grain/noise overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
