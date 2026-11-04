import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="bg-[var(--mt-leaf-deep)] text-center text-xs font-semibold text-white sm:text-sm">
      <div className="mk-container flex flex-wrap items-center justify-center gap-x-2 gap-y-1 py-2">
        <span className="sm:hidden">7-day free trial</span>
        <span className="hidden sm:inline">7-day free trial · full Metertron access</span>
        <span className="hidden text-white/50 sm:inline" aria-hidden>
          ·
        </span>
        <Link href="/login" className="underline underline-offset-2 text-white">
          Start now
        </Link>
      </div>
    </div>
  );
}
