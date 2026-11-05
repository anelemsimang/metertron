import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { PlatformShell } from "@/components/platform/platform-shell";
import { getPlatformStaff } from "@/server/platform/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Metertron Platform",
  robots: { index: false, follow: false },
};

export default async function PlatformConsoleLayout({ children }: { children: ReactNode }) {
  const staff = await getPlatformStaff();
  if (!staff) redirect("/platform/login");
  if (!staff.totpEnabled || !staff.totpVerified) redirect("/platform/login");
  return (
    <PlatformShell staff={{ name: staff.name, email: staff.email, role: staff.role }}>
      {children}
    </PlatformShell>
  );
}
