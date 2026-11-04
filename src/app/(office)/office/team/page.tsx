import { DatabaseNotice } from "@/components/office/database-notice";
import { InvitePanel } from "@/components/office/invite-panel";
import { SupportAccessList } from "@/components/office/support-access-list";
import { TeamList } from "@/components/office/team-list";
import { SectionTitle } from "@/components/section-title";
import { getSessionUser } from "@/server/auth/session";
import { loadTeam } from "@/server/office/load";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    const user = await getSessionUser();
    const people = await loadTeam();
    const canInvite = user?.membershipRole === "owner" || user?.membershipRole === "admin";
    return (
      <div className="space-y-4">
        <div>
          <SectionTitle>Team</SectionTitle>
          <p className="mt-3 text-sm text-muted">
            Owners and admins invite people and manage roles. Past jobs stay on record when someone is removed.
          </p>
        </div>
        {canInvite ? <InvitePanel /> : null}
        <SupportAccessList />
        <TeamList
          people={people}
          currentUserId={user?.id ?? ""}
          viewerRole={user?.orgRole === "head" || user?.orgRole === "admin" ? user.orgRole : "admin"}
        />
      </div>
    );
  } catch (error) {
    return <DatabaseNotice title="Team" error={error} />;
  }
}
