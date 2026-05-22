exports.handler = async () => {
  try {
    const res = await fetch("https://web-production-26d78.up.railway.app/health" );
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify({ pinged: true, status: data.status }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ pinged: false, error: e.message }) };
  }
};