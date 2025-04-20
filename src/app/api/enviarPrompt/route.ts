// src/app/api/enviarPrompt/route.ts

// 1️⃣ Ejecuta como Edge Function en la región SFO1
export const config = {
  runtime: "edge",
  regions: ["sfo1"],  
};

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // 2️⃣ Límite de tokens más bajo para respuestas más rápidas
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
        max_tokens: 256      // token reducido
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;
    if (!reply) {
      return NextResponse.json({ error: "Respuesta vacía de la IA" }, { status: 500 });
    }
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("❌ Error al contactar DeepSeek:", err);
    return NextResponse.json({ error: err.message || "Error al contactar DeepSeek" }, { status: 500 });
  }
}
