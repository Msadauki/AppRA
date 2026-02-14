const express = require('express');
const app = express();
require('dotenv').config();

// Free download route
const freeDownload = require('./Routes/download');

// Premium download route
const premiumDownload = require('./Routes/premiumDownload');

app.use('/', freeDownload);
app.use('/', premiumDownload);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AppRaR backend running on port ${PORT}`));
