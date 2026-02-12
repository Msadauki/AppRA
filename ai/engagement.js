// ai/engagement.js
function calculateScores(apps) {
    apps.forEach(app => {
        // Example formula for engagementScore
        const downloadsWeight = 0.5;
        const ratingWeight = 0.3;
        const clicksWeight = 0.2;

        app.engagementScore = 
            (app.downloads || 0) * downloadsWeight +
            (app.rating || 0) * ratingWeight +
            (app.clicks || 0) * clicksWeight;

        // Normalize to 0-1
        app.engagementScore = Math.min(1, app.engagementScore / 100);
    });
}

module.exports = { calculateScores };