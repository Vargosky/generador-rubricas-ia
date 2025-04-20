// src/app/api/enviarPrompt/route.ts

/**
 * Edge function proxying prompts to OpenAI for testing purposes
 */
export const config = {
  runtime: "edge",
  regions: ["sfo1"],
};

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Replace DeepSeek call with OpenAI Chat Completions
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Eres un asistente experto en educación y evaluación escolar." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 256
      })
    });

    const data = await response.json();
    console.log("✅ Respuesta completa desde OpenAI:", JSON.stringify(data, null, 2));

    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return NextResponse.json({ error: "Respuesta vacía de la IA" }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("❌ Error al contactar OpenAI:", error);
    return NextResponse.json(
      { error: error.message || "Error al contactar OpenAI" },
      { status: 500 }
    );
  }
}
