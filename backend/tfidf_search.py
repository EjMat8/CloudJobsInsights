import pandas as pd
import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


df = pd.read_csv("data/jobs_dataset.csv")


df["search_text"] = df["job_name"].fillna("") + " " + df["tags"].fillna("") + " " + df["user"].fillna("")


vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(df["search_text"])


query = sys.argv[1] if len(sys.argv) > 1 else ""

   
def search_jobs(query, top_n=20):
    query_vec = vectorizer.transform([query])
    similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
    top_indices = similarities.argsort()[-top_n:][::-1]
    results = df.iloc[top_indices].copy()
    results["score"] = similarities[top_indices]
    return results[["job_id", "job_name", "tags", "score"]]

results = search_jobs(query)
print(json.dumps(results.to_dict(orient="records"), indent=2))