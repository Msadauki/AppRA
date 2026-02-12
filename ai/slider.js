// ai/slider.js
function updateBanners(apps) {
    apps.forEach(app => {
        if (app.banners && app.banners.length > 0) {
            // Pick first banner for AI
            app.currentBanner = app.banners[0];
        }
    });
}

module.exports = { updateBanners };