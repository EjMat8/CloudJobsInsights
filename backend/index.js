const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { exec, spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/rules", (req, res) => {
  const rules = fs.readFileSync("./data/association_rules.json", "utf8");
  res.json(JSON.parse(rules));
});

app.get("/api/groupings", (req, res) => {
  const groups = fs.readFileSync("./data/frequent_groupings.json", "utf8");
  res.json(JSON.parse(groups));
});
app.get("/api/jobs", (req, res) => {
  try {
    const jobs = fs.readFileSync("./data/scraped_jobs.json", "utf8");
    res.json(JSON.parse(jobs));
  } catch (error) {
    console.error("Error reading scraped_jobs.json:", error);
    res.status(500).json({ error: "Failed to retrieve jobs" });
  }
});

app.post("/api/jobs", (req, res) => {
  try {
    const jobsData = fs.readFileSync("./data/scraped_jobs.json", "utf8");
    const jobs = JSON.parse(jobsData);

    const newJob = req.body;

    const updatedJobs = [newJob, ...jobs];
    fs.writeFileSync(
      "./data/scraped_jobs.json",
      JSON.stringify(updatedJobs, null, 2)
    );

    const csvLine = `${newJob.job_id},${newJob.job_name},"${newJob.tags}",${newJob.user},${newJob.status},${newJob.resources.cpu},${newJob.resources.ram},${newJob.resources.gpu},${newJob.duration},${newJob.submitted},${newJob.sequence_id}\n`;
    fs.appendFileSync("./data/jobs_dataset.csv", csvLine);

    res.status(201).json(updatedJobs);
  } catch (error) {
    console.error("Error updating jobs:", error);
    res.status(500).json({ error: "Failed to add the job" });
  }
});

app.post("/api/search", (req, res) => {
  const query = req.body.query.trim();
  if (!query) return res.json([]);
  const python = spawn("python3", ["tfidf_search.py", query]);

  let result = "";

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error("TF-IDF error:", data.toString());
  });

  python.on("close", (code) => {
    try {
      const parsed = JSON.parse(result);
      console.log(parsed);
      res.json(parsed);
    } catch (e) {
      console.error("Failed to parse:", e);
      res.status(500).json({ error: "Parsing error" });
    }
  });
});
// recompute currently needs to be fixed
app.post("/api/recompute", (req, res) => {
  try {
    exec("python3 association_tag_resource.py", (error, stdout, stderr) => {
      if (error) {
        console.error("Error in association_tag_resource.py:", error);
        return res
          .status(500)
          .json({ error: "Failed to run association_tag_resource.py" });
      }
      if (stderr) {
        console.error("Association Rules Script stderr:", stderr);
      }
      console.log("Association Rules Script stdout:", stdout);

      exec("python3 frequent_groupings.py", (error, stdout, stderr) => {
        if (error) {
          console.error("Error in frequent_groupings.py:", error);
          return res
            .status(500)
            .json({ error: "Failed to run frequent_groupings.py" });
        }
        if (stderr) {
          console.error("Frequent Groupings Script stderr:", stderr);
        }
        console.log("Frequent Groupings Script stdout:", stdout);

        res.status(200).json({ message: "Recomputed successfully!" });
      });
    });
  } catch (error) {
    console.error("Error running scripts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
