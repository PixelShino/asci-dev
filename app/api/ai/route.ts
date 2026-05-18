import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      theme,
      mode,
      provider = "auto",
      userPrompt = "",
    } = await req.json();

    // СТРОГИЙ СИСТЕМНЫЙ КОНТЕКСТ С КОРРЕКЦИЕЙ ЯЗЫКА И ПРОВАЙДЕРОВ
    const systemInstruction = `You are an integrated local AI Terminal Core on Dmitry Goldobin's developer portfolio.
       
       LANGUAGE RULES:
       - Strictly respond in Russian by default.
       - EXCEPTION: If the user explicitly writes their message/prompt in English, respond in English.
       
       CRITICAL IDENTITY RULES:
       - Never state that you are GPT, GPT-4, OpenAI, or ChatGPT.
       - If operating via OpenRouter fallback node, you are powered by DeepSeek. Identify yourself accurately if asked, do not hallucinate being an OpenAI product.
       - Keep your answers clean from any markdown syntax (no asterisks, no bold, no bullet points).
       - Keep responses highly concise (maximum 2-3 short sentences or text lines).`;

    const finalPrompt = userPrompt.trim()
      ? `${systemInstruction}\nUser message to process: "${userPrompt}"`
      : `${systemInstruction}\nGenerate a short, cyberpunk-style technical system diagnostic analysis log in Russian. Requirements: Exactly 4 short raw text lines, terminal log format (e.g., "CORE: ...").`;

    const callGeminiDirect = async () => {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) throw new Error("GEMINI_KEY_MISSING");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: finalPrompt }] }],
          }),
          signal: AbortSignal.timeout(5000),
        },
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "GEMINI_API_BAD_STATUS");
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    };

    const callFallbackOR = async () => {
      const openrouterKey = process.env.OPENROUTER_API_KEY?.trim().replace(
        /^["']|["']$/g,
        "",
      );
      if (!openrouterKey || openrouterKey === "undefined") {
        throw new Error("OPENROUTER_KEY_MISSING");
      }

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openrouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Dev Portfolio Terminal",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat",
            messages: [{ role: "user", content: finalPrompt }],
            temperature: 0.5,
            max_tokens: 150,
          }),
        },
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "OPENROUTER_API_BAD_STATUS");
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    };

    let rawResult = "";
    let sourceUsed = "";

    if (provider === "gemini") {
      rawResult = await callGeminiDirect();
      sourceUsed = "Google AI Studio (Gemini Direct)";
    } else {
      try {
        rawResult = await callGeminiDirect();
        sourceUsed = "Google AI Studio (Gemini Primary)";
      } catch (err: any) {
        console.warn(`[AI_ROUTE] Gemini failover triggered: ${err.message}`);
        rawResult = await callFallbackOR();
        sourceUsed = "OpenRouter Gateway (DeepSeek Fallback)";
      }
    }

    const logLines = rawResult
      .split("\n")
      .filter((line: string) => line.trim().length > 0);
    return NextResponse.json({ logs: logLines, source: sourceUsed });
  } catch (error: any) {
    console.error("--- AI ROUTE PIPELINE CRASH ---", error);
    return NextResponse.json(
      { error: "AI_CORE_DISCONNECTED", details: error.message },
      { status: 500 },
    );
  }
}
