// ai/badge.js
function assignBadges(apps) {
    apps.forEach(app => {
        if (app.engagementScore >= 0.9) app.badge = "🔥";      // Hot
        else if (app.engagementScore >= 0.7) app.badge = "📈"; // Trending
        else if (app.isNew) app.badge = "🆕";                  // New
        else app.badge = "";                                   // No badge
    });
}

module.exports = { assignBadges };