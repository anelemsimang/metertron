import { getSessionUser } from "@/server/auth/session";
import { safeDbMessage, withOrg } from "@/server/db/client";
import { resolveFieldForm } from "@/server/templates/forms";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  try {
    return await withOrg(user.organisationId, async () => {
      const form = await resolveFieldForm(user.organisationId);
      return Response.json({ form, source: form.key === "meter-change" && form.version === 1 ? "builtin" : "tenant" });
    });
  } catch (error) {
    return Response.json({ error: safeDbMessage(error) }, { status: 500 });
  }
}
