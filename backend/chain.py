import os
from typing import List, Tuple, Union
from operator import itemgetter
from langchain_community.embeddings import LlamaCppEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate
from langchain_core.prompts.prompt import PromptTemplate
from langchain_core.prompts import format_document
from langchain.prompts.pipeline import PipelinePromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.runnables import RunnableParallel, RunnableLambda
from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser

# ======输入输出定义======
# 模型的输入
class ChatInput(BaseModel):
    history: List[Union[AIMessage, HumanMessage]]   # 聊天历史，应该是一条AI一条人类，最后一条人类的消息表示最新的指令
    existing_design: str

# 期望的输出，包括输出的结果和解释
class RecommendationResult(BaseModel):
    configuration: str = Field(description="The recommended configuration for the user.")
    explanation: str = Field(description="The explanation of the recommendation.")

parser = PydanticOutputParser(pydantic_object = RecommendationResult)

# ======Promot定义=====
# 用于把检索到的文档转换为字符串的模版，每篇文档一个
DEFAULT_DOCUMENT_PROMPT = PromptTemplate.from_template("""CAPTION: "{page_content}"
LABELS: `{labels}`
""")
# 把检索到的文档转换为字符串的过程中，用于分隔不同文档的字符串
DOCUMENT_SEPARATOR = "\n\n"

# system prompt
with open("./system_prompt.md", "r") as f:
    SYSTEM_PROMPT = SystemMessagePromptTemplate.from_template(
        template=f.read(), 
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )

# query prompt
QUERY_PROMPT = HumanMessagePromptTemplate.from_template("""=====EXAMPLES=====
{document_prompt}
=====EXAMPLES END=====

=====REQUIREMENTS=====
{requirements}
=====REQUIREMENTS END=====

=====EXISTING DESIGN=====
{existing_design}
=====EXISTING DESIGN END=====
""")


# ======检索器======
llama = LlamaCppEmbeddings(model_path="../Chinese-LLaMA-2/13b/ggml-model-q6_k.gguf")
db = Chroma(persist_directory="./chroma_db", embedding_function=llama)
retriver = db.as_retriever()

def _combine_documents(
    docs, document_prompt=DEFAULT_DOCUMENT_PROMPT, document_separator=DOCUMENT_SEPARATOR
):
    doc_strings = [format_document(doc, document_prompt) for doc in docs]
    return document_separator.join(doc_strings)

# ======生成器======
openai_api_key = os.environ.get("OPENAI_API_KEY")
openai_api_base = os.environ.get("OPENAI_API_BASE", "https://api.openai.com")
openai_model_name = os.environ.get("OPENAI_MODEL_NAME", "gpt-4")
chat_gpt = ChatOpenAI(
    # openai_api_key=openai_api_key, openai_api_base=openai_api_base, model_name="gpt-4"
    openai_api_key=openai_api_key, openai_api_base=openai_api_base, model=openai_model_name
)

# ======Chain定义======
def _format_chat(system_message, previous_chat: List[Union[AIMessage, HumanMessage]]):
    return ChatPromptTemplate.from_messages([
        system_message,
        *previous_chat,
        QUERY_PROMPT,
    ])

_input = RunnableParallel({
    "previous_chat": lambda x: x.history[:-1],
    "last_human_message": lambda x: x.history[-1].content,
    "existing_design": lambda x: x.existing_design,
}).with_types(input_type=ChatInput)

prompt_assembler = RunnableParallel({
    "document_prompt": RunnableLambda(lambda x: x["last_human_message"]) | retriver | _combine_documents,
    "requirements": itemgetter("last_human_message"),
    "existing_design": itemgetter("existing_design"),
    "previous_chat": itemgetter("previous_chat"),
})

chain = _input | prompt_assembler | RunnableLambda(lambda x: _format_chat(SYSTEM_PROMPT.format(format_instructions=parser.get_format_instructions()), x["previous_chat"])) | chat_gpt | parser
intelliCircos_model = chain