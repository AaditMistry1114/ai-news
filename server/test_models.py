import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()
api_key = os.getenv('HF_API_KEY')
client = InferenceClient(token=api_key)

models = [
    'meta-llama/Llama-3.2-3B-Instruct',
    'Qwen/Qwen2.5-7B-Instruct',
    'microsoft/Phi-3-mini-4k-instruct',
    'mistralai/Mistral-7B-Instruct-v0.3',
    'google/gemma-1.1-2b-it'
]

context = 'Artificial intelligence is rapidly evolving. It is impacting every industry from healthcare to finance.'
question = 'What industries are impacted by AI?'

messages = [
    {'role': 'system', 'content': 'Answer the question based on context.'},
    {'role': 'user', 'content': f'Context: {context}\nQuestion: {question}'}
]

for m in models:
    print(f"Testing {m}...")
    try:
        response = client.chat_completion(messages=messages, model=m, max_tokens=100)
        print(f"Success {m}: {response.choices[0].message.content.strip()}")
    except Exception as e:
        print(f"Failed {m}: {e}")
    print("-" * 20)
