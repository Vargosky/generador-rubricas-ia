"use client";
import React, { useState } from "react";

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
  guion?: string;            //  <<< nuevo, guion generado
};

interface ClasesBoxProps {
  clases: Clase[];
  onGenerate: (idx: number, clase: Clase) => void;
}

const ClasesBox: React.FC<ClasesBoxProps> = ({ clases, onGenerate }) => {
  if (!clases.length) return null;

  return (
    <div className="mt-8 space-y-4">
      {clases.map((c, idx) => {
        const [open, setOpen] = useState(false);

        return (
          <div
            key={c.numero}
            className="rounded-2xl border border-gray-300 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800 shadow"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Clase {c.numero}: {c.objetivo}
              </h4>

              {!c.guion && (
                <button
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  onClick={() => onGenerate(idx, c)}
                >
                  📝 Generar guion
                </button>
              )}
              {c.guion && (
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setOpen(!open)}
                >
                  {open ? "Ocultar guion" : "Ver guion"}
                </button>
              )}
            </div>

            <div className="space-y-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <p><span className="font-medium">Fecha:</span> {c.fecha} • {c.horaInicio} • {c.duracion} min</p>
              <p><span className="font-medium">Habilidad:</span> {c.habilidad}</p>
              <p><span className="font-medium">Inicio:</span> {c.inicio}</p>
              <p><span className="font-medium">Desarrollo:</span> {c.desarrollo}</p>
              <p><span className="font-medium">Cierre:</span> {c.cierre}</p>
              {c.evaluacionIncluida && (
                <p className="text-red-600 dark:text-red-400 font-semibold">
                  ⚠ Evaluación incluida en esta sesión
                </p>
              )}
            </div>

            {c.guion && open && (
              <pre className="mt-4 bg-gray-200 dark:bg-gray-900 p-4 rounded text-xs whitespace-pre-wrap">
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
