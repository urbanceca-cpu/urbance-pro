import "server-only";
import { db, check } from "./server";
import { eligible, normalizeCategory } from "./domain";
import { businessReady } from "./readiness";

export async function dispatch() {
  if (process.env.OPS_LIVE_ENABLED !== "true")
    return { checked: 0, enabled: false };
  const admin = db();
  const now = Date.now();
  const [{ data: jobs, error }, { data: businesses }, { data: apps }] =
    await Promise.all([
      admin
        .from("jobs")
        .select("*")
        .is("partner_id", null)
        .eq("job_status", "pending")
        .eq("payment_status", "paid")
        .eq("is_demo", false)
        .limit(500),
      admin
        .from("ops_businesses")
        .select("*")
        .eq("online", true)
        .eq("suspended", false)
        .eq("is_demo", false),
      admin
        .from("provider_applications")
        .select("user_id,status")
        .eq("status", "approved"),
    ]);
  if (error) throw Error("Dispatch database unavailable");
  const approved = new Set((apps || []).map((a) => a.user_id));
  const ready = new Set<string>();
  for (const b of businesses || [])
    if (
      approved.has(b.owner_user_id) &&
      (await businessReady(admin, b.owner_user_id, b.is_demo))
    )
      ready.add(b.id);
  for (const job of jobs || []) {
    const city = job.service_city || "",
      category = normalizeCategory(job.service_type || job.service_name || "");
    const shape = {
      city,
      category,
      created_at: job.created_at,
      is_demo: false,
    };
    const pool = (businesses || []).map((b) => ({
      ...b,
      approved: ready.has(b.id),
    }));
    const local = pool.filter((b) => eligible(b, shape, false, now));
    const expanded =
      local.length === 0 || now - Date.parse(job.created_at) >= 30 * 60 * 1000;
    const day = job.scheduled_date
      ? Date.parse(job.scheduled_date + "T23:59:59-08:00")
      : now + 86400000;
    if (day < now) {
      await admin
        .from("ops_dispatch_offers")
        .update({ status: "expired" })
        .eq("job_id", job.id)
        .eq("status", "open");
      continue;
    }
    for (const business of pool.filter((b) =>
      eligible(b, shape, expanded, now),
    )) {
      check(
        await admin
          .from("ops_dispatch_offers")
          .upsert(
            {
              job_id: job.id,
              business_id: business.id,
              wave: business.city === city ? "local" : "nearby",
              expires_at: new Date(day).toISOString(),
            },
            { onConflict: "job_id,business_id", ignoreDuplicates: true },
          ),
      );
      const { data: offer } = await admin
        .from("ops_dispatch_offers")
        .select("status,created_at")
        .eq("job_id", job.id)
        .eq("business_id", business.id)
        .single();
      if (offer?.status !== "open" || !business.repeat_offer_emails) continue;
      const { data: owner } = await admin
        .from("profiles")
        .select("email")
        .eq("id", business.owner_user_id)
        .single();
      if (owner?.email)
        check(
          await admin
            .from("ops_outbox")
            .upsert(
              {
                event_key: `offer:${job.id}:${business.id}:${Math.floor((now - Date.parse(offer.created_at)) / 1800000)}`,
                business_id: business.id,
                job_id: job.id,
                recipient: owner.email,
                subject: `New ${category} request in ${city}`,
                body: `A ${job.service_name || category} request is available in ${city} for ${job.scheduled_date}. Review scope and payout in your Urbance workspace. First acceptance confirms assignment.\n\nhttps://pros.urbance.ca/dashboard/jobs\n\nManage job alerts or go offline in Settings. Exact customer details are shared only after acceptance.`,
              },
              { onConflict: "event_key", ignoreDuplicates: true },
            ),
        );
    }
  }
  return { checked: jobs?.length || 0 };
}

