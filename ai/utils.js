// ai/utils.js
const fs = require('fs');
const path = require('path');
const githubAPI = require('../github/githubAPI');
const firebaseAdmin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase
try {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.applicationDefault(),
        databaseURL: "https://<YOUR-FIREBASE-PROJECT>.firebaseio.com"
    });
} catch (e) { console.log("Firebase already initialized"); }

async function fetchAllApps() {
    // Fetch free apps from GitHub
    const freeApps = await githubAPI.fetchFreeApps();
    // Fetch premium apps from Firebase
    const premiumRef = firebaseAdmin.database().ref('premiumApps');
    const premiumAppsSnap = await premiumRef.once('value');
    const premiumApps = premiumAppsSnap.val() || [];

    return [...freeApps, ...Object.values(premiumApps)];
}

async function updateAppData(apps) {
    // Split free & premium
    const freeApps = apps.filter(a => a.type === 'Free');
    const premiumApps = apps.filter(a => a.type === 'Premium');

    // Update GitHub free apps
    await githubAPI.updateFreeApps(freeApps);

    // Update Firebase premium apps
    const premiumRef = firebaseAdmin.database().ref('premiumApps');
    for (const app of premiumApps) {
        await premiumRef.child(app.appId).set(app);
    }
}

module.exports = { fetchAllApps, updateAppData };