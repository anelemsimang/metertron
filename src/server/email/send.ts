import "server-only";
import { type ReactElement } from "react";
import { log } from "@/server/observability/log";

export type SendEmailInput = {
  to: string;
  subject: string;
  react: ReactElement;
  organisationId?: string;
};

async function renderHtml(react: ReactElement) {
  const { renderToStaticMarkup } = await import("react-dom/server");
  return `<!DOCTYPE html>${renderToStaticMarkup(react)}`;
}

export async function sendEmail(input: SendEmailInput) {
  const html = await renderHtml(input.react);
  const from = process.env.EMAIL_FROM || "Metertron <noreply@metertron.co.za>";
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    log.info("email.stub", {
      organisationId: input.organisationId,
      to: input.to,
      subject: input.subject,
      preview: html.slice(0, 180),
    });
    return { provider: "stub" as const, id: `stub_${Date.now()}` };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    log.error("email.send_failed", {
      organisationId: input.organisationId,
      status: response.status,
      body: body.slice(0, 240),
    });
    throw new Error("Email provider rejected the message");
  }

  const payload = (await response.json()) as { id?: string };
  return { provider: "resend" as const, id: payload.id ?? `resend_${Date.now()}` };
}
