import { EmailButton, EmailLayout } from "@/server/email/layout";

export function VerifyEmailTemplate({ name, verifyUrl }: { name: string; verifyUrl: string }) {
  return (
    <EmailLayout preview="Verify your Metertron email">
      <p style={{ marginTop: 0 }}>Hi {name},</p>
      <p>Confirm your email to finish setting up Metertron.</p>
      <EmailButton href={verifyUrl} label="Verify email" />
      <p style={{ marginTop: 20, fontSize: 13, color: "#667d70" }}>If you did not create this account, you can ignore this message.</p>
    </EmailLayout>
  );
}

export function InviteEmailTemplate({
  organisationName,
  role,
  inviteUrl,
  inviterName,
}: {
  organisationName: string;
  role: string;
  inviteUrl: string;
  inviterName: string;
}) {
  return (
    <EmailLayout preview={`Join ${organisationName} on Metertron`}>
      <p style={{ marginTop: 0 }}>{inviterName} invited you to {organisationName} on Metertron as {role}.</p>
      <p>Accept the invite to join the organisation.</p>
      <EmailButton href={inviteUrl} label="Accept invite" />
      <p style={{ marginTop: 20, fontSize: 13, color: "#667d70" }}>This invite expires in 7 days.</p>
    </EmailLayout>
  );
}

export function BillingEmailTemplate({
  organisationName,
  subjectLine,
  body,
  actionUrl,
  actionLabel,
}: {
  organisationName: string;
  subjectLine: string;
  body: string;
  actionUrl?: string;
  actionLabel?: string;
}) {
  return (
    <EmailLayout preview={subjectLine}>
      <p style={{ marginTop: 0 }}>{organisationName}</p>
      <p>{body}</p>
      {actionUrl && actionLabel ? <EmailButton href={actionUrl} label={actionLabel} /> : null}
    </EmailLayout>
  );
}

export function ExportReadyEmailTemplate({
  organisationName,
  exportLabel,
  downloadUrl,
}: {
  organisationName: string;
  exportLabel: string;
  downloadUrl: string;
}) {
  return (
    <EmailLayout preview={`Export ready — ${exportLabel}`}>
      <p style={{ marginTop: 0 }}>Your export for {organisationName} is ready.</p>
      <p>{exportLabel}</p>
      <EmailButton href={downloadUrl} label="Open exports" />
    </EmailLayout>
  );
}

export function RejectionEmailTemplate({
  technicianName,
  jobLabel,
  reason,
  jobUrl,
}: {
  technicianName: string;
  jobLabel: string;
  reason: string;
  jobUrl: string;
}) {
  return (
    <EmailLayout preview={`Job needs attention — ${jobLabel}`}>
      <p style={{ marginTop: 0 }}>Hi {technicianName},</p>
      <p>
        {jobLabel} was rejected and needs a fix before resubmit.
      </p>
      <p style={{ background: "#F7FAF8", padding: 12, borderRadius: 8 }}>
        <strong>Reason:</strong> {reason}
      </p>
      <EmailButton href={jobUrl} label="Open job" />
    </EmailLayout>
  );
}

export function SupportAccessEmailTemplate({
  organisationName,
  staffName,
  reason,
  startedAt,
}: {
  organisationName: string;
  staffName: string;
  reason: string;
  startedAt: string;
}) {
  return (
    <EmailLayout preview={`Metertron support accessed ${organisationName}`}>
      <p style={{ marginTop: 0 }}>Metertron support started a session on {organisationName}.</p>
      <p>
        <strong>Staff:</strong> {staffName}
        <br />
        <strong>When:</strong> {startedAt}
        <br />
        <strong>Reason:</strong> {reason}
      </p>
      <p style={{ fontSize: 13, color: "#667d70" }}>You can review support access on Team in Manager.</p>
    </EmailLayout>
  );
}

export function DigestEmailTemplate({
  organisationName,
  lines,
  officeUrl,
}: {
  organisationName: string;
  lines: string[];
  officeUrl: string;
}) {
  return (
    <EmailLayout preview={`${organisationName} — daily digest`}>
      <p style={{ marginTop: 0 }}>Daily digest for {organisationName}</p>
      <ul style={{ paddingLeft: 18 }}>
        {lines.map((line) => (
          <li key={line} style={{ marginBottom: 6 }}>
            {line}
          </li>
        ))}
      </ul>
      <EmailButton href={officeUrl} label="Open Manager" />
    </EmailLayout>
  );
}
