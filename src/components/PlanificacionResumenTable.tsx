"use client";

import React from "react";
import { PlanificacionResumen } from "@/types/Planificacion";

type Props = { resumen: PlanificacionResumen[] };

/**
 * Muestra la sección «resumen» en una tabla HTML simple.
 * Si usas shadcn/ui, reemplaza la tabla por <Table>…</Table>.
 */
export default function PlanificacionResumenTable({ resumen }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Nº</th>
            <th className="px-3 py-2 text-left font-semibold">Objetivo específico</th>
            <th className="px-3 py-2 text-left font-semibold">Actividad central</th>
            <th className="px-3 py-2 text-left font-semibold">Recurso TIC</th>
            <th className="px-3 py-2 text-left font-semibold">Evaluación formativa</th>
          </tr>
        </thead>
        <tbody>
          {resumen.map((fila) => (
            <tr key={fila.numero} className="border-t last:border-b">
              <td className="px-3 py-2">{fila.numero}</td>
              <td className="px-3 py-2">{fila.objetivoEspecifico}</td>
              <td className="px-3 py-2">{fila.actividadCentral}</td>
              <td className="px-3 py-2">{fila.recursoTIC}</td>
              <td className="px-3 py-2">{fila.evaluacionFormativa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
