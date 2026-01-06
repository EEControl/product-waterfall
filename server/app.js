require('dotenv').config();
const express = require('express');
const path = require('path');

const productRoutes = require('./routes/products');
const downloadRoutes = require('./routes/download');
const proxyRoutes = require('./routes/proxy');

const app = express();
const PORT = process.env.PORT || 66;

app.use(express.static(path.join(__dirname, '../public')));
app.get("/favicon.ico", (req, res) => res.status(204));

app.use('/api', productRoutes);
app.use('/', downloadRoutes);
app.use('/', proxyRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
