import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "neutral" | "success" | "error" | "warning";
}

const variants = {
  neutral: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  success: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
  error: "bg-[var(--color-error-bg)] text-[var(--color-error)]",
  warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
};

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
}
