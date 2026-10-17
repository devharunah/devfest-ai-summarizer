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

// One Google brand color per step, in logo order: blue, red, yellow, green.
const STEP_COLORS = [
  { solid: "var(--google-blue)", pastel: "var(--pastel-blue)" },
  { solid: "var(--google-red)", pastel: "var(--pastel-red)" },
  { solid: "var(--google-yellow)", pastel: "var(--pastel-yellow)" },
  { solid: "var(--google-green)", pastel: "var(--pastel-green)" },
] as const;

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
  const color = STEP_COLORS[(step - 1) % STEP_COLORS.length] ?? STEP_COLORS[0];

  return (
    <section
      aria-labelledby={`step-${step}`}
      className="rounded-2xl border border-[var(--line)] border-t-4 bg-[var(--panel)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-6"
      style={{ borderTopColor: color.solid }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold text-[var(--ink)]"
            style={{ backgroundColor: color.pastel }}
          >
            {step}
          </span>
          <div>
            <h2 id={`step-${step}`} className="text-xl font-bold tracking-tight">
              {title}
            </h2>
            <p className="mt-1 max-w-prose text-sm leading-6 text-[var(--muted)]">{description}</p>
          </div>
        </div>
        <code
          className="subhead rounded-full px-3 py-1 text-xs text-[var(--ink)]"
          style={{ backgroundColor: color.pastel }}
        >
          {concept}
        </code>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">{actions}</div>

      {children ? <div className="mt-4">{children}</div> : null}

      <details className="group mt-4 border-t border-[var(--line)] pt-3">
        <summary className="subhead cursor-pointer select-none text-sm text-[var(--muted)] hover:text-[var(--ink)]">
          Show the code <span className="text-xs">({codePath})</span>
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
      ? "bg-[var(--accent)] text-white shadow-sm hover:brightness-105"
      : "border border-[var(--line)] bg-transparent text-[var(--ink)] hover:bg-[var(--chip)]";

  return (
    <button
      type="button"
      className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--off-white)] px-2.5 py-1 text-xs text-[var(--muted)]">
      <span className="subhead">{label}</span>{" "}
      <span className="font-bold text-[var(--ink)]">{value}</span>
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
