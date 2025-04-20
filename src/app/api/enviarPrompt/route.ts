import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Eres un asistente experto en educación y evaluación escolar." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 2048
      })
    });

    const data = await response.json();
    console.log("✅ Respuesta completa desde DeepSeek:", JSON.stringify(data, null, 2));

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return NextResponse.json({ error: "Respuesta vacía de la IA" }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("❌ Error al contactar DeepSeek:", error);
    return NextResponse.json(
      { error: error.message || "Error al contactar DeepSeek" },
      { status: 500 }
    );
  }
}
