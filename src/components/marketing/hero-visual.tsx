/** Real office + field UI — screenshots clipped inside device frames, no overflow. */
export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-xl overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 rounded-[32px] opacity-40"
        style={{
          backgroundImage: "url(/images/marketing/patterns/dial-grid.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-[8%] rounded-[28px] border border-white/15 bg-[#0a2818]/60 mk-glow backdrop-blur-[2px]" />

      <div className="absolute bottom-[12%] left-[5%] right-[26%] overflow-clip rounded-xl border border-white/20 bg-[#0b1f14] p-1.5 shadow-2xl [transform:translateZ(0)] sm:p-2">
        <div className="overflow-clip rounded-lg bg-[#f7faf8] [transform:translateZ(0)]">
          <img
            src="/images/marketing/screenshots/office-dashboard.png?v=2"
            alt="Metertron office dashboard with review stats and latest captures"
            width={1440}
            height={900}
            className="block h-auto w-full max-w-full"
          />
        </div>
      </div>

      <div className="absolute bottom-[5%] right-[4%] w-[30%] max-w-[140px] overflow-clip rounded-[1.35rem] border border-white/25 bg-[#0b1f14] p-1 shadow-2xl [transform:translateZ(0)] sm:right-[5%] sm:max-w-[150px] sm:p-1.5">
        <div className="overflow-clip rounded-[1.05rem] bg-[#f7faf8] [transform:translateZ(0)]">
          <img
            src="/images/marketing/screenshots/field-capture.png?v=2"
            alt="Metertron field capture form on a phone"
            width={390}
            height={844}
            className="block h-auto w-full max-w-full"
          />
        </div>
      </div>
    </div>
  );
}
