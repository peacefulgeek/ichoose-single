import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
const url = process.env.DATABASE_URL;
console.log('connecting...');
const conn = await mysql.createConnection({
  uri: url,
  multipleStatements: true,
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
});
console.log('connected');
const sql = fs.readFileSync('drizzle/0001_medical_korvac.sql', 'utf8');
const stmts = sql.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean);
console.log('stmts:', stmts.length);
for (const stmt of stmts) {
  try { await conn.query(stmt); console.log('OK:', stmt.split('\n')[0].slice(0, 60)); }
  catch (e) { console.warn('ERR:', e.message.slice(0, 200)); }
}
const [rows] = await conn.query("SHOW TABLES");
console.log('tables:', rows.map(r => Object.values(r)[0]));
await conn.end();
