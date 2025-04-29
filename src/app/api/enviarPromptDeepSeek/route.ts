// src/app/api/enviarPromptDeepSeek/route.ts

/** Fuerza runtime Node.js (Serverless) para no chocar con Edge Timeout */
export const config = {
  runtime: "nodejs",
};

// const API_Adress="https://api.deepseek.com/v1/chat/completions"
// const modelo = "deepseek-reasoner"

const API_Adress="https://api.openai.com/v1/chat/completions"
const modelo = "o4-mini"
const key = process.env.OPENAI_API_KEY

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const deepseekRes = await fetch(
      API_Adress,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelo,
          messages: [
            {
              role: "system",
              content: "Eres un asistente experto en educación y planificación curricular. Que planifica clases bajo la taxonomía de Marzano",
            },
            { role: "user", content: prompt },
          ],
          // temperature: 0.4,
          // max_tokens: 5000,
        }),
      }
    );

    if (!deepseekRes.ok) {
      const err = await deepseekRes.text();
      console.error("❌ error: API Inteligencia Artificial", err);
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
