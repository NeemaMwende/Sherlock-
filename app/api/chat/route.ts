import { NextResponse } from "next/server";
import { getRagChain } from "@/lib/rag";

interface ChatRequest {
  message: string;
}

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as ChatRequest;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { reply: "Please provide a message." },
        { status: 400 },
      );
    }

    const chain = await getRagChain();

    // Invoke the chain with the user's message
    const result = await chain.invoke(message);

    return NextResponse.json({
      reply: result.content ?? result.text ?? "No response generated.",
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { reply: "Sorry, something went wrong with the RAG chain." },
      { status: 500 },
    );
  }
}
