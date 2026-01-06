const archiver = require("archiver");
const axios = require("axios");

async function createProductZip(product, res) {
  res.writeHead(200, {
    "Content-Type": "application/zip",
    "Content-Disposition": `attachment; filename=${product.offerId}.zip`
  });

  const archive = archiver("zip");
  archive.pipe(res);

  if (product.video_url) {
    const videoResp = await axios.get(product.video_url, { responseType: "arraybuffer" });
    archive.append(videoResp.data, { name: `videos/${product.offerId}.mp4` });
  }

  if (product.images) {
    for (let i = 0; i < product.images.length; i++) {
      const imgUrl = product.images[i];
      const ext = imgUrl.split('.').pop().split('?')[0] || "jpg";
      const imgResp = await axios.get(imgUrl, { responseType: "arraybuffer" });
      archive.append(imgResp.data, { name: `images/${product.offerId}_${i + 1}.${ext}` });
    }
  }

  await archive.finalize();
}

module.exports = { createProductZip };
