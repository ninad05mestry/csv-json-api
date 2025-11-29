import config from "../config/env.js";
import fs from "fs";

export function processCSV(req, res) {
  const csvPath = config.csvPath;

  if (!fs.existsSync(csvPath)) {
    return res.status(400).json({ error: "CSV file not found at path: " + csvPath });
  }

  // Now you can read/stream it
  const content = fs.readFileSync(csvPath, "utf8");

  res.send("File loaded successfully");
}
