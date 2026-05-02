import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Simple in-memory rate limiting (per worker instance)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 emails per minute per IP-ish key

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(key, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

/**
 * Resolve the Resend API key from the Cloudflare Workers runtime env
 * or from process.env as a fallback (local dev).
 */
async function getResendKey(): Promise<string | undefined> {
  // 1. Try cloudflare:workers (production + wrangler dev)
  //    We use Function() to create a dynamic import that Vite can't
  //    statically analyze and tree-shake/crash on.
  try {
    const cfMod = await (new Function(
      'return import("cloudflare:workers")',
    )() as Promise<{ env: Record<string, string> }>);
    if (cfMod?.env?.RESEND_API_KEY) return cfMod.env.RESEND_API_KEY;
  } catch {
    // not in Workers runtime — that's fine
  }

  // 2. Fallback: process.env (Node-compat or local Vite SSR)
  try {
    if (typeof process !== "undefined" && process.env?.RESEND_API_KEY) {
      return process.env.RESEND_API_KEY;
    }
  } catch {
    // process not defined
  }

  return undefined;
}

export const sendContactEmail = createServerFn({ method: "POST" })
  .inputValidator((data: ContactFormData) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { name, email, subject, message } = data;

    // Rate limit by sender email
    if (isRateLimited(email)) {
      return {
        success: false as const,
        error: "Too many requests. Please wait a minute and try again.",
      };
    }

    const apiKey = await getResendKey();
    if (!apiKey) {
      console.error("[send-email] RESEND_API_KEY not found in cloudflare:workers env or process.env");
      return {
        success: false as const,
        error: "Email service is not configured. Please try again later.",
      };
    }

    try {
      // Using fetch directly instead of the Resend SDK to ensure
      // full compatibility with Cloudflare Workers runtime
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: "mihirpatel6075@gmail.com",
          reply_to: email,
          subject: `${subject} — ${name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
              <div style="border-bottom: 2px solid #e5e5e5; padding-bottom: 16px; margin-bottom: 24px;">
                <h2 style="margin: 0; font-size: 20px; color: #111;">New message from your portfolio</h2>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px; width: 80px; vertical-align: top;">Name</td>
                  <td style="padding: 8px 0; color: #111; font-size: 14px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">Email</td>
                  <td style="padding: 8px 0; color: #111; font-size: 14px;"><a href="mailto:${email}" style="color: #111;">${email}</a></td>
                </tr>
              </table>
              <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #333; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="font-size: 12px; color: #999; margin: 0;">Sent via mihirpatel.dev contact form</p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Resend API error:", response.status, errorData);
        return {
          success: false as const,
          error: "Failed to send email. Please try again later.",
        };
      }

      return { success: true as const };
    } catch (error) {
      console.error("Failed to send email:", error);
      return {
        success: false as const,
        error: "Something went wrong. Please try again later.",
      };
    }
  });
