// firebase/premiumDB.js
const admin = require('./firebaseConfig');
const crypto = require('crypto');
const aiEngagement = require('../ai/aiEngagement');
const { fetchTransactions, confirmTransaction } = require('../payments/transactions');

// Environment variables you must set:
// process.env.PREMIUM_TOKEN_SECRET
// process.env.BACKEND_URL

/**
 * Generate a short-lived token for secure premium download
 * @param {string} appId 
 * @param {string} userId 
 * @param {number} expiresIn milliseconds, default 5 min
 * @returns {string} token
 */
function generateDownloadToken(appId, userId, expiresIn = 5 * 60 * 1000) {
    const payload = `${appId}|${userId}|${Date.now() + expiresIn}`;
    const token = crypto.createHmac('sha256', process.env.PREMIUM_TOKEN_SECRET)
                        .update(payload)
                        .digest('hex');
    return `${token}.${Buffer.from(payload).toString('base64')}`;
}

/**
 * Verify a download token
 * @param {string} token 
 * @returns {object|null} {appId, userId} if valid, null if invalid/expired
 */
function verifyDownloadToken(token) {
    try {
        const [hash, payloadBase64] = token.split('.');
        const payload = Buffer.from(payloadBase64, 'base64').toString('utf-8');
        const [appId, userId, expiresAt] = payload.split('|');
        const expectedHash = crypto.createHmac('sha256', process.env.PREMIUM_TOKEN_SECRET)
                                   .update(payload)
                                   .digest('hex');

        if (hash !== expectedHash) return null;
        if (Date.now() > parseInt(expiresAt)) return null;
        return { appId, userId };
    } catch (err) {
        console.error("Token verification failed:", err);
        return null;
    }
}

/**
 * Get premium app metadata from Firebase
 * @param {string} appId 
 */
async function getPremiumApp(appId) {
    try {
        const ref = admin.database().ref(`premiumApps/${appId}`);
        const snapshot = await ref.once('value');
        return snapshot.val();
    } catch (err) {
        console.error("Error fetching premium app:", err);
        return null;
    }
}

/**
 * Create or update premium app metadata
 * @param {string} appId 
 * @param {object} appData 
 */
async function setPremiumApp(appId, appData) {
    try {
        const ref = admin.database().ref(`premiumApps/${appId}`);
        await ref.set(appData);
        console.log(`Premium app ${appId} saved/updated.`);
    } catch (err) {
        console.error("Error setting premium app:", err);
    }
}

/**
 * Generate a temporary secure download link for client
 * @param {string} appId 
 * @param {string} userId 
 * @returns {string|null} temporary link
 */
async function getPremiumDownloadLink(appId, userId) {
    try {
        const appData = await getPremiumApp(appId);
        if (!appData || !appData.price) return null;

        // Optional: check if user paid for this app
        const transactions = await fetchTransactions();
        const userPaid = Object.values(transactions).some(t =>
            t.userId === userId && t.appId === appId && t.status === 'success'
        );
        if (!userPaid) return null; // user cannot download without payment

        // Generate short-lived token
        const token = generateDownloadToken(appId, userId);

        // Link to backend download endpoint
        return `${process.env.BACKEND_URL}/download/premium?token=${token}`;
    } catch (err) {
        console.error("Error generating premium download link:", err);
        return null;
    }
}

/**
 * Handle actual download request
 * This should be used in your Express route
 * @param {string} token 
 * @returns {string|null} Google Drive link if valid, null if invalid
 */
async function handlePremiumDownload(token) {
    const verified = verifyDownloadToken(token);
    if (!verified) return null;

    const { appId, userId } = verified;
    const appData = await getPremiumApp(appId);
    if (!appData || !appData.premiumDownloadId) return null;

    // Update AI engagement (downloads, badges, trending)
    await aiEngagement.recordDownload(appId);

    // Return Google Drive direct link (hidden from client)
    return `https://drive.google.com/uc?export=download&id=${appData.premiumDownloadId}`;
}

module.exports = {
    getPremiumApp,
    setPremiumApp,
    getPremiumDownloadLink,
    verifyDownloadToken,
    handlePremiumDownload
};