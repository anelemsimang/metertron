import { isOfficeMembership } from "@/lib/roles";
import { AccountPanel } from "@/components/field/account-panel";
import { OrgSwitcher } from "@/components/org/org-switcher";
import { getSessionUser } from "@/server/auth/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/field/account");
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Organisation</p>
        <OrgSwitcher activeName={user.organisationName} className="mt-1 text-base text-ink" />
      </div>
      <AccountPanel
        user={{
          name: user.name,
          username: user.username,
          email: user.email,
          manager: isOfficeMembership(user.membershipRole),
        }}
      />
    </div>
  );
}
