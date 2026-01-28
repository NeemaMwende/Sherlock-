import { NextResponse } from "next/server";
import { runRag } from "@/lib/rag";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const reply = await runRag(message);

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error("RAG error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 },
    );
  }
}
