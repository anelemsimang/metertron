/** Metertron mark: dial + droplet needle + verification check. */

const FLOW = "#00B4C8";
const RESERVOIR = "#0B1F33";
const VERIFIED = "#A8E63A";
const LIGHT = "#E8F7FA";

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
  const plate = mono === "white" ? "transparent" : mono === "dark" ? "transparent" : RESERVOIR;
  const dial = mono === "white" ? "#ffffff" : mono === "dark" ? RESERVOIR : LIGHT;
  const drop = mono === "white" ? "#ffffff" : mono === "dark" ? RESERVOIR : FLOW;
  const check = mono === "white" ? "#ffffff" : mono === "dark" ? RESERVOIR : VERIFIED;
  const stroke = mono ? undefined : RESERVOIR;

  return (
    <svg viewBox="0 0 64 64" className={className} role={label ? "img" : undefined} aria-hidden={label ? undefined : true} aria-label={label}>
      {mono ? null : <rect width="64" height="64" rx="14" fill={plate} />}
      {/* Outer dial */}
      <circle cx="32" cy="30" r="18" fill="none" stroke={dial} strokeWidth="2.5" />
      {/* Tick marks */}
      <path d="M32 14v3.5M46 30h-3.5M32 46v-3.5M18 30h3.5" stroke={dial} strokeWidth="2" strokeLinecap="round" />
      {/* Droplet needle (pointing up-right, reads as meter needle + water) */}
      <path
        d="M32 22c5.5 6.2 8.5 9.8 8.5 13.8a8.5 8.5 0 1 1-17 0c0-4 3-7.6 8.5-13.8z"
        fill={drop}
        stroke={stroke}
        strokeWidth={mono ? 0 : 0.5}
      />
      <circle cx="32" cy="36.5" r="2.6" fill={mono === "white" ? RESERVOIR : mono === "dark" ? "#ffffff" : RESERVOIR} />
      {/* Verification check at base */}
      <path d="M24 52.5l4 4 12-11" fill="none" stroke={check} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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
