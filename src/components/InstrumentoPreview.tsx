"use client";
import { useMemo } from "react";
import { saveAs } from "file-saver";
import {
  Document,
  HeadingLevel,
  Paragraph,
  Packer,
  TextRun,
} from "docx";

import { parseInstrumento, Instrumento } from "@/util/parseInstrumento";

type Props = { jsonString: string };

export default function InstrumentoPreview({ jsonString }: Props) {
  /* ------------------- Parseamos una sola vez ------------------- */
  const instrumento = useMemo(() => parseInstrumento(jsonString), [jsonString]);

  if (!instrumento) {
    return (
      <p className="text-red-400">
        ⚠️ No se pudo interpretar la respuesta como JSON válido.
      </p>
    );
  }

  const {
    asignatura,
    objetivoGeneral,
    examen: {
      enunciadoGeneral,
      preguntas: { alternativas, desarrollo },
    },
    formulaNota,
  } = instrumento;

  /* ----------------------- DOCX builder ------------------------- */
  const exportToDocx = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "Instrumento de Evaluación", heading: HeadingLevel.TITLE }),
            new Paragraph({ text: `Asignatura: ${asignatura}`, spacing: { after: 200 } }),
            new Paragraph({ text: "Objetivo general:"}),
            new Paragraph({ text: objetivoGeneral, spacing: { after: 200 } }),

            new Paragraph({ text: "Preguntas de Alternativas", heading: HeadingLevel.HEADING_2 }),
            ...alternativas.flatMap((alt, idx) => [
              new Paragraph({ text: `${idx + 1}. ${alt.enunciado}` }),
              ...(["A", "B", "C", "D"] as const).map(
                (letra) =>
                  new Paragraph({
                    text: `   ${letra}. ${alt.opciones[letra]}`,
                  })
              ),
            ]),
            new Paragraph({ text: "", spacing: { after: 200 } }),

            new Paragraph({ text: "Preguntas de Desarrollo", heading: HeadingLevel.HEADING_2 }),
            ...desarrollo.map(
              (p, idx) => new Paragraph({ text: `${idx + 1}. ${p}` })
            ),
            new Paragraph({ text: "", spacing: { after: 200 } }),

            new Paragraph({ text: "Respuestas correctas", heading: HeadingLevel.HEADING_2 }),
            ...alternativas.map(
              (alt, idx) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: `${idx + 1}. ` }),
                    new TextRun({ text: alt.correcta, bold: true }),
                  ],
                })
            ),

            new Paragraph({ text: "", spacing: { after: 200 } }),
            new Paragraph({ text: `Fórmula de nota: ${formulaNota}` }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `instrumento_${asignatura}.docx`);
  };

  /* ----------------------- Render HTML -------------------------- */
  return (
    <div className="mt-8 space-y-6">
      {/* -------- resumen breve para el profesor -------- */}
      <div className="bg-gray-800 border border-gray-700 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">
          Instrumento de evaluación – {asignatura.toUpperCase()}
        </h2>
        <p className="mb-2">
          <strong>Objetivo general: </strong>
          {objetivoGeneral}
        </p>

        {/* --------- preguntas de alternativas ---------- */}
        <h3 className="text-lg font-bold mt-4 mb-1">Preguntas de alternativas</h3>
        <ol className="list-decimal ml-5 space-y-1">
          {alternativas.map((q, i) => (
            <li key={i}>
              {q.enunciado}
              <ul className="list-[upper-alpha] ml-4">
                {(["A", "B", "C", "D"] as const).map((opt) => (
                  <li key={opt}>
                    {opt}. {q.opciones[opt]}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        {/* --------- preguntas de desarrollo ---------- */}
        <h3 className="text-lg font-bold mt-4 mb-1">Preguntas de desarrollo</h3>
        <ol className="list-decimal ml-5 space-y-1">
          {desarrollo.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ol>

        {/* --------- respuestas correctas al final ---------- */}
        <h3 className="text-lg font-bold mt-4 mb-1">Respuestas correctas</h3>
        <ol className="list-decimal ml-5 space-y-1">
          {alternativas.map((q, i) => (
            <li key={i}>{q.correcta}</li>
          ))}
        </ol>

        <button
          onClick={exportToDocx}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Exportar a DOCX
        </button>
      </div>
    </div>
  );
}
