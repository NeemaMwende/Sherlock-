import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OllamaEmbeddings, ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

type EmbeddedDoc = {
  content: string;
  embedding: number[];
};

let embeddedDocs: EmbeddedDoc[] | null = null;

async function embedDocuments(): Promise<EmbeddedDoc[]> {
  if (embeddedDocs) return embeddedDocs;

  const loader = new PDFLoader("docs/constitution.pdf");
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitDocuments(docs);

  const embedder = new OllamaEmbeddings({
    model: "llama3",
  });

  embeddedDocs = await Promise.all(
    chunks.map(
      async (doc): Promise<EmbeddedDoc> => ({
        content: doc.pageContent,
        embedding: await embedder.embedQuery(doc.pageContent),
      }),
    ),
  );

  return embeddedDocs;
}

// cosine similarity
function similarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

export async function runRag(question: string) {
  const docs = await embedDocuments();

  const embedder = new OllamaEmbeddings({ model: "llama3" });
  const queryEmbedding = await embedder.embedQuery(question);

  const topDocs = docs
    .map((d) => ({
      content: d.content,
      score: similarity(queryEmbedding, d.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((d) => d.content)
    .join("\n\n");

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a legal assistant.
Answer ONLY using the provided Constitution context.
If the answer is not found, say you don't know.`,
    ],
    ["human", "Context:\n{context}\n\nQuestion:\n{question}"],
  ]);

  const model = new ChatOllama({
    model: "llama3",
    temperature: 0.2,
  });

  const chain = RunnableSequence.from([prompt, model]);

  const response = await chain.invoke({
    context: topDocs,
    question,
  });

  return response.content;
}
