#!/usr/bin/env node
// Walks topic bank indices 49 → 500 calling /api/admin/preseed-batch in batches of 10.
// Stops cleanly if endpoint returns nextFrom >= 500 or no more topics.
import http from "node:http";

const BASE = "http://localhost:3000";
const SIZE = 10;
const MAX_INDEX = 500;
const STUB_ONLY = "1";

function postBatch(from) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: "localhost",
        port: 3000,
        method: "POST",
        path: `/api/admin/preseed-batch?from=${from}&size=${SIZE}&stubOnly=${STUB_ONLY}`,
        timeout: 90_000,
      },
      (res) => {
        let buf = "";
        res.setEncoding("utf8");
        res.on("data", (d) => (buf += d));
        res.on("end", () => {
          try {
            resolve(JSON.parse(buf));
          } catch (e) {
            reject(new Error(`bad JSON from server (status ${res.statusCode}): ${buf.slice(0, 200)}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy(new Error("request timeout"));
    });
    req.end();
  });
}

(async () => {
  const startedAt = Date.now();
  let cursor = parseInt(process.argv[2] || "49", 10);
  let totalInserted = 0;
  let totalErrors = 0;
  let totalSkipped = 0;
  let lastTotals = null;
  let consecutiveFailures = 0;

  while (cursor < MAX_INDEX) {
    const t0 = Date.now();
    let res;
    try {
      res = await postBatch(cursor);
    } catch (err) {
      consecutiveFailures += 1;
      console.error(`[from=${cursor}] FAIL (${consecutiveFailures}): ${err.message}`);
      if (consecutiveFailures >= 3) {
        console.error("Aborting after 3 consecutive failures");
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, 5000));
      continue;
    }
    consecutiveFailures = 0;
    const ms = Date.now() - t0;
    const inserted = res.inserted ?? 0;
    const errors = res.errors ?? 0;
    const nextFrom = res.nextFrom ?? cursor + SIZE;
    const skipped = (res.results || []).filter((r) => r.skipped).length;
    totalInserted += inserted;
    totalErrors += errors;
    totalSkipped += skipped;
    lastTotals = res.totals;
    console.log(
      `[from=${cursor}] ${ms}ms inserted=${inserted} errors=${errors} skipped=${skipped} next=${nextFrom} totals=${JSON.stringify(
        res.totals
      )}`
    );
    cursor = nextFrom;
    if (cursor >= MAX_INDEX) break;
    // Tiny pause to let event loop breathe
    await new Promise((r) => setTimeout(r, 200));
  }

  const totalMs = Date.now() - startedAt;
  console.log("---");
  console.log(
    `DONE. inserted=${totalInserted} errors=${totalErrors} skipped=${totalSkipped} elapsed=${(totalMs / 1000).toFixed(
      1
    )}s totals=${JSON.stringify(lastTotals)}`
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
