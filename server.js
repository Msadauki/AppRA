const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Homepage
app.get('/', (req, res) => {
  res.send('Welcome to AppRaR backend! Use /download for free app.');
});

// Free download route
const freeDownloadRoute = require('./Routes/download');
app.use('/', freeDownloadRoute);

// Premium route (safe)
try {
  const premiumRoute = require('./Routes/premiumDownload');
  app.use('/', premiumRoute);
} catch (err) {
  console.warn('⚠ Premium route not loaded — continuing without it');
}

app.listen(PORT, () => {
  console.log(`AppRaR backend running on port ${PORT}`);
});
