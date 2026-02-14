const express = require('express');
const router = express.Router();
const { handlePremiumDownload } = require('../firebase/premiumDB'); // your premium DB logic

// Premium download endpoint
router.get('/download/premium', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).send("Missing download token.");
    }

    try {
        const link = await handlePremiumDownload(token);

        if (!link) {
            return res.status(403).send("Invalid or expired download link.");
        }

        // Redirect user to the secure download link
        res.redirect(link);

    } catch (err) {
        console.error("Error handling premium download:", err);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;
