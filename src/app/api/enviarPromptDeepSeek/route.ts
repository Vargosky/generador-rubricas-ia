// src/app/api/enviarPromptDeepSeek/route.ts

/** Fuerza runtime Node.js (Serverless) para no chocar con Edge Timeout */
export const config = {
  runtime: "nodejs",
};

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const deepseekRes = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-reasoner",
          messages: [
            {
              role: "system",
              content: "Eres un asistente experto en educación y planificación curricular.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 2048,
        }),
      }
    );

    if (!deepseekRes.ok) {
      const err = await deepseekRes.text();
      console.error("❌ DeepSeek API error:", err);
      return new NextResponse(err, { status: deepseekRes.status });
    }

    const data = await deepseekRes.json();
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      console.error("❌ Respuesta vacía:", data);
      return NextResponse.json({ error: "Respuesta vacía de la IA" }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("❌ Error en POST:", error);
    return NextResponse.json(
      { error: error.message || "Error desconocido" },
      { status: 500 }
    );
  }
}
