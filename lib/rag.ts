import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { Ollama } from "@langchain/community/llms/ollama";
import { RetrievalQAChain } from "langchain/chains";

let cachedChain: RetrievalQAChain | null = null;

export async function getRagChain() {
  if (cachedChain) {
    return cachedChain;
  }

  //load pdf
  const filePath = path.join(process.cwd(), "docs/constitution.pdf");
  const buffer = fs.readFileSync(filePath);
  const pdfData = await pdf(buffer);

  // chunk text
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitText(pdfData.text);

  // embeddings + vector stores
  const embeddings = new OllamaEmbeddings({
    model: "llama3",
  });

  const vectorStore = await MemoryVectorStore.fromTexts(chunks, {}, embeddings);

  // retriever
  const retriever = vectorStore.asRetriever({ k: 3 });

  // llm + chain
  const llm = new Ollama({ model: "llama3" });

  cachedChain = RetrievalQAChain.fromLLM(llm, retriever);
  return cachedChain;
}
