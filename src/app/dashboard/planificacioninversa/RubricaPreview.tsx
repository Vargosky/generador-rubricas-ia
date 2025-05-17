import React from "react";
import { Rubrica } from "@/types/Rubrica";

type Props = {
  rubrica: Rubrica;
};

export default function RubricaPreview({ rubrica }: Props) {
  if (!rubrica) return null;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-1">Rúbrica de evaluación</h3>
      {rubrica.criterios.map((criterio, idx) => (
        <div key={criterio.id} className="mb-4">
          <h4 className="font-semibold">Criterio {idx + 1}</h4>
          <ul className="list-disc ml-5 space-y-1">
            {criterio.niveles.map((nivel) => (
              <li key={nivel.nivel}>
                <strong>{nivel.nivel} - {nivel.nombre}:</strong> {nivel.descripcion}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
