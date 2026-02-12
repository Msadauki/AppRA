// ai/sorting.js
function sortApps(apps) {
    // Sort by engagementScore descending
    apps.sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0));

    // Separate slider apps (top 5 for slider)
    const sliderApps = apps.slice(0, 5);
    apps.sliderApps = sliderApps;
}

module.exports = { sortApps };