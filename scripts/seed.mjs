import 'dotenv/config';
const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}/api/admin/seed`;
const r = await fetch(url, { method: "POST" });
console.log(r.status, await r.text());
