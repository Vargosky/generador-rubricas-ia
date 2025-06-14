// src/app/api/enviarPromptGemini/route.ts
import { NextRequest, NextResponse } from "next/server";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_KEY = process.env.GOOGLE_GEMINI_KEY;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: prompt }] }
        ],
        // opcionales
        safetySettings: [],
        generationConfig: { temperature: 0.2, topP: 0.9 }
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Gemini error:", data);
      return NextResponse.json(data, { status: res.status });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
