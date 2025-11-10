
import React from 'react';
import { CodeBlock } from './CodeBlock';

const RAGSystem: React.FC = () => {
    const ragDiagram = `
    +------------------+     +--------------------+     +---------------------+
    |   User Query     | --> | Retrieve Relevant  | --> |   Augmented Prompt  |
    | "What is RAG?"   |     | Chunks from        |     | [Context + Query]   |
    +------------------+     | Vector Database    |     +---------------------+
                               +--------------------+               |
                                                                    |
                                                                    v
                                                            +----------------+
                                                            |  LLM Generates |
                                                            |  Answer        |
                                                            +----------------+
    `;
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-200">RAG System (Conceptual)</h2>
            <p className="text-gray-400 mb-6">This section explains Retrieval-Augmented Generation (RAG), a technique to let AI models "chat with your files."</p>

            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 space-y-4">
                <h3 className="text-xl font-semibold text-indigo-400">What is RAG?</h3>
                <p>RAG enhances Large Language Models (LLMs) by providing them with external knowledge. Instead of relying only on its training data, the model can access and reference specific information from your documents (PDFs, DOCX, etc.) to answer questions accurately.</p>
                
                <h3 className="text-xl font-semibold text-indigo-400 mt-4">How It Works</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                    <li><strong className="text-white">Ingestion:</strong> Your documents are broken down into smaller chunks.</li>
                    <li><strong className="text-white">Embedding:</strong> Each chunk is converted into a numerical representation (an embedding) using a model like `text-embedding-3-small`.</li>
                    <li><strong className="text-white">Indexing:</strong> These embeddings are stored in a specialized vector database (e.g., ChromaDB, Pinecone).</li>
                    <li><strong className="text-white">Retrieval:</strong> When you ask a question, the system converts your query into an embedding and finds the most similar document chunks from the database.</li>
                    <li><strong className="text-white">Generation:</strong> The retrieved chunks (the "context") are combined with your original question and sent to an LLM like Gemini. The model then generates an answer based on the provided information.</li>
                </ol>

                <h3 className="text-xl font-semibold text-indigo-400 mt-4">Simplified Flow</h3>
                <CodeBlock code={ragDiagram} language="text" />

                <p className="text-sm text-gray-500 mt-4">
                    <strong>Note:</strong> A full RAG implementation requires a backend to handle file processing, embedding, and the vector database. This UI serves as a conceptual guide to the architecture.
                </p>
            </div>
        </div>
    );
};

export default RAGSystem;
