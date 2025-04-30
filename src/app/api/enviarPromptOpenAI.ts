// pages/api/enviarPromptOpenAI.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { generatePlanificacionPrompt, PlanificacionData } from "@/util/prompts";

type OpenAIResponse = {
  reply?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpenAIResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { prompt } = req.body as { prompt: string };

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "o4-mini",
        messages: [
          { role: "system", content: "Eres un asistente experto en educación y planificación curricular." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      console.error("❌ OpenAI API error:", err);
      return res.status(openaiRes.status).json({ error: err });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      console.error("❌ Respuesta vacía de OpenAI:", data);
      return res.status(500).json({ error: "Respuesta vacía de la IA" });
    }

    res.status(200).json({ reply });
  } catch (e: any) {
    console.error("❌ Error en handler OpenAI:", e);
    res.status(500).json({ error: e.message });
  }
}
