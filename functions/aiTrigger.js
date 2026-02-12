// functions/aiTrigger.js
const ai = require('../ai/ai');

// Example: run AI every X minutes or via HTTP trigger
async function triggerAI() {
    console.log("Triggering AI...");
    await ai.runAI();
}

triggerAI(); // Call on demand; can integrate with cron / Firebase function