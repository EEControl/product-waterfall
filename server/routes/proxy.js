const express = require("express");
const axios = require("axios");
const path = require("path");

const router = express.Router();

router.get("/image-proxy", async (req, res) => {
  const imgUrl = req.query.url;
  if (!imgUrl) return res.status(400).send("Missing url");

  try {
    const r = await axios.get(imgUrl, { responseType: "arraybuffer" });
    const ext = path.extname(imgUrl).split("?")[0] || ".jpg";
    res.setHeader("Content-Type", "image/" + ext.replace(".", ""));
    res.send(r.data);
  } catch (err) {
    res.status(500).send("Failed to fetch image");
  }
});

module.exports = router;
