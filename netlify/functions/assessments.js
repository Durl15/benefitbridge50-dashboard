exports.handler = async (event) => {
  try {
    const res = await fetch("https://web-production-26d78.up.railway.app/api/assessments?limit=500" );
    const data = await res.json();
    return { statusCode: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Failed to fetch assessments" }) };
  }
};