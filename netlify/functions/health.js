exports.handler = async () => {
  try {
    const res = await fetch("https://web-production-26d78.up.railway.app/health" );
    const data = await res.json();
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "error" }) };
  }
};