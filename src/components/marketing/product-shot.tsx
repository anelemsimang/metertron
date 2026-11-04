type ProductShotProps = {
  src: string;
  alt: string;
  /** Desktop browser chrome vs phone bezel */
  device?: "desktop" | "phone";
  className?: string;
};

/** Framed product screenshot — image stays fully inside the device frame. */
export function ProductShot({ src, alt, device = "desktop", className = "" }: ProductShotProps) {
  if (device === "phone") {
    return (
      <div className={`mx-auto w-full max-w-[220px] sm:max-w-[240px] ${className}`}>
        <div className="overflow-clip rounded-[2rem] border border-[var(--mt-grove)]/15 bg-[var(--mt-grove)] p-2 shadow-[0_24px_60px_-28px_rgba(14,61,36,0.55)] [transform:translateZ(0)]">
          <div className="overflow-clip rounded-[1.4rem] bg-[#f7faf8] [transform:translateZ(0)]">
            <img
              src={src}
              alt={alt}
              width={390}
              height={844}
              className="block h-auto w-full max-w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-[0_24px_60px_-28px_rgba(14,61,36,0.45)]">
        <div className="flex items-center gap-1.5 border-b border-line bg-[var(--mt-mist)]/70 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[var(--mt-grove)]/25" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-[var(--mt-grove)]/25" aria-hidden />
          <span className="h-2 w-2 rounded-full bg-[var(--mt-grove)]/25" aria-hidden />
          <span className="ml-2 truncate font-mono text-[10px] text-muted">app.metertron.co.za</span>
        </div>
        <div className="overflow-hidden bg-[var(--mt-slate-50)]">
          <img
            src={src}
            alt={alt}
            width={1440}
            height={900}
            className="block h-auto w-full"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
