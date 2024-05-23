## We developed our code using different youtube videos along with Langchain and Streamlit Cookbook.
import streamlit as st
import os
import pinecone
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
from streamlit_extras.add_vertical_space import add_vertical_space
import boto3
import os
import io
from langchain.document_loaders import PyPDFLoader
import pdfplumber


# Set AWS credentials in the environment variables
os.environ['AWS_ACCESS_KEY_ID'] = '123'
os.environ['AWS_SECRET_ACCESS_KEY'] = '123'
os.environ['AWS_REGION'] = 'us-east-1'  # Optional
# AWS S3 Configuration
s3 = boto3.client('s3')
bucket_name = 'bda-project-bucket'
object_key = 'AnnualReports/GOOG2018.pdf'

# Fetch PDF from S3
pdf_object = s3.get_object(Bucket=bucket_name, Key=object_key)
pdf_file = io.BytesIO(pdf_object['Body'].read())

# # # Load PDF with PyPDFLoader
# loader = PyPDFLoader(file_object=pdf_file)
# data = loader.load()

# Read PDF using pdfplumber
all_text = ''
with pdfplumber.open(pdf_file) as pdf:
    for page in pdf.pages:
        all_text += page.extract_text()

# Set API keys and environment
OPENAI_API_KEY = '123'
PINECONE_API_KEY = '123'
PINECONE_API_ENV = 'gcp-starter'

def main():
    # Sidebar contents
    with st.sidebar:
        st.title('LLM Based Financial Chatbot')
        st.markdown('''
        ## About
        This app is an LLM-powered chatbot built using: LangChain and Streamlit
        ''')
        add_vertical_space(5)
        st.write('Made by Data Detectives')

    st.header("Financial Chatbot: Chat with your Company's Private Financial Data 💬")

    # Initialize Pinecone
    pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_API_ENV)

    # Initialize embeddings
    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

    # Load PDF document
    loader = PyPDFLoader(file_path="AnnualReports/")
    data = loader.load()

    # Split document into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(data)

    # Create or connect to a Pinecone index
    index_name = "langchaintest"  # Change as needed
    docsearch = Pinecone.from_texts([t.page_content for t in texts], embeddings, index_name=index_name)

    # Initialize ChatOpenAI model
    llm = ChatOpenAI(model_name='gpt-3.5-turbo', temperature=0, openai_api_key=OPENAI_API_KEY)

    # Load QA chain
    chain = load_qa_chain(llm, chain_type="stuff")

    # User input
    query = st.text_input("Enter Your Prompt for Financial Inquiries. Sample Prompt Template: \
                          You are an AI assistant with access to a comprehensive knowledge base of financial documents. \
                          Based on the information in the knowledge base, please answer the following question: {User question on existing proposals}")

    if query and st.button("Search"):
        docs = docsearch.similarity_search(query)
        response = chain.run(input_documents=docs, question=query)
        st.write(response)

if __name__ == '__main__':
    main()
