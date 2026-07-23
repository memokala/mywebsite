/**
 * Google Instant Indexing Script for myworldpdf.com
 * 
 * This script reads your sitemap, extracts all URLs, and pushes them directly
 * to the Google Indexing API to get them crawled and indexed in under 2 hours.
 * 
 * Prerequisites:
 * 1. Install dependencies: npm install googleapis axios xml2js
 * 2. Place your Google Service Account JSON key as "service_account.json" in the same directory.
 * 3. Add the service account email as an Owner in Google Search Console for https://www.myworldpdf.com.
 * 4. Run the script: node google_indexer.js
 */

const { google } = require("googleapis");
const axios = require("axios");
const xml2js = require("xml2js");
const fs = require("fs");
const path = require("path");

const SITEMAP_URL = "https://www.myworldpdf.com/sitemap.xml";
const KEY_FILE = path.join(__dirname, "service_account.json");

// Check if Service Account file exists
if (!fs.existsSync(KEY_FILE)) {
  console.error("❌ Error: 'service_account.json' not found.");
  console.log("Please create a Service Account in Google Cloud, enable Indexing API, download the JSON key, rename it to 'service_account.json' and place it here.");
  process.exit(1);
}

// Initialize Google Auth Client
const jwtClient = new google.auth.JWT(
  null,
  KEY_FILE,
  null,
  ["https://www.googleapis.com/auth/indexing"],
  null
);

async function getSitemapUrls() {
  console.log(`📡 Fetching sitemap from: ${SITEMAP_URL}...`);
  try {
    const response = await axios.get(SITEMAP_URL);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);
    
    // Extract loc tags from urlset
    const urls = result.urlset.url.map(entry => entry.loc[0]);
    console.log(`✅ Extracted ${urls.length} URLs from sitemap.`);
    return urls;
  } catch (error) {
    console.error("❌ Failed to parse sitemap:", error.message);
    process.exit(1);
  }
}

async function requestIndexing(url, token) {
  try {
    const response = await axios.post(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        url: url,
        type: "URL_UPDATED"
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(`🚀 Indexing requested successfully for: ${url}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to request indexing for ${url}:`, error.response ? error.response.data : error.message);
    return false;
  }
}

async function run() {
  // Get Access Token
  console.log("🔑 Authenticating with Google...");
  let credentials;
  try {
    credentials = await jwtClient.authorize();
    console.log("✅ Authenticated successfully.");
  } catch (error) {
    console.error("❌ Google Authentication failed:", error.message);
    process.exit(1);
  }

  const urls = await getSitemapUrls();
  const token = credentials.access_token;

  console.log(`\n⏳ Pushing URLs to Google Indexing API...`);
  
  // Google Indexing API has a default limit of 200 requests per day
  const limit = Math.min(urls.length, 200);
  
  for (let i = 0; i < limit; i++) {
    const url = urls[i];
    await requestIndexing(url, token);
    // Anti-rate-limiting delay (500ms)
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("\n🎯 Finished! Googlebot has been notified to crawl your pages immediately.");
}

run();
