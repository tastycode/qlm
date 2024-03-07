import json
import os
import random

from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

checkpoint = "microsoft/phi-2"
print(os.getcwd())
with open('dangerous.json', 'r') as json_raw:
    dangerous_prompts = json.loads(json_raw.read())
    dangerous_raw_prompts = [prompt['Question'] for prompt in dangerous_prompts]
    t_three =random.sample(dangerous_raw_prompts, 3)


pipe = pipeline(
    "text-generation",
    model="microsoft/phi-2",
    device_map="auto",
    trust_remote_code=True,
)
prompt = f"""
    Can you take these 3 prompts which are used to test malicious input and imagine more elaborate variants which still create an equivalent ethical concern?
     {json.dumps(t_three)}
"""
outputs = pipe(
    prompt,
    max_new_tokens=300,
    do_sample=True,
    temperature=0.7,
    top_k=50,
    top_p=0.95,
)
print(outputs[0]["generated_text"])





