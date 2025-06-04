import pandas as pd
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json
url = "https://cloudsamplejobs.com/"
response = requests.get(url)
html = response.text
soup = BeautifulSoup(html, 'html.parser')

job_rows = soup.select("tr.job-row")

jobs = []

for row in job_rows:
    job_id = row.get("data-job-id")
    tds = row.find_all("td")
    user = tds[1].text.strip()
    job_name = tds[2].text.strip()
    tags = [tag.text.strip() for tag in row.select(".job-tag")]
    status = row.select_one("[data-status]").get("data-status")
    cpu = row.select_one('[data-resource="cpu"]').text.replace("CPU:", "").replace("cores", "").strip()
    ram = row.select_one('[data-resource="ram"]').text.replace("RAM:", "").replace("GB", "").strip()
    gpu = row.select_one('[data-resource="gpu"]').text.replace("GPU:", "").strip()
    duration = tds[6].text.replace("min", "").strip()
    outer_div = tds[7].find("div", class_="text-sm")
    if outer_div:
        date_div = outer_div.find_all("div")[0].get_text(strip=True)
    else:
        date_div = ""
    try:
        submitted = datetime.strptime(date_div, "%m/%d/%Y").strftime("%Y-%m-%d")
    except ValueError:
        submitted = date_div
    sequence_id = tds[8].get("data-sequence-id")

    jobs.append({
        "job_id": job_id,
        "user": user,
        "job_name": job_name,
        "tags": tags,
        "status": status,
        "resources": {
            "cpu": cpu,
            "ram": ram,
            "gpu": gpu
        },
        "duration": duration,
        "submitted": submitted,
        "sequence_id": sequence_id
    })


with open("data/scraped_jobs.json", "w") as f:
    json.dump(jobs, f, indent=2)

print(f"Scraped {len(jobs)} jobs.")

with open("data/scraped_jobs.json", "r") as f:
    jobs = json.load(f)

for job in jobs:
    job["cpu"] = job["resources"]["cpu"]
    job["ram"] = job["resources"]["ram"]
    job["gpu"] = job["resources"]["gpu"]
    job["tags"] = ",".join(job["tags"])
    del job["resources"]


df = pd.DataFrame(jobs)

df.to_csv("data/jobs_dataset.csv", index=False)
print("CSV saved as 'jobs_dataset.csv'")