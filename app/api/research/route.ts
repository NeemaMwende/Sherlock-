// app/api/research/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db";

// -----------------------------
// Types
// -----------------------------
type ConversationMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ResearchRequestBody = {
  message: string;
  caseId?: number;
  conversationHistory: ConversationMessage[];
};

// -----------------------------
// POST Handler
// -----------------------------
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ResearchRequestBody = await request.json();
    const { message, caseId, conversationHistory } = body;

    let caseContext = "";

    // If a specific case is selected, fetch its details
    if (caseId) {
      const caseResult = await sql`
        SELECT 
          cases.*,
          users.name as user_name,
          users.email as user_email
        FROM cases
        LEFT JOIN users ON cases.user_id = users.id
        WHERE cases.id = ${caseId}
      `;

      if (caseResult.length > 0) {
        const caseData = caseResult[0];
        caseContext = `
Context: You are assisting with the following case:
- Case ID: #${caseData.id}
- Name: ${caseData.name}
- Description: ${caseData.description}
- Assigned User: ${caseData.user_name} (${caseData.user_email})
- Priority: ${caseData.priority}
- Status: ${caseData.status}
- Created: ${new Date(caseData.created_at).toLocaleDateString()}
- Last Updated: ${new Date(caseData.updated_at).toLocaleDateString()}

Please provide research and assistance specifically related to this case.
`;
      }
    }

    // Build conversation history for context
    const historyContext = conversationHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    // System prompt for AI
    const systemPrompt = `You are a professional legal research assistant. You help lawyers and legal professionals with:
- Legal research and case law analysis
- Statute interpretation
- Legal strategy recommendations
- Document drafting guidance
- Legal precedent research

${caseContext}

Previous conversation:
${historyContext}

Provide detailed, professional, and accurate legal research assistance. Always remind users that this is for informational purposes and they should consult with qualified legal counsel for specific legal advice.`;

    // Mock response - Replace with actual AI API call
    const response = generateMockResponse(message, caseContext);

    // Optionally, save the conversation to database for history
    // await sql`
    //   INSERT INTO research_conversations (case_id, user_message, assistant_response)
    //   VALUES (${caseId}, ${message}, ${response})
    // `;

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in research:", error);
    return NextResponse.json(
      { error: "Failed to process research request" },
      { status: 500 },
    );
  }
}

// -----------------------------
// Mock response generator
// -----------------------------
function generateMockResponse(message: string, caseContext: string): string {
  const lowerMessage = message.toLowerCase();

  if (caseContext) {
    return `Based on the case details provided, I can help you research this matter. ${
      lowerMessage.includes("precedent")
        ? "For precedent research, I recommend examining similar cases in your jurisdiction. I can help you identify relevant case law and analyze how courts have ruled on similar issues."
        : lowerMessage.includes("strategy")
          ? "For case strategy, consider the strengths and weaknesses of your position. I can help you analyze potential arguments and counter-arguments based on the case details."
          : lowerMessage.includes("document")
            ? "I can assist with document drafting by providing templates and guidance on proper legal formatting and language for various legal documents."
            : lowerMessage.includes("status") || lowerMessage.includes("update")
              ? "Based on the case information, the current status is as shown in the case details. I can help you prepare status updates, next steps, or analyze what actions should be taken next."
              : "I'm here to help with your legal research. Could you please provide more specific details about what aspect of the case you'd like to research?"
    }

Please note: This is for informational purposes only and does not constitute legal advice. Always consult with a qualified attorney for specific legal matters.`;
  }

  return `I'd be happy to help with your legal research question. ${
    lowerMessage.includes("contract")
      ? "For contract-related questions, I can help you understand common contract clauses, formation requirements, and potential issues to watch for."
      : lowerMessage.includes("statute")
        ? "For statute research, I can help you understand statutory interpretation, relevant case law, and how statutes apply to specific situations."
        : lowerMessage.includes("case law")
          ? "For case law research, I can help you identify relevant precedents, understand how courts have ruled on similar issues, and analyze the reasoning behind those decisions."
          : lowerMessage.includes("tort") || lowerMessage.includes("negligence")
            ? "For tort law questions, I can help you understand the elements of various torts, defenses, and how they apply to different scenarios."
            : lowerMessage.includes("criminal")
              ? "For criminal law questions, I can help you understand criminal procedures, defenses, sentencing guidelines, and relevant case law."
              : "Please provide more details about your legal research question, and I'll do my best to assist you."
  }

Remember: This information is for research purposes only and does not constitute legal advice. For specific legal matters, please consult with a qualified attorney.`;
}

// -----------------------------
// Example OpenAI integration (commented out)
// -----------------------------
/*
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getAIResponse(systemPrompt: string, userMessage: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],
  });

  return completion.choices[0].message.content;
}
*/
