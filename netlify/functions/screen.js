exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const res = await fetch("https://web-production-26d78.up.railway.app/api/screen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ),
  });
  const data = await res.json();
  return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) };
};