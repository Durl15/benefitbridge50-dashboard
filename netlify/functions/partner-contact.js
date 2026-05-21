exports.handler = async (event) => {
  if (event.httpMethod !== "POST" ) return { statusCode: 405, body: "Method Not Allowed" };
  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) }; }
  const { name, org, email, phone, org_type, message, tier } = body;
  if (!email || !email.includes("@") || !name || !org) return { statusCode: 400, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Name, organization, and email are required" }) };
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const MAILCHIMP_KEY = process.env.MAILCHIMP_API_KEY;
  const MAILCHIMP_LIST = process.env.MAILCHIMP_LIST_ID;
  try {
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_KEY}` },
      body: JSON.stringify({
        from: "BenefitBridge 50+ <noreply@benefitbridge50.com>",
        to: ["djohnson@djaiconsulting.com"],
        subject: `New Partner Demo Request: ${org}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px"><h2 style="color:#0F2044">New Demo Request</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px 0;color:#6B7280;font-size:14px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr><tr><td style="padding:8px 0;color:#6B7280;font-size:14px">Organization</td><td style="padding:8px 0;font-weight:600">${org}</td></tr><tr><td style="padding:8px 0;color:#6B7280;font-size:14px">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr><tr><td style="padding:8px 0;color:#6B7280;font-size:14px">Phone</td><td style="padding:8px 0">${phone || "—"}</td></tr><tr><td style="padding:8px 0;color:#6B7280;font-size:14px">Org Type</td><td style="padding:8px 0">${org_type || "—"}</td></tr><tr><td style="padding:8px 0;color:#6B7280;font-size:14px">Interested Plan</td><td style="padding:8px 0">${tier || "—"}</td></tr><tr><td style="padding:8px 0;color:#6B7280;font-size:14px">Message</td><td style="padding:8px 0">${message || "—"}</td></tr></table><div style="margin-top:24px;padding:16px;background:#F0FDF4;border-radius:8px;font-size:13px;color:#065F46">Submitted via benefitbridge50.com/partners</div></div>`,
      } ),
    });
    const mcRes = await fetch(`https://us4.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Basic " + Buffer.from("anystring:" + MAILCHIMP_KEY ).toString("base64") },
      body: JSON.stringify({ email_address: email, status: "subscribed", tags: ["partner-lead"], merge_fields: { FNAME: name.split(" ")[0], LNAME: name.split(" ").slice(1).join(" ") } }),
    });
    const emailData = await emailRes.json();
    const success = emailRes.ok || (await mcRes.json()).title === "Member Exists";
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ success: true }) };
  } catch (e) { return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Server error" }) }; }
};