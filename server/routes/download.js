const express = require("express");
const { readCounts, writeCounts, readJsonl } = require("../utils/file");
const { createProductZip } = require("../utils/zip");
const path = require("path");

const router = express.Router();

const DATA_DIRS = {
  alibaba: process.env.ALIBABA_DATA_PATH,
  "1688": process.env.DATA_1688_PATH
};

function getDataDir(source) {
  return DATA_DIRS[source] || DATA_DIRS["alibaba"];
}

// Download ZIP
router.get("/download-zip", async (req, res) => {
  const { date, id: offerId, source = "alibaba" } = req.query;
  if (!date || !offerId) return res.status(400).send("Missing parameters");

  const filePath = path.join(getDataDir(source), `${date}.jsonl`);
  if (!require('fs').existsSync(filePath)) return res.status(404).send("File not found");

  const products = readJsonl(filePath);
  const product = products.find(p => p.offerId === offerId);
  if (!product) return res.status(404).send("Product not found");

  // Increment count
  const counts = readCounts();
  const key = `${source}_${offerId}`;
  counts[key] = (counts[key] || 0) + 1;
  writeCounts(counts);

  try {
    await createProductZip(product, res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create ZIP");
  }
});

// Download count
router.get("/api/download-count", (req, res) => {
  const { source, id } = req.query;
  const counts = readCounts();
  const key = `${source}_${id}`;
  res.json({ count: counts[key] || 0 });
});

module.exports = router;
