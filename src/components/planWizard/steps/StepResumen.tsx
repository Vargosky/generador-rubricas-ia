"use client";
import { format } from "date-fns";
import { useWizard } from "../WizardProvider";
import { generarClases } from "@/lib/calendario/generarClases";

export default function StepResumen() {
  const { data } = useWizard();

  /* seguridad: si faltan datos previos */
  if (!data.fechas || !data.horario) {
    return <p className="text-red-400">Completa los pasos anteriores…</p>;
  }

  const clases = generarClases(
    data.fechas.inicio,
    data.fechas.termino,
    data.horario.sesiones
  );

  return (
    <div className="mx-auto max-w-3xl bg-[#131C31] text-white rounded-2xl shadow-lg p-8 space-y-6">
      <h2 className="text-2xl font-bold">Resumen de clases programadas</h2>

      <p>Total de clases: <span className="font-semibold">{clases.length}</span></p>

      <div className="max-h-[60vh] overflow-y-auto border border-slate-700 rounded">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 sticky top-0">
            <tr>
              <th className="py-2 px-3 text-left">Fecha</th>
              <th className="py-2 px-3 text-left">Día</th>
              <th className="py-2 px-3 text-left">Inicio</th>
              <th className="py-2 px-3 text-left">Duración</th>
            </tr>
          </thead>
          <tbody>
            {clases.map((c) => (
              <tr key={c.fecha + c.inicio} className="border-t border-slate-700">
                <td className="p-2">{format(new Date(c.fecha), "dd/MM/yyyy")}</td>
                <td className="p-2">{c.dia}</td>
                <td className="p-2">{c.inicio || "—"}</td>
                <td className="p-2">{c.duracion} min</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
