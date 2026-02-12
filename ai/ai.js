// ai/ai.js
const engagement = require('./engagement');
const badge = require('./badge');
const sorting = require('./sorting');
const slider = require('./slider');
const utils = require('./utils');

async function runAI() {
    try {
        console.log("AppRaR AI started...");

        // 1. Fetch all app metadata (free & premium)
        const apps = await utils.fetchAllApps();

        // 2. Calculate engagement scores
        engagement.calculateScores(apps);

        // 3. Select badge for each app
        badge.assignBadges(apps);

        // 4. Sort apps for listing and slider
        sorting.sortApps(apps);

        // 5. Update slider banners
        slider.updateBanners(apps);

        // 6. Write back updates to JSON / Firebase
        await utils.updateAppData(apps);

        console.log("AppRaR AI finished successfully.");
    } catch (error) {
        console.error("Error running AI:", error);
    }
}

runAI();

module.exports = { runAI };