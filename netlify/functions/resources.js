exports.handler = async () => {
  const res = await fetch("https://web-production-26d78.up.railway.app/api/resources" );
  const data = await res.json();
  return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) };
};