export function Spinner() {
  return (
    <div
      className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-accent)]"
      aria-hidden="true"
    />
  );
}
