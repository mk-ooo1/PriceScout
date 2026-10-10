import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/admin/auth";
import { Resend } from "resend";
import { z } from "zod";

export const dynamic = "force-dynamic";

const broadcastSchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured in your environment variables. Please add it to Vercel." },
      { status: 400 }
    );
  }

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

    const resend = new Resend(resendKey);

    // Format message: convert line breaks to <br/> tags for HTML email
    const htmlMessage = `<p>${message.replace(/\n/g, '<br/>')}</p><br/><br/><hr/><p><small>You received this because you subscribed to PriceScout Deal Alerts.</small></p>`;

    // Note: Resend Free Tier requires you to use "onboarding@resend.dev" as the 'from' address
    // AND you can only send to your own registered email address until you verify a domain.
    // We will use onboarding@resend.dev by default so it doesn't crash on free tier.
    const fromAddress = 'PriceScout Alerts <onboarding@resend.dev>';

    // Resend Batch API (Max 100 per batch)
    // To handle larger lists we would chunk this array into groups of 100.
    const emailsPayload = subscribers.map((sub) => ({
      from: fromAddress,
      to: sub.email,
      subject: subject,
      html: htmlMessage,
    }));

    const data = await resend.batch.send(emailsPayload);

    if (data.error) {
       console.error("Resend API Error:", data.error);
       return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: subscribers.length }, { status: 200 });

  } catch (error: any) {
    console.error("Broadcast Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
