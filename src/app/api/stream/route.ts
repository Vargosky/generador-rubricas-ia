// src/app/api/stream/route.ts
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Importante para streaming

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // 1. Realizar la llamada a DeepSeek con streaming
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat", // Modelo más rápido
        messages: [
          { 
            role: "system", 
            content: "Eres un asistente educativo. Responde de forma clara y estructurada." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1024,
        stream: true // ¡Esto es crucial para streaming!
      })
    });

    // 2. Verificar si la respuesta es válida
    if (!response.ok || !response.body) {
      const error = await response.text();
      console.error("Error en API DeepSeek:", error);
      return NextResponse.json(
        { error: "Error al conectar con DeepSeek" },
        { status: response.status }
      );
    }

    // 3. Crear el stream de lectura
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            // Enviar cada chunk al cliente
            controller.enqueue(chunk);
          }
        } catch (error) {
          console.error("Error en stream:", error);
        } finally {
          controller.close();
        }
      }
    });

    // 4. Retornar el stream como respuesta
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error: any) {
    console.error("Error general:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}