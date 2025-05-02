import { NextResponse } from "next/server";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

interface ClaseDoc {
  numero: number;
  fecha: string;
  horaInicio: string;
  duracion: number;
  objetivo: string;
  habilidad: string;
  inicio: string;
  desarrollo: string;
  cierre: string;
  guion?: string; // texto plano
}

export async function POST(req: Request) {
  try {
    const { clase, asignatura }: { clase: ClaseDoc; asignatura: string } =
      await req.json();

    const children: Paragraph[] = [
      new Paragraph({
        text: `Clase ${clase.numero}: ${clase.objetivo}`,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 300 },
      }),
      new Paragraph(
        `Fecha: ${clase.fecha}   Hora: ${clase.horaInicio}   Duración: ${clase.duracion} min`
      ),
      new Paragraph(`Habilidad Marzano: ${clase.habilidad}`),
      new Paragraph(""),
      new Paragraph({
        children: [new TextRun({ text: "Inicio:", bold: true })],
      }),
      new Paragraph(clase.inicio),
      new Paragraph({
        children: [new TextRun({ text: "Desarrollo:", bold: true })],
      }),
      new Paragraph(clase.desarrollo),
      new Paragraph({
        children: [new TextRun({ text: "Cierre:", bold: true })],
      }),
      new Paragraph(clase.cierre),
    ];

    if (clase.guion) {
      children.push(
        new Paragraph({ text: "", spacing: { after: 200 } }),
        new Paragraph({
          text: "Guion minuto a minuto",
          heading: HeadingLevel.HEADING_2,
        }),
        ...clase.guion.split("\n").map((l) => new Paragraph(l))
      );
    }

    const doc = new Document({
      title: `Clase ${clase.numero} - ${asignatura}`,
      sections: [{ children }],
    });

    const buffer = await Packer.toBuffer(doc);
    const filename = `clase_${clase.numero}.docx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
