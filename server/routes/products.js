const express = require("express");
const path = require("path");
const { readJsonl } = require("../utils/file");

const router = express.Router();

const DATA_DIRS = {
  alibaba: process.env.ALIBABA_DATA_PATH || path.join(__dirname, "../data_alibaba"),
  "1688": process.env.DATA_1688_PATH || path.join(__dirname, "../data_1688")
};

// Helper
function getDataDir(source) {
  return DATA_DIRS[source] || DATA_DIRS["alibaba"];
}

// Get product list
router.get("/products", (req, res) => {
  const { date, source = "alibaba" } = req.query;
  if (!date) return res.status(400).json({ error: "Parameter 'date' required" });

  const filePath = path.join(getDataDir(source), `${date}.jsonl`);
  if (!require('fs').existsSync(filePath)) return res.status(404).json({ error: "File not found" });

  try {
    const products = readJsonl(filePath);
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read file" });
  }
});

// Get available dates
router.get("/dates", (req, res) => {
  const source = req.query.source || "alibaba";
  const dir = getDataDir(source);
  const maxCount = parseInt(process.env.MAX_DATE_COUNT || 50, 10);

  try {
    const files = require("fs").readdirSync(dir)
      .filter(f => f.endsWith(".jsonl"))
      .map(f => f.replace(".jsonl", ""))
      .sort((a,b)=>b.localeCompare(a))
      .slice(0, maxCount);
    res.json({ success: true, dates: files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read dates" });
  }
});

module.exports = router;
