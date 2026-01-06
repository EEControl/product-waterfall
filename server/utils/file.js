const fs = require("fs");
const path = require("path");

const downloadCountFile = path.join(__dirname, "../download_counts.json");

// Read download counts
function readCounts() {
  if (!fs.existsSync(downloadCountFile)) return {};
  return JSON.parse(fs.readFileSync(downloadCountFile, "utf8"));
}

// Write download counts
function writeCounts(data) {
  fs.writeFileSync(downloadCountFile, JSON.stringify(data, null, 2));
}

// Read JSONL data
function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, "utf8")
           .split("\n")
           .filter(Boolean)
           .map(line => JSON.parse(line));
}

module.exports = {
  readCounts,
  writeCounts,
  readJsonl
};
