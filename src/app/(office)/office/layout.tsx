import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect, unstable_rethrow } from "next/navigation";
import { OfficeShell } from "@/components/office/office-shell";
import { SupportBanner } from "@/components/office/support-banner";
import { BRAND } from "@/lib/brand";
import { isOfficeMembership } from "@/lib/roles";
import { safeDbMessage } from "@/server/db/client";
import { getSessionUser } from "@/server/auth/session";
import { getSupportContext } from "@/server/platform/support";

export const metadata: Metadata = {
  title: "Manager",
  applicationName: BRAND.officeAppName,
  description: BRAND.officeDescription,
};

export default async function OfficeLayout({ children }: { children: ReactNode }) {
  let user;
  let support;
  try {
    [user, support] = await Promise.all([getSessionUser(), getSupportContext()]);
  } catch (error) {
    unstable_rethrow(error);
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-2xl font-bold">{BRAND.name}</h1>
        <p className="mt-3 text-sm text-danger">{safeDbMessage(error)}</p>
      </main>
    );
  }

  if (support) {
    return (
      <>
        <SupportBanner staffName={support.staffName} organisationName={support.organisationName} />
        <OfficeShell
          user={{
            name: `${support.staffName} (support)`,
            email: support.staffEmail,
            organisationName: support.organisationName,
          }}
        >
          {children}
        </OfficeShell>
      </>
    );
  }

  if (!user) redirect("/login?next=/office");
  if (!isOfficeMembership(user.membershipRole)) redirect("/field");
  if (!user.onboardingCompleted && (user.membershipRole === "owner" || user.membershipRole === "admin")) {
    redirect("/onboarding");
  }
  return (
    <OfficeShell user={{ name: user.name, email: user.email, organisationName: user.organisationName }}>
      {children}
    </OfficeShell>
  );
}
