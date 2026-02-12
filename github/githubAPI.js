// github/githubAPI.js
const axios = require('axios');
require('dotenv').config();

const REPO_OWNER = "your-github-username";
const REPO_NAME = "AppRaR-FreeApps";
const FILE_PATH = "free-apps.json";
const TOKEN = process.env.GITHUB_TOKEN;

async function fetchFreeApps() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const res = await axios.get(url, {
        headers: { Authorization: `token ${TOKEN}` }
    });
    const content = Buffer.from(res.data.content, 'base64').toString('utf-8');
    return JSON.parse(content);
}

async function updateFreeApps(apps) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    // First, get current SHA
    const res = await axios.get(url, { headers: { Authorization: `token ${TOKEN}` } });
    const sha = res.data.sha;

    const updatedContent = Buffer.from(JSON.stringify(apps, null, 2)).toString('base64');
    await axios.put(url, {
        message: "AI updated free apps",
        content: updatedContent,
        sha: sha
    }, { headers: { Authorization: `token ${TOKEN}` } });
}

module.exports = { fetchFreeApps, updateFreeApps };