import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori

df = pd.read_csv("data/jobs_dataset.csv")

sequences = df.groupby("sequence_id")["job_name"].apply(list).tolist()

te = TransactionEncoder()
te_ary = te.fit(sequences).transform(sequences)
df_trans = pd.DataFrame(te_ary, columns=te.columns_)


frequent_itemsets = apriori(df_trans, min_support=0.05, use_colnames=True)

frequent_itemsets["length"] = frequent_itemsets["itemsets"].apply(lambda x: len(x))
filtered_itemsets = frequent_itemsets[frequent_itemsets["length"] > 1]

filtered_itemsets = filtered_itemsets.sort_values(by="support", ascending=False)
filtered_itemsets["itemsets"] = filtered_itemsets["itemsets"].apply(lambda x: list(x))


filtered_itemsets.to_json("data/frequent_groupings.json", orient="records", indent=2)
print("Exported to frequent_groupings.json")