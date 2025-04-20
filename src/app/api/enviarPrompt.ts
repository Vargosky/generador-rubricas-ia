// pages/api/enviarPrompt.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat", // o "deepseek-coder" si estás usando esa
        messages: [
          { role: "system", content: "Eres un asistente experto en educación y evaluación escolar." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 2048
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    res.status(200).json({ reply });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Error al contactar DeepSeek" });
  }
}
