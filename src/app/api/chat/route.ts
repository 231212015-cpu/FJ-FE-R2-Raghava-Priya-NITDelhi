import { OpenAI } from "openai";

export async function POST(request: Request) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        { status: 400 }
      );
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      // Fallback to simple pattern matching if no API key
      const fallbackResponse = getFallbackResponse(message);
      return new Response(
        JSON.stringify({ 
          reply: fallbackResponse,
          source: "fallback",
          note: "OpenAI integration disabled. Set OPENAI_API_KEY in .env.local to enable AI responses."
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Only initialize OpenAI if API key exists
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful Ride-Forward customer support assistant. You help users with questions about:
- Booking rides
- Payment and pricing
- Safety and security
- General ride features
- Account management

Be concise, friendly, and helpful. Keep responses under 100 words.`,
        },
        ...conversationHistory.map((msg: { role: string; content: string }) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    const reply =
      response.choices[0]?.message?.content || "I couldn't process that request.";

    return new Response(
      JSON.stringify({ 
        reply,
        source: "openai"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    // Return fallback response on error
    const fallbackResponse = getFallbackResponse(
      error.message || "General inquiry"
    );
    return new Response(
      JSON.stringify({ 
        reply: fallbackResponse,
        source: "fallback",
        error: error.message || "Service temporarily using fallback mode"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}

function getFallbackResponse(query: string): string {
  const normalized = query.toLowerCase();

  const responses: { [key: string]: string } = {
    "how do i book": "To book a ride: Open the app, enter your destination, choose your ride type, and tap 'Book Ride'. You'll be matched with a nearby driver shortly.",
    "how much does it cost":
      "Fares are calculated based on distance, time, and demand. You'll see an estimated fare before booking.",
    "what payment methods": "We accept credit/debit cards, UPI, Paytm, PhonePe, Google Pay, and BluRide wallet balance.",
    "is it safe": "Safety is our priority. All drivers undergo background checks and vehicle inspections. You can share your trip with friends and use emergency features.",
    "can i cancel": "Yes, you can cancel if the driver hasn't arrived yet. Cancellation fees may apply depending on timing.",
    "how do i tip": "You can add a tip after your ride is completed. 100% of the tip goes directly to your driver.",
    "what about shared rides":
      "You can enable ride sharing to split costs with other passengers heading in the same direction.",
    "lost and found": "If you lost something, contact support with your ride details and we'll help you retrieve it.",
    "issue refund": "Contact support with your ride number and we'll review your case within 24 hours.",
    default: "I'm here to help! Ask me about booking, payments, safety, ride features, or account help.",
  };

  for (const [key, value] of Object.entries(responses)) {
    if (key !== "default" && normalized.includes(key)) {
      return value;
    }
  }

  return responses.default;
}
