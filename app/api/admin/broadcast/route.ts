import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { z } from "zod";

export const dynamic = "force-dynamic";

const broadcastSchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = broadcastSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { subject, message } = parsed.data;

    const subscribers = await prisma.subscriber.findMany({
      where: { isActive: true },
      select: { email: true }
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No active subscribers found." }, { status: 400 });
    }

    const htmlMessage = `<p>${message.replace(/\n/g, '<br/>')}</p><br/><br/><hr/><p><small>You received this because you subscribed to PriceScout Deal Alerts.</small></p>`;
    const fromAddress = 'PriceScout Alerts <onboarding@resend.dev>'; // Used for Resend free tier

    // 1. Try sending with Resend first
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);

        const emailsPayload = subscribers.map((sub) => ({
          from: fromAddress,
          to: sub.email,
          subject: subject,
          html: htmlMessage,
        }));

        const data = await resend.batch.send(emailsPayload);

        if (!data.error) {
          return NextResponse.json({ success: true, count: subscribers.length, method: "resend" }, { status: 200 });
        }

        console.warn("Resend API returned an error, falling back to Nodemailer:", data.error);
        // If there's an error, we fall through to the Nodemailer catch block
      } catch (resendError) {
        console.warn("Resend threw an exception, falling back to Nodemailer:", resendError);
        // Fall through to Nodemailer
      }
    } else {
      console.warn("No RESEND_API_KEY found, attempting to use Nodemailer fallback immediately.");
    }

    // 2. Fallback to Nodemailer (SMTP)
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: "Email delivery failed. Resend is unavailable/exhausted, and SMTP fallback credentials are not configured in Vercel." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send emails individually to avoid exposing the subscriber list in a BCC or triggering spam filters
    // Note: If the list is huge, we should chunk this or use a queue, but Promise.all is fine for lists < 500
    const sendPromises = subscribers.map(sub =>
      transporter.sendMail({
        from: `"PriceScout Alerts" <${smtpUser}>`,
        to: sub.email,
        subject: subject,
        html: htmlMessage,
      })
    );

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true, count: subscribers.length, method: "smtp" }, { status: 200 });

  } catch (error: any) {
    console.error("Broadcast Error (Both Resend & SMTP failed):", error);
    return NextResponse.json({ error: "Failed to send emails. Gmail daily limit may have been reached." }, { status: 500 });
  }
}
