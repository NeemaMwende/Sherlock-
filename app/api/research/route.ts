import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sql from "@/lib/db"; // Using Neon serverless sql tagged template

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, caseId, conversationHistory } = body;

    let caseContext = "";

    // Fetch case details if a specific case is selected
    if (caseId) {
      const caseResult = await sql`
        SELECT
          c.*,
          cl.full_name AS client_name,
          cl.email AS client_email
        FROM cases c
        LEFT JOIN clients cl ON cl.id = c.client_id
        WHERE c.id = ${caseId}
      `;

      if (caseResult.length > 0) {
        const caseData = caseResult[0];
        caseContext = `
Context: You are assisting with the following case:
- Case Number: ${caseData.case_number}
- Title: ${caseData.title}
- Description: ${caseData.description}
- Client: ${caseData.client_name} (${caseData.client_email})
- Priority: ${caseData.priority}
- Status: ${caseData.status}
- Due Date: ${new Date(caseData.due_date).toLocaleDateString()}

Please provide research and assistance specifically related to this case.
`;
      }
    }

    // Build conversation history for context
    const historyContext = (conversationHistory || [])
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join("\n");

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

    // Mock response - replace with AI API call in production
    const response = generateMockResponse(message, caseContext);

    // Optional: save conversation history in DB
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

// Mock AI response generator
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
      : "Please provide more details about your legal research question, and I'll do my best to assist you."
  }

Remember: This information is for research purposes only and does not constitute legal advice. For specific legal matters, please consult with a qualified attorney.`;
}
