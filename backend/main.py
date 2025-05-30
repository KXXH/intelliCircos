from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from chain import intelliCircos_model, ChatInput
from langserve import add_routes
import logging
from explain import similarity_search

logging.basicConfig(level=logging.DEBUG)


app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="A simple api server using Langchain's Runnable interfaces",
)

origins = [
    "*",
]

add_routes(
    app,
    intelliCircos_model,
    path="/recommend",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# explanation API
@app.post("/explain")
async def explain(input: ChatInput):
    return similarity_search(input.last_human_message)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)

