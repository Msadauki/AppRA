// functions/jsonUpdate.js
const admin = require('../firebase/firebaseConfig');

/**
 * Generate temporary download link for premium apps
 * @param {string} appId
 * @param {string} userId
 */
async function generatePremiumLink(appId, userId) {
    const ref = admin.database().ref(`premiumApps/${appId}/premiumDownloadId`);
    const snapshot = await ref.once('value');
    const driveId = snapshot.val();

    if (!driveId) throw new Error("Invalid App ID");

    // Optional: add timestamp-based token / expiration
    const token = Buffer.from(`${driveId}:${Date.now()}`).toString('base64');

    // Store token to verify later (optional)
    await admin.database().ref(`premiumLinks/${token}`).set({
        appId,
        userId,
        created: Date.now(),
        expires: Date.now() + 10 * 60 * 1000 // expires in 10 minutes
    });

    // Return obfuscated download link
    return `https://apprar.com/download?token=${token}`;
}

/**
 * Verify token before allowing download
 */
async function verifyPremiumLink(token) {
    const ref = admin.database().ref(`premiumLinks/${token}`);
    const snapshot = await ref.once('value');
    const data = snapshot.val();

    if (!data) return false;

    // Check expiration
    if (Date.now() > data.expires) {
        await ref.remove();
        return false;
    }

    // Optionally remove after first use
    await ref.remove();
    return true;
}

module.exports = { generatePremiumLink, verifyPremiumLink };