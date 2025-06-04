const path = require("path");
const { exec } = require("child_process");

const scrapeScriptPath = path.join(__dirname, "scraped_jobs.py");

exec(`python3 ${scrapeScriptPath}`, (err, stdout, stderr) => {
  if (err) {
    console.error("❌ Scraping failed on startup:", stderr);
  } else {
    console.log("✅ Scraping done on server startup.");
    console.log(stdout);
  }
});
