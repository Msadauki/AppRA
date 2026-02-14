// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const premiumRouter = require('./Routes/premiumDownload');

// Free download route
app.get('/download', (req, res) => {
  const userType = req.query.userType;

  if (userType === 'free') {
    return res.json({
      downloadUrl: "https://example.com/free-app.apk"
    });
  }

  if (userType === 'premium') {
    return res.status(400).json({
      error: "Use /download/premium for premium downloads"
    });
  }

  return res.status(400).json({
    error: "Invalid user type"
  });
});

// Premium download route
app.use('/download/premium', premiumRouter);

// Optional root endpoint
app.get('/', (req, res) => {
  res.send("🎉 AppRaR backend is running. Use /download for free or /download/premium for premium apps.");
});

// Start server
app.listen(PORT, () => {
  console.log(`⚡ AppRaR backend running on port ${PORT}`);
});
