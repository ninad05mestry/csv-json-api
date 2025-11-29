import express from "express";
import { processCSVStream } from "./controllers/csvController_stream.js";

const app = express();

// API endpoint
app.get("/process", processCSVStream);

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

import { pool } from "./db/index.js";

app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  const rows = result.rows;

  let tableRows = rows
    .map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.age}</td>
        <td>${JSON.stringify(r.address)}</td>
        <td>${JSON.stringify(r.additional_info)}</td>
      </tr>
    `)
    .join("");

  res.send(`
    <html>
      <head>
        <title>Users Data</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid gray; padding: 8px; text-align: left; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>
        <h2> Uploaded Users Data</h2>
        <table>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Address</th>
            <th>Additional Info</th>
          </tr>
          ${tableRows}
        </table>
        <a href="/process"> Reprocess CSV</a>
      </body>
    </html>
  `);
});
