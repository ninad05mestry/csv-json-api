import express from "express";
import { processCSVStream } from "./controllers/csvController_stream.js";

const app = express();

// API endpoint
app.get("/process", processCSVStream);

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
