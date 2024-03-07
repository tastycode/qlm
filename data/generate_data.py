from datasets import load_dataset
import json
import pandas as pd
import random

CATEGORY_SAMPLE = 5
PROMPT_SAMPLE = 21


def pretty_json(ugly_json):
    parsed = json.loads(ugly_json)
    return json.dumps(parsed, indent=4)


harmful_qa = load_dataset("declare-lab/HarmfulQA")
dangerous_qa = load_dataset("declare-lab/CategoricalHarmfulQA")


all_subtopics = set(harmful_qa["train"]["subtopic"])
all_categories = set(dangerous_qa["en"]["Category"])

target_subtopics = random.sample(list(all_subtopics), CATEGORY_SAMPLE)
target_categories = random.sample(list(all_categories), CATEGORY_SAMPLE)

sample_harmful = (
    harmful_qa["train"]
    .filter(lambda example: example["subtopic"] in target_subtopics)
    .to_pandas()
    .sample(PROMPT_SAMPLE)
)
sample_dangerous = (
    dangerous_qa["en"]
    .filter(lambda example: example["Category"] in target_categories)
    .to_pandas()
    .sample(PROMPT_SAMPLE)
)


with open("harmful.json", "w") as harmful_pretty:
    harmful_pretty.write(pretty_json(sample_harmful.to_json(orient="records")))
with open("dangerous.json", "w") as dangerous_pretty:
    dangerous_pretty.write(pretty_json(sample_dangerous.to_json(orient="records")))
