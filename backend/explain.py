from langchain_community.embeddings import LlamaCppEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.pydantic_v1 import BaseModel, Field
llama = LlamaCppEmbeddings(model_path="../Chinese-LLaMA-2/13b/ggml-model-q6_k.gguf")
db = Chroma(persist_directory="./chroma_db", embedding_function=llama)

def similarity_search(query: str, k: int = 5):
    return db.similarity_search(query, k)