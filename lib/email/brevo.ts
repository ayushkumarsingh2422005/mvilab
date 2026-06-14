import { site } from "@/lib/content";
import { getAppUrl } from "@/lib/auth/session";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

type SendEmailInput = {
  to: { email: string; name: string };
  subject: string;
  htmlContent: string;
};

function getSender() {
  return {
    name: process.env.BREVO_SENDER_NAME ?? site.shortName,
    email: process.env.BREVO_SENDER_EMAIL ?? site.contact,
  };
}

async function sendTransactionalEmail({ to, subject, htmlContent }: SendEmailInput) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("Missing BREVO_API_KEY environment variable.");
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: getSender(),
      to: [to],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
  }
}

export async function sendStudentWelcomeEmail({
  to,
  name,
  studentId,
  resetUrl,
}: {
  to: string;
  name: string;
  studentId: string;
  resetUrl: string;
}) {
  await sendTransactionalEmail({
    to: { email: to, name },
    subject: `Your ${site.shortName} student ID has been created`,
    htmlContent: `
      <html>
        <body>
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:560px">
            <h2 style="color:#0d7c8c;margin-bottom:8px">Welcome to ${site.shortName}</h2>
            <p>Hello ${name},</p>
            <p>Your student account has been created. Your official student ID is:</p>
            <p style="font-size:20px;font-weight:700;color:#0d7c8c;letter-spacing:0.04em">${studentId}</p>
            <p>Use this ID with your email when signing in to the student portal.</p>
            <p>Before your first login, set your password using the secure link below:</p>
            <p><a href="${resetUrl}" style="display:inline-block;background:#0d7c8c;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">Set your password</a></p>
            <p style="font-size:13px;color:#666">This link expires in 7 days. If you did not expect this email, contact the lab administrator.</p>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
  portalLabel,
}: {
  to: string;
  name: string;
  resetUrl: string;
  portalLabel: string;
}) {
  await sendTransactionalEmail({
    to: { email: to, name },
    subject: `${site.shortName} — reset your ${portalLabel} password`,
    htmlContent: `
      <html>
        <body>
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:560px">
            <h2 style="color:#0d7c8c;margin-bottom:8px">Password reset</h2>
            <p>Hello ${name},</p>
            <p>We received a request to reset your password for the ${portalLabel}.</p>
            <p><a href="${resetUrl}" style="display:inline-block;background:#0d7c8c;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">Reset password</a></p>
            <p style="font-size:13px;color:#666">This link expires in 24 hours. If you did not request a reset, you can ignore this email.</p>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendAdminWelcomeEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  await sendTransactionalEmail({
    to: { email: to, name },
    subject: `Your ${site.shortName} admin account has been created`,
    htmlContent: `
      <html>
        <body>
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:560px">
            <h2 style="color:#0d7c8c;margin-bottom:8px">Admin access granted</h2>
            <p>Hello ${name},</p>
            <p>An administrator has created your admin account for ${site.shortName}.</p>
            <p>Set your password using the secure link below before signing in to the admin portal:</p>
            <p><a href="${resetUrl}" style="display:inline-block;background:#0d7c8c;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">Set your password</a></p>
            <p style="font-size:13px;color:#666">This link expires in 7 days. If you did not expect this email, contact the lab administrator.</p>
          </div>
        </body>
      </html>
    `,
  });
}

export function buildResetUrl(portal: "admin" | "student", token: string) {
  const base = portal === "admin" ? "/admin/reset-password" : "/portal/reset-password";
  return `${getAppUrl()}${base}?token=${encodeURIComponent(token)}`;
}
