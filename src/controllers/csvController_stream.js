import fs from "fs";
import readline from "readline";
import config from "../config/env.js";
import { pool } from "../db/index.js";

// Convert dot notation (a.b.c) → nested JSON
function buildNestedJSON(flat) {
  const nested = {};
  for (const key in flat) {
    const parts = key.split(".");
    let current = nested;

    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        current[part] = flat[key];
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    });
  }
  return nested;
}

export async function processCSVStream(req, res) {
  const filePath = config.csvPath;
  if (!fs.existsSync(filePath)) {
    return res.status(400).json({ error: "CSV file not found at: " + filePath });
  }

  const stream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: stream });

  let header = [];
  const batch = [];
  const BATCH_SIZE = 500;

  while (true) {
    const line = await rl[Symbol.asyncIterator]().next();
    if (line.done) break;

    const row = line.value.trim();
    if (!row) continue;

    // Process header
    if (!header.length) {
      header = row.split(",").map(h => h.trim());
      continue;
    }

    // Process row
    const cols = row.split(",");
    const flat = {};
    header.forEach((key, i) => {
      flat[key] = cols[i] || "";
    });

    const obj = buildNestedJSON(flat);

    const firstName = obj?.name?.firstName || "";
    const lastName = obj?.name?.lastName || "";
    const name = `${firstName} ${lastName}`.trim();
    const age = parseInt(obj?.age) || 0;

    const address = obj?.address || null;

    // Additional info (excluding mapped fields)
    const { name: _n, age: _a, address: _ad, ...additional_info } = obj;

    batch.push({ name, age, address, additional_info });

    if (batch.length >= BATCH_SIZE) {
      await insertBatch(batch);
      batch.length = 0;
    }
  }

  if (batch.length) await insertBatch(batch);

  await printAgeDistribution();

  res.json({ message: "CSV processed and inserted successfully." });
}

async function insertBatch(records) {
  const values = [];
  const params = [];
  let i = 1;

  for (const r of records) {
    values.push(`($${i++}, $${i++}, $${i++}, $${i++})`);
    params.push(r.name, r.age, JSON.stringify(r.address), JSON.stringify(r.additional_info));
  }

  const query = `
    INSERT INTO users (name, age, address, additional_info)
    VALUES ${values.join(",")}
  `;
  await pool.query(query, params);
}

async function printAgeDistribution() {
  const { rows } = await pool.query("SELECT age FROM users");
  const total = rows.length;
  const count = { lt20: 0, b20_40: 0, b40_60: 0, gt60: 0 };

  rows.forEach(r => {
    if (r.age < 20) count.lt20++;
    else if (r.age <= 40) count.b20_40++;
    else if (r.age <= 60) count.b40_60++;
    else count.gt60++;
  });

  console.log("\nAge-Group % Distribution");
  console.log(`< 20: ${((count.lt20 / total) * 100).toFixed(2)}%`);
  console.log(`20 - 40: ${((count.b20_40 / total) * 100).toFixed(2)}%`);
  console.log(`40 - 60: ${((count.b40_60 / total) * 100).toFixed(2)}%`);
  console.log(`> 60: ${((count.gt60 / total) * 100).toFixed(2)}%`);
}
