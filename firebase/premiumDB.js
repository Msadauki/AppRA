// firebase/premiumDB.js
const { admin, firebaseEnabled } = require('./firebaseConfig');
const crypto = require('crypto');

let aiEngagement = null;
let payments = null;

// Optional modules
try { aiEngagement = require('../ai/aiEngagement'); } catch(e) { console.warn("⚠ aiEngagement not found"); }
try { payments = require('../payments/transactions'); } catch(e) { console.warn("⚠ payments module not found"); }

// Environment variable needed for token generation
const PREMIUM_TOKEN_SECRET = process.env.PREMIUM_TOKEN_SECRET || 'default_secret';

/** Generate short-lived token */
function generateDownloadToken(appId, userId, expiresIn = 5*60*1000) {
    const payload = `${appId}|${userId}|${Date.now() + expiresIn}`;
    const hash = crypto.createHmac('sha256', PREMIUM_TOKEN_SECRET).update(payload).digest('hex');
    return `${hash}.${Buffer.from(payload).toString('base64')}`;
}

/** Verify token */
function verifyDownloadToken(token) {
    try {
        const [hash, payloadBase64] = token.split('.');
        const payload = Buffer.from(payloadBase64, 'base64').toString('utf8');
        const [appId, userId, expiresAt] = payload.split('|');

        const expectedHash = crypto.createHmac('sha256', PREMIUM_TOKEN_SECRET).update(payload).digest('hex');
        if (hash !== expectedHash) return null;
        if (Date.now() > parseInt(expiresAt)) return null;
        return { appId, userId };
    } catch {
        return null;
    }
}

/** Get premium app metadata */
async function getPremiumApp(appId) {
    if (!firebaseEnabled) return null;
    try {
        const snapshot = await admin.database().ref(`premiumApps/${appId}`).once('value');
        return snapshot.val();
    } catch (err) {
        console.error("Error fetching premium app:", err);
        return null;
    }
}

/** Generate secure download link for premium */
async function getPremiumDownloadLink(appId, userId) {
    const appData = await getPremiumApp(appId);
    if (!appData || !appData.price) return null;

    let userPaid = true;
    if (payments) {
        const transactions = await payments.fetchTransactions();
        userPaid = Object.values(transactions).some(t =>
            t.userId === userId && t.appId === appId && t.status === 'success'
        );
    }

    if (!userPaid) return null;
    const token = generateDownloadToken(appId, userId);
    return `${process.env.BACKEND_URL}/download/premium?token=${token}`;
}

/** Handle premium download request */
async function handlePremiumDownload(token) {
    const verified = verifyDownloadToken(token);
    if (!verified) return null;

    const { appId } = verified;
    const appData = await getPremiumApp(appId);
    if (!appData || !appData.premiumDownloadId) return null;

    if (aiEngagement) await aiEngagement.recordDownload(appId);

    return `https://drive.google.com/uc?export=download&id=${appData.premiumDownloadId}`;
}

module.exports = {
    generateDownloadToken,
    verifyDownloadToken,
    getPremiumApp,
    getPremiumDownloadLink,
    handlePremiumDownload
};