export async function queueJobNotifications(jobId: string, event: string) {
  const admin = db();
  const { data: job } = await admin
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();
  if (!job || job.is_demo) return;
  const emails = new Set<string>();
  if (job.customer_email) emails.add(job.customer_email);
  if (job.partner_id) {
    const { data: p } = await admin
      .from("profiles")
      .select("email")
      .eq("id", job.partner_id)
      .single();
    if (p?.email) emails.add(p.email);
  }
  for (const email of emails)
    check(
      await admin
        .from("ops_outbox")
        .upsert(
          {
            event_key: `job:${jobId}:${event}:${email}`,
            job_id: jobId,
            recipient: email,
            subject: `Urbance · ${event.replaceAll("_", " ")} · ${job.booking_ref || jobId.slice(0, 8)}`,
            body: `Your ${job.service_name || "home service"} booking has an update: ${event.replaceAll("_", " ")}.\n\nCustomers: https://www.urbance.ca/bookings\nProviders: https://pros.urbance.ca/dashboard/jobs\n\nFor help, contact support@urbance.ca. This message concerns your booking.`,
          },
          { onConflict: "event_key", ignoreDuplicates: true },
        ),
    );
}

export async function deliverMail() {
  if (process.env.OPS_LIVE_ENABLED !== "true")
    return {
      configured: false,
      sent: 0,
      message:
        "Live notification delivery is paused during the secure rollout.",
    };
  const admin = db(),
    key = process.env.RESEND_API_KEY,
    from = process.env.NOTIFICATIONS_FROM;
  if (!key || !from)
    return {
      configured: false,
      sent: 0,
      message:
        "Set a verified company sender and RESEND_API_KEY. Notifications remain queued.",
    };
  const rows = check(await admin.rpc("ops_claim_mail")) || [];
  let sent = 0;
  for (const mail of rows) {
    if (mail.event_key.startsWith("offer:")) {
      const { data: job } = await admin
        .from("jobs")
        .select("partner_id,job_status,is_demo")
        .eq("id", mail.job_id)
        .maybeSingle();
      const { data: b } = await admin
        .from("ops_businesses")
        .select("online,repeat_offer_emails,last_seen_at")
        .eq("id", mail.business_id)
        .maybeSingle();
      const { data: offer } = await admin.from("ops_dispatch_offers").select("status,expires_at,created_at").eq("job_id",mail.job_id).eq("business_id",mail.business_id).maybeSingle();
      const mailSlot = Number(mail.event_key.split(":").at(-1));
      const currentSlot = offer ? Math.floor((Date.now()-Date.parse(offer.created_at))/1800000) : -1;
      if (
        !offer || offer.status !== "open" || Date.parse(offer.expires_at) <= Date.now() || mailSlot < currentSlot ||
        !job ||
        job.partner_id ||
        job.job_status !== "pending" ||
        job.is_demo ||
        !b?.online ||
        !b.repeat_offer_emails ||
        Date.now() - Date.parse(b.last_seen_at) > 600000
      ) {
        await admin
          .from("ops_outbox")
          .update({ status: "cancelled" })
          .eq("id", mail.id);
        continue;
      }
    }
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + key,
          "Content-Type": "application/json",
          "Idempotency-Key": mail.id,
        },
        body: JSON.stringify({
          from,
          to: [mail.recipient],
          reply_to: "support@urbance.ca",
          subject: mail.subject,
          text: mail.body,
        }),
        signal: AbortSignal.timeout(10000),
      });
      const data = await res.json();
      if (!res.ok)
        throw Error("Email provider rejected delivery (" + res.status + ").");
      check(
        await admin
          .from("ops_outbox")
          .update({
            status: "sent",
            delivery_id: data.id,
            sent_at: new Date().toISOString(),
            lease_until: null,
            last_error: null,
          })
          .eq("id", mail.id),
      );
      sent++;
    } catch (error) {
      await admin
        .from("ops_outbox")
        .update({
          status: "failed",
          last_error:
            error instanceof Error ? error.message : "Delivery failed",
          lease_until: null,
          next_attempt_at: new Date(
            Date.now() + Math.min(3600000, 60000 * 2 ** mail.attempts),
          ).toISOString(),
        })
        .eq("id", mail.id);
    }
  }
  return { configured: true, sent };
}
