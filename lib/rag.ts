import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/vectorstores";
import { ChatOllama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatMessageHistory } from "@langchain/core/memory";

type DocumentChunk = {
  pageContent: string;
  metadata?: Record<string, any>;
};
let cachedChain: RunnableSequence | null = null;

export async function getRagChain() {
  if (cachedChain) return cachedChain;

  // 1️⃣ Load PDF
  const loader = new PDFLoader("docs/constitution.pdf");
  const docs = await loader.load();

  // 2️⃣ Chunk text
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitDocuments(docs);

  // 3️⃣ Embeddings + vector store
  const embeddings = new OllamaEmbeddings({ model: "llama3" });
  const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);

  const retriever = vectorStore.asRetriever({ k: 3 });

  // 4️⃣ Prompt template
  const prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful legal assistant.
Answer ONLY using the context provided.

Context:
{context}

Question:
{question}
`);

  // 5️⃣ LLM
  const memory = new ChatMessageHistory();
  const llm = new ChatOllama({ model: "llama3", temperature: 0, memory });

  // 6️⃣ Compose chain
  cachedChain = RunnableSequence.from([
    {
      // build context from retriever
      context: async (input: string) => {
        const docs = await retriever.invoke(input);
        return docs.map((d: DocumentChunk) => d.pageContent).join("\n\n");
      },
      question: (input: string) => input,
    },
    prompt,
    llm,
  ]);

  return cachedChain;
}
