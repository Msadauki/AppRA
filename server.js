const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

const downloadRoutes = require('./Routes/download');
app.use('/', downloadRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AppRaR backend running on port ${PORT}`);
});
