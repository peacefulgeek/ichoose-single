import 'dotenv/config';
import mysql from 'mysql2/promise';
console.log('starting');
const conn = await mysql.createConnection({
  uri: process.env.DATABASE_URL,
  multipleStatements: true,
  connectTimeout: 15000,
  ssl: { rejectUnauthorized: false }
});
console.log('connected');
await conn.query("DROP TABLE IF EXISTS articles");
console.log('drop articles ok');
await conn.query("DROP TABLE IF EXISTS cron_runs");
console.log('drop cron_runs ok');
const [rows] = await conn.query("SHOW TABLES");
console.log('tables:', rows.map(r => Object.values(r)[0]));
await conn.end();
console.log('done');
