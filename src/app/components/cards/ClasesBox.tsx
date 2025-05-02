"use client";
import React, { useState } from "react";
import { saveAs } from "file-saver";

export type Clase = {
  numero: number;
  fecha: string;
  horaInicio: string;
  duracion: number;
  objetivo: string;
  habilidad: string;
  inicio: string;
  desarrollo: string;
  cierre: string;
  evaluacionIncluida: boolean;
  guion?: string;
};

interface ClasesBoxProps {
  clases: Clase[];
  asignatura: string;
  onGenerate: (idx: number, clase: Clase) => void;
}

const ClasesBox: React.FC<ClasesBoxProps> = ({
  clases,
  asignatura,
  onGenerate,
}) => {
  if (!clases.length) return null;

  /* descarga solo una clase */
  const descargarClase = async (clase: Clase) => {
    const r = await fetch("/api/exportClase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clase, asignatura }),
    });
    const blob = await r.blob();
    saveAs(blob, `clase_${clase.numero}.docx`);
  };

  return (
    <div className="mt-8 space-y-4">
      {clases.map((c, idx) => {
        const [open, setOpen] = useState(false);

        return (
          <div
            key={c.numero}
            className="rounded-2xl border border-gray-300 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800 shadow"
          >
            {/* encabezado + botones */}
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Clase {c.numero}: {c.objetivo}
              </h4>

              <div className="space-x-2">
                {!c.guion && (
                  <button
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    onClick={() => onGenerate(idx, c)}
                  >
                    📝 Guion
                  </button>
                )}
                {c.guion && (
                  <>
                    <button
                      className="text-sm text-blue-600 hover:underline border-2 border-black px-5 py-3 rounded-2xl mb-5"
                      onClick={() => setOpen(!open)}
                    >
                      {open ? "Ocultar" : "Ver"} guion
                    </button>
                    <button
                      className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded"
                      onClick={() => descargarClase(c)}
                    >
                      ⬇ Guardar
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* metadatos */}
            <div className="space-y-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <p><span className="font-medium">Fecha:</span> {c.fecha} • {c.horaInicio} • {c.duracion} min</p>
              <p><span className="font-medium">Habilidad:</span> {c.habilidad}</p>
              <p><span className="font-medium">Inicio:</span> {c.inicio}</p>
              <p><span className="font-medium">Desarrollo:</span> {c.desarrollo}</p>
              <p><span className="font-medium">Cierre:</span> {c.cierre}</p>
            </div>

            {/* guion con scroll */}
            {c.guion && open && (
              <pre
                className="mt-4 bg-gray-200 dark:bg-gray-900 p-4 rounded
                           text-xs whitespace-pre-wrap leading-relaxed
                           max-h-72 overflow-y-auto scrollbar-thin
                           scrollbar-thumb-gray-500 scrollbar-thumb-rounded"
              >
                {c.guion}
              </pre>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ClasesBox;
