const express = require('express');
const router = express.Router();

const { firebaseEnabled } = require('../firebase/firebaseConfig');

// FREE + PREMIUM ROUTE
router.get('/download', async (req, res) => {
  const userType = req.query.userType;

  // FREE USERS
  if (userType === 'free') {
    return res.json({
      downloadUrl: "https://example.com/free-app.apk"
    });
  }

  // PREMIUM USERS
  if (userType === 'premium') {

    if (!firebaseEnabled) {
      return res.status(503).json({
        error: "Premium service temporarily unavailable"
      });
    }

    return res.json({
      downloadUrl: "https://example.com/premium-app.apk"
    });
  }

  return res.status(400).json({
    error: "Invalid user type"
  });
});

module.exports = router;
