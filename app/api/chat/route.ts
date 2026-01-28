import { getRagChain } from "@/lib/rag";

export async function POST(req: Request) {
  const { message } = await req.json();

  const chain = await getRagChain();

  const result = await chain.call({
    query: message,
  });

  return Response.json({
    reply: result.text,
  });
}
