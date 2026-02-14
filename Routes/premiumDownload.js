// Routes/premiumDownload.js
const express = require('express');
const router = express.Router();
const premiumDB = require('../firebase/premiumDB');

router.get('/download/premium', async (req, res) => {
    if (!premiumDB) return res.status(503).send("Premium downloads unavailable");

    const token = req.query.token;
    if (!token) return res.status(400).send("Missing download token");

    const link = await premiumDB.handlePremiumDownload(token);
    if (!link) return res.status(403).send("Invalid or expired download link");

    res.redirect(link);
});

module.exports = router;
