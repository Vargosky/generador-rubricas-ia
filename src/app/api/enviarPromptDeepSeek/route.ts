// src/app/api/enviarPromptDeepSeek/route.ts

export const config = {
    // fuerza uso de Serverless Function (Node.js) con timeout alto
    runtime: "nodejs",
  };
  
  import { NextResponse } from "next/server";
  
  export async function POST(req: Request) {
    try {
      const { prompt } = await req.json();
  
      const deepseekRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "Eres un asistente experto en educación y planificación curricular." },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 2048,
        }),
      });
  
      if (!deepseekRes.ok) {
        const err = await deepseekRes.text();
        console.error("❌ DeepSeek API error:", err);
        return NextResponse.json({ error: err }, { status: deepseekRes.status });
      }
  
      const data = await deepseekRes.json();
      const reply = data.choices?.[0]?.message?.content;
      if (!reply) {
        console.error("❌ Respuesta vacía de DeepSeek:", JSON.stringify(data));
        return NextResponse.json({ error: "Sin contenido de IA" }, { status: 500 });
      }
  
      return NextResponse.json({ reply });
    } catch (error: any) {
      console.error("❌ Error al contactar DeepSeek:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  