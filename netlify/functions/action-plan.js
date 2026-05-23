exports.handler = async (event) => {
  if (event.httpMethod !== "POST" ) {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const body = JSON.parse(event.body);
    const res = await fetch("https://web-production-26d78.up.railway.app/api/action-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ),
    });
    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: text || "Backend error" }) };
    }
    const data = await res.json();
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: err.message }) };
  }
};