# Cloud Workload Analysis and Intelligent Resource Recommendation

## Author

Franz Matugas

## Executive Summary

This project, inspired by Nutanix Prism, is a cloud workload analysis and resource recommendation system. It leverages **association rule mining**, **frequent pattern analysis**, and a **TF-IDF search engine** to provide intelligent insights into cloud job workloads.

By analyzing job tags and their associated resource requirements, the system recommends optimal resources and identifies patterns in job groupings. The dataset used in this project was scraped from a simplified sample of cloud job listings on **cloudsamplejobs.com**, providing real-world context while keeping the scope manageable for educational use.

---

## Technology Stack

- **Frontend:** React (with Next.js), TailwindCSS, ShadCN UI
- **Backend:** Node.js (Express.js)
- **Data Processing:** Python (pandas, scikit-learn, mlxtend, beautifulsoup)
- **Search Engine:** TF-IDF (scikit-learn)
- **Database:** JSON and CSV files
- **APIs:** RESTful APIs for data retrieval and processing

---

## Step-by-Step Setup

### Prerequisites

#### Python Environment

- Python 3 (accessible as `python3`)
- pip (Python package manager)
- virtual environment tool: `virtualenv` or `python3 -m venv`

#### Node.js

- Node.js v16+
- npm (comes with Node.js)

#### Git

- Ensure Git is installed to clone the repository

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <repo-directory>
```

### 2. Backend Setup

```bash
cd backend
npm install
python3 -m venv venv
source venv/bin/activate
node index.js
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

### 4. Launch the Application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

### Commands for Data Processing

### 1. Scrape Data

To scrape job data and populate the dataset:

```bash
python3 scraped_jobs.py
```

### 2. Mine Association Rules

To mine association rules from the dataset:

```bash
python3 association_tag_resource.py
```

### 3. Mine Frequent Itemsets

To identify frequent job groupings:

```bash
python3 frequent_groupings.py
```

Output files go into ./data.

---

## Python Environment Notes

### Virtual Environment

Always activate your virtual environment before running Python scripts:

```bash
source venv/bin/activate
```

### Dependencies

Make sure the following Python packages are installed:

- pandas
- scikit-learn
- mlxtend
- beautifulsoup4

If needed:

```bash
pip install pandas scikit-learn mlxtend beautifulsoup4
```

---

## Key Features

### 1. Association Rule Mining

- **What It Does:** Finds relationships between job tags (e.g., `ml`, `nlp`) and resource needs (e.g., `CPU`, `RAM`, `GPU`)
- **How It Works:**
  - Uses Apriori algorithm to generate rules like `ML + GPU → ram=32`
  - Includes support, confidence, and lift metrics
- **Benefit:** Helps users understand common resource needs for workloads

### 2. Resource Recommendations

- **What It Does:** Recommends resources based on mined rules
- **How It Works:**
  - Uses `confidence * lift` to rank recommendations
- **Benefit:** Reduces guesswork in resource provisioning

### 3. Frequent Job Groupings

- **What It Does:** Detects groups of jobs that often appear together
- **How It Works:**
  - Analyzes `sequence_id` and applies Apriori to find clusters
- **Benefit:** Reveals common task flows for workflow optimization

### 4. TF-IDF Search Engine

- **What It Does:** Finds relevant jobs based on user queries
- **How It Works:**
  - Combines job name, tags, and username into `search_text`
  - Applies TF-IDF vectorization + cosine similarity
- **Benefit:** Enhances accessibility of jobs through search

### 5. Cloud Job Insights

- **What It Does:** Surfaces high-level patterns in job data
- **How It Works:**
  - Tracks frequent tags, 3-job clusters, and average confidence per resource
- **Benefit:** Informs smarter workload planning

### 6. Interactive Dashboard

- **What It Does:** Offers a visual UI for users to explore data
- **How It Works:**
  - Built with Next.js, TailwindCSS, and ShadCN UI
  - Features sorting, filtering, search, and CSV export
- **Benefit:** Simplifies complex data into digestible insights

---

## Mining Association Rules

- **Data:** `jobs_dataset.csv` with fields like `job_id`, `tags`, `resources`, `status`
- **Process:**
  - Preprocess tags
  - Run Apriori
  - Generate rules with support, confidence, lift
- **Output:**
  - Rules such as `ML + GPU → ram=32`
  - Used for recommendation and insights

---

## Mining Frequent Itemsets

- **Data:** `sequence_id` groups from `jobs_dataset.csv`
- **Process:**
  - Each sequence lists job names
  - Apriori is applied
  - Filters by support and itemset size
- **Output Example:**
  ```json
  [
    {
      "itemsets": ["ML Training", "Data Preprocessing", "GPU"],
      "support": 0.12
    },
    { "itemsets": ["Database Backup", "Encryption"], "support": 0.08 }
  ]
  ```

---

## TF-IDF Search Engine Explained

- **Data:** Combines job name, tags, and user into `search_text`
- **Vectorization:**
  - TF-IDF used to convert to vectors
- **Query:**
  - User input is vectorized and compared via cosine similarity
- **Output Example:**
  ```json
  [
    {
      "job_id": "job_0022",
      "job_name": "ML Model Training",
      "tags": "ml,training,encryption",
      "score": 0.85
    },
    {
      "job_id": "job_0350",
      "job_name": "Data Analysis",
      "tags": "data,analysis,visualization",
      "score": 0.45
    }
  ]
  ```

---

## How This Helps Users

- **Optimized Resource Allocation:** Cuts waste by recommending smarter provisioning
- **Improved Job Scheduling:** Groups show natural workflows
- **Simplified Management:** Dashboard summarizes actionable insights
- **Enhanced Search:** Keyword-based discovery of relevant jobs

---

## Future Improvements

- **Database Integration:** Switch to PostgreSQL for scale
- **Real-Time Monitoring:** Live updates on resource use
- **Advanced Visuals:** Use D3.js or Chart.js for interactive graphs
- **Machine Learning:** Predictive models for new jobs
- **User Auth:** Login system with roles
- **API Expansion:** Add more endpoints for insights
- **Smarter Search:** Tag filters, fuzzy search, etc.

---

## Conclusion

This project showcases how association rule mining, frequent pattern analysis, and TF-IDF search can provide valuable insights into cloud workloads. By mimicking Nutanix Prism's intelligent workload visibility, it offers a simplified yet powerful tool for optimizing resource allocation and workload management.

With future improvements, this system could evolve into a robust cloud management platform.
