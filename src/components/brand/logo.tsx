/** Metertron mark: green dial plate, white face, orange needle — measured and ready. */

const GROVE = "#0E3D24";
const LEAF = "#147A45";
const CITRUS = "#F07A1A";
const WHITE = "#FFFFFF";
const MIST = "#E8F5EE";

export function LogoMark({
  className = "h-8 w-8",
  label,
  mono,
}: {
  className?: string;
  label?: string;
  /** `white` for dark backgrounds; `dark` for light backgrounds without colour fill */
  mono?: "white" | "dark";
}) {
  const plate = mono === "white" ? "transparent" : mono === "dark" ? "transparent" : GROVE;
  const dial = mono === "white" ? WHITE : mono === "dark" ? GROVE : MIST;
  const ring = mono === "white" ? WHITE : mono === "dark" ? GROVE : LEAF;
  const needle = mono === "white" ? WHITE : mono === "dark" ? GROVE : CITRUS;
  const hub = mono === "white" ? GROVE : mono === "dark" ? WHITE : WHITE;

  return (
    <svg viewBox="0 0 64 64" className={className} role={label ? "img" : undefined} aria-hidden={label ? undefined : true} aria-label={label}>
      {mono ? null : <rect width="64" height="64" rx="14" fill={plate} />}
      {/* Dial face */}
      <circle cx="32" cy="32" r="20" fill={mono ? "none" : dial} stroke={ring} strokeWidth="2.75" />
      {/* Tick marks */}
      <path
        d="M32 14v4M48 32h-4M32 50v-4M16 32h4M43.3 20.7l-2.8 2.8M43.3 43.3l-2.8-2.8M20.7 43.3l2.8-2.8M20.7 20.7l2.8 2.8"
        stroke={ring}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Orange needle — bold brand accent */}
      <path d="M32 32 L44 18" stroke={needle} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="32" cy="32" r="4" fill={needle} />
      <circle cx="32" cy="32" r="1.8" fill={hub} />
      {/* Base bar — green confidence stripe */}
      {!mono ? <rect x="18" y="54" width="28" height="3.5" rx="1.75" fill={LEAF} /> : null}
    </svg>
  );
}

export function LogoWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-[family-name:var(--font-display)] text-lg font-medium leading-none tracking-[-0.03em] text-ink ${className}`}>
      metertron
    </span>
  );
}

export function LogoLockup({ className = "", stacked = false }: { className?: string; stacked?: boolean }) {
  if (stacked) {
    return (
      <span className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
        <LogoMark className="h-10 w-10 shrink-0" />
        <LogoWordmark />
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <LogoWordmark />
    </span>
  );
}
