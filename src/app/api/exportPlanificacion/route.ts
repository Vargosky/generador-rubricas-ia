/* ─ app/api/exportPlanificacion/route.ts ─ */

import { NextResponse } from "next/server";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

/** Estructura mínima que esperamos del body */
interface PlanificacionDoc {
  asignatura: string;
  clases: {
    numero: number;
    fecha: string;
    horaInicio: string;
    duracion: number;
    objetivo: string;
    habilidad: string;
    inicio: string;
    desarrollo: string;
    cierre: string;
  }[];
  fechasEvaluacion?: string[];
}

export async function POST(req: Request) {
  try {
    const { plan }: { plan: PlanificacionDoc } = await req.json();

    /* ───────── construcción del documento ───────── */
    const doc = new Document({
      creator: "Generador IA",
      title: `Planificación ${plan.asignatura}`,
      description: "Documento creado automáticamente desde EduSuite",
      sections: [
        {
          children: [
            /* Portada / título */
            new Paragraph({
              text: `Planificación: ${plan.asignatura}`,
              heading: HeadingLevel.TITLE,
              spacing: { after: 300 },
            }),

            /* Iteramos clases */
            ...plan.clases.flatMap((c) => [
              new Paragraph({
                text: `Clase ${c.numero}: ${c.objetivo}`,
                heading: HeadingLevel.HEADING_2,
              }),
              new Paragraph(
                `Fecha: ${c.fecha}   Hora: ${c.horaInicio}   Duración: ${c.duracion} min`
              ),
              new Paragraph(`Habilidad Marzano: ${c.habilidad}`),

              new Paragraph({
                children: [new TextRun({ text: "Inicio:", bold: true })],
              }),
              new Paragraph(c.inicio),

              new Paragraph({
                children: [new TextRun({ text: "Desarrollo:", bold: true })],
              }),
              new Paragraph(c.desarrollo),

              new Paragraph({
                children: [new TextRun({ text: "Cierre:", bold: true })],
              }),
              new Paragraph(c.cierre),

              new Paragraph({ text: "", spacing: { after: 200 } }), // salto visual
            ]),

            /* Fechas de evaluación (opcional) */
            ...(plan.fechasEvaluacion?.length
              ? [
                  new Paragraph({
                    text: "Fechas de Evaluación",
                    heading: HeadingLevel.HEADING_2,
                  }),
                  ...plan.fechasEvaluacion.map(
                    (f) => new Paragraph(`• ${f}`)
                  ),
                ]
              : []),
          ],
        },
      ],
    });

    /* ───────── empaquetamos ───────── */
    const buffer = await Packer.toBuffer(doc);
    const filename = `planificacion_${Date.now()}.docx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error generando .docx" },
      { status: 500 }
    );
  }
}
