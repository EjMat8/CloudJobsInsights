import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder

df = pd.read_csv("data/jobs_dataset.csv")


transactions = []
df = df[df["status"] == "completed"]
for _, row in df.iterrows():
    items = set()
    tags = row["tags"].split(",")
    items.update(tags)
    items.add(f"cpu={row['cpu']}")
    items.add(f"ram={row['ram']}")
    items.add(f"gpu={row['gpu']}")
    transactions.append(items)

print(f"{len(transactions)} completed jobs found.")



te = TransactionEncoder()
te_ary = te.fit(transactions).transform(transactions)
df_trans = pd.DataFrame(te_ary, columns=te.columns_)

frequent_itemsets = apriori(df_trans, min_support=0.01, use_colnames=True)

rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.1)

def is_resource(item):
    return item.startswith("cpu=") or item.startswith("ram=") or item.startswith("gpu=")

filtered_rules = rules[
    rules["consequents"].apply(lambda x: all(is_resource(i) for i in x)) &
    rules["antecedents"].apply(lambda x: all(not is_resource(i) for i in x))
]
result = filtered_rules[["antecedents", "consequents", "support", "confidence", "lift"]]
result = result[
    (result["lift"] > 1) &
    (result["confidence"] >= 0.1) &
    (result["support"] >= 0.01) &
    (result["antecedents"].apply(lambda x: 2 <= len(x) <= 3))
]

top_rules = result.sort_values(by=["confidence", "support"], ascending=False)


display_rules = top_rules[["antecedents", "consequents", "support", "confidence", "lift"]]

display_rules.to_json("data/association_rules.json", orient="records", indent=2)

print("Created association rules file.")

