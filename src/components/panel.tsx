import type { ReactNode } from "react";

type PanelProps = {
  step: number;
  title: string;
  concept: string;
  description: string;
  code: string;
  codePath: string;
  actions: ReactNode;
  children?: ReactNode;
};

export function Panel({
  step,
  title,
  concept,
  description,
  code,
  codePath,
  actions,
  children,
}: PanelProps) {
  return (
    <section
      aria-labelledby={`step-${step}`}
      className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-sm font-semibold text-[var(--panel)]">
            {step}
          </span>
          <div>
            <h2 id={`step-${step}`} className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            <p className="mt-1 max-w-prose text-sm leading-6 text-[var(--muted)]">{description}</p>
          </div>
        </div>
        <code className="rounded-md bg-[var(--chip)] px-2 py-1 font-mono text-xs font-medium text-[var(--accent)]">
          {concept}
        </code>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">{actions}</div>

      {children ? <div className="mt-4">{children}</div> : null}

      <details className="group mt-4 border-t border-[var(--line)] pt-3">
        <summary className="cursor-pointer select-none text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">
          Show the code <span className="font-mono text-xs">({codePath})</span>
        </summary>
        <pre className="mt-3 max-h-[28rem] overflow-auto rounded-xl bg-[var(--code-bg)] p-4 font-mono text-[12.5px] leading-5 text-[var(--code-ink)]">
          <code>{code}</code>
        </pre>
      </details>
    </section>
  );
}

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const styles =
    variant === "primary"
      ? "bg-[var(--accent)] text-white hover:brightness-110"
      : "border border-[var(--line)] bg-transparent text-[var(--ink)] hover:bg-[var(--chip)]";

  return (
    <button
      type="button"
      className={`inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--chip)] px-2.5 py-1 text-xs text-[var(--muted)]">
      {label} <span className="font-semibold text-[var(--ink)]">{value}</span>
    </span>
  );
}

// The hooks surface a failed response's body as the error message; our routes send `{ error }`.
function readable(message: string): string {
  try {
    const parsed: unknown = JSON.parse(message);
    if (parsed && typeof parsed === "object" && "error" in parsed) return String(parsed.error);
  } catch {
    // Not JSON: already readable.
  }
  return message;
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-2 text-sm text-[var(--danger)]"
    >
      {readable(message)}
    </p>
  );
}

export function Spinner() {
  return (
    <span
      aria-hidden
      className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );
}
