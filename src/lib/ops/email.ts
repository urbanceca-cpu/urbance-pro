type Notification = { subject: string; body: string; event_key: string };

const escape = (value: string) => value.replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));

/** Table layout and inline styles work in Gmail, Apple Mail and Outlook. */
export function notificationEmail(mail: Notification) {
  const text = mail.body.replace(/\\r\\n|\\n/g, "\n");
  const offer = mail.event_key.startsWith("offer:");
  const heading = offer ? "Your next job could be here." : mail.event_key.startsWith("job:") ? "An update on your booking." : "You're connected to Urbance.";
  const paragraphs = text.split(/\n\s*\n/).map((p) => `<p style="margin:0 0 20px;font-size:16px;line-height:26px;color:#42556b;overflow-wrap:anywhere">${escape(p).replace(/\n/g,"<br>")}</p>`).join("");
  const action = offer ? "View job request" : "View my bookings";
  const url = offer ? "https://pros.urbance.ca/dashboard/jobs" : "https://www.urbance.ca/bookings";
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><title>${escape(mail.subject)}</title><style>@media(max-width:600px){.content{padding:28px 24px!important}.heading{font-size:29px!important;line-height:36px!important}}@media(prefers-color-scheme:dark){.outer{background:#101c2c!important}.card{background:#182a40!important}.heading{color:#f4f8ff!important}.content p{color:#ccd8e8!important}.footer{color:#bdcde2!important}}</style></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#edf3fa"><div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${escape(mail.subject)} · Your home, in good hands.</div>
<table role="presentation" class="outer" width="100%" cellspacing="0" cellpadding="0" style="background:#edf3fa"><tr><td align="center" style="padding:32px 12px">
<table role="presentation" class="card" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px;background:#ffffff;border-radius:20px;overflow:hidden">
<tr><td style="padding:28px 32px;background:#2f80ed"><a href="https://www.urbance.ca" style="text-decoration:none;color:#ffffff"><img src="https://pros.urbance.ca/brand/wordmark-white.png" width="136" alt="Urbance" style="display:block;max-width:136px;height:auto;border:0;color:#ffffff;font-size:28px;font-weight:bold"></a><p style="margin:14px 0 0;color:#ffffff;font-size:12px;letter-spacing:1.5px">YOUR HOME, IN GOOD HANDS.</p></td></tr>
<tr><td class="content" style="padding:36px 32px"><p style="margin:0 0 12px;color:#216bcf;font-size:12px;font-weight:bold;letter-spacing:1.5px">${offer ? "NEW OPPORTUNITY" : "URBANCE UPDATE"}</p><h1 class="heading" style="margin:0 0 24px;color:#172b41;font-size:34px;line-height:41px;letter-spacing:-1px">${heading}</h1>${paragraphs}
<table role="presentation" cellspacing="0" cellpadding="0"><tr><td bgcolor="#216bcf" style="border-radius:10px;text-align:center"><a href="${url}" style="display:inline-block;padding:16px 24px;color:#ffffff;font-size:15px;line-height:20px;font-weight:bold;text-decoration:none;border:1px solid #216bcf;border-radius:10px">${action} &rarr;</a></td></tr></table>
<p style="margin:28px 0 0;padding-top:24px;border-top:1px solid #dce7f4;font-size:14px;line-height:22px;color:#42556b">Need a hand? Reply to this email or contact <a href="mailto:support@urbance.ca" style="color:#2f80ed">support@urbance.ca</a>.</p></td></tr></table>
<p class="footer" style="margin:24px 8px 8px;font-size:12px;line-height:20px;color:#60758e">Urbance Technologies Inc. · British Columbia, Canada<br>This is a service notification from Urbance.</p>
<p style="margin:0;font-size:12px;line-height:20px"><a href="https://www.urbance.ca" style="color:#60758e">Urbance.ca</a> &nbsp;·&nbsp; <a href="https://pros.urbance.ca/dashboard/settings" style="color:#60758e">Provider notification settings</a></p>
</td></tr></table></body></html>`;
  return { text, html };
}
