exports.handler = async (event) => {
  if (event.httpMethod !== "POST" ) return { statusCode: 405, body: "Method Not Allowed" };
  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) }; }
  const { name, org, email, phone, org_type, message, tier } = body;
  if (!email || !email.includes("@") || !name || !org) return { statusCode: 400, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Name, organization, and email are required" }) };
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  try {
    const res = await fetch("https://us4.api.mailchimp.com/3.0/lists/" + LIST_ID + "/members", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Basic " + Buffer.from("anystring:" + API_KEY ).toString("base64") },
      body: JSON.stringify({ email_address: email, status: "subscribed", merge_fields: { FNAME: name.split(" ")[0] || name, LNAME: name.split(" ").slice(1).join(" ") || "", PHONE: phone || "", COMPANY: org }, tags: ["partner-lead", org_type || "unknown", tier || "Professional"] }),
    });
    const data = await res.json();
    if (res.ok || data.title === "Member Exists") return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ success: true }) };
    return { statusCode: 400, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: data.detail || "Submission failed" }) };
  } catch { return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Server error" }) }; }
};