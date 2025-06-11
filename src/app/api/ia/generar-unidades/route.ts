// src/app/api/ia/generar-unidades/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { asignatura, objetivos, fechaInicio, fechaTermino } = await req.json();

    const prompt = `
Eres un experto en planificación educativa. Crea unidades temáticas para la asignatura "${asignatura}" en base a estos objetivos de aprendizaje:

${objetivos.map((oa: any) => `- ${oa.code}: ${oa.description}`).join("\n")}

Periodo de clases: ${fechaInicio} al ${fechaTermino}.
Devuélvelo como un array JSON con:

[
  {
    "titulo": "...",
    "semanas": "...",
    "objetivos": "..."
  }
]
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    const match = content?.match(/\[\s*{[\s\S]*?}\s*\]/);
    const unidades = JSON.parse(match?.[0] || "[]");

    return NextResponse.json({ unidades });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
