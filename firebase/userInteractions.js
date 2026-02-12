// firebase/userInteractions.js
const admin = require('./firebaseConfig');

/**
 * Log user interaction: download, click, rate
 * @param {string} userId
 * @param {string} appId
 * @param {string} action - "download" | "click" | "rate"
 * @param {number} rating - optional if action is "rate"
 */
async function logInteraction(userId, appId, action, rating = null) {
    try {
        const ref = admin.database().ref(`userInteractions/${userId}`);
        const newInteraction = {
            appId,
            action,
            rating: rating || null,
            timestamp: new Date().toISOString()
        };
        await ref.push(newInteraction);
        console.log(`Logged ${action} for ${appId} by ${userId}`);
    } catch (error) {
        console.error("Error logging user interaction:", error);
    }
}

/**
 * Fetch all interactions (for AI calculations)
 */
async function fetchAllInteractions() {
    const ref = admin.database().ref('userInteractions');
    const snapshot = await ref.once('value');
    return snapshot.val() || {};
}

module.exports = { logInteraction, fetchAllInteractions };