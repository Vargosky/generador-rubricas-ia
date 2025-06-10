/* StepResumen.tsx
   Paso · Resumen general (💡 ahora incluye actividades y evaluaciones)
------------------------------------------------------------ */
"use client";
import { format } from "date-fns";
import { useWizard } from "../WizardProvider";
import { generarClases } from "@/lib/calendario/generarClases";
import { ChevronsRight } from "lucide-react";

export default function StepResumen() {
  const { data, back, next } = useWizard();

  // seguridad mínima
  if (!data.fechas || !data.horario || !data.tipo) {
    return <p className="text-red-400">Información incompleta…</p>;
  }

  const clases = generarClases(
    data.fechas.inicio,
    data.fechas.termino,
    data.horario.sesiones
  );
  const fmt = (d: string) => format(new Date(d), "dd/MM/yyyy");

  return (
    <div className="mx-auto max-w-5xl space-y-8 rounded-2xl bg-[#131C31] p-8 text-white shadow-lg">
      <h2 className="text-2xl font-bold">Resumen general de la planificación</h2>

      {/* ───────────────────────── datos principales ───────────────────────── */}
      <section className="grid gap-4 md:grid-cols-2">
        {/* Tipo */}
        <ResumenBox titulo="Tipo de planificación">
          <p className="capitalize">{data.tipo}</p>
        </ResumenBox>

        {/* Fechas */}
        <ResumenBox titulo="Rango de fechas">
          <p>
            <b>Inicio:</b> {fmt(data.fechas.inicio)}
          </p>
          <p>
            <b>Término:</b> {fmt(data.fechas.termino)}
          </p>

          {data.fechas.extras?.length > 0 && (
            <>
              <h4 className="mt-2 font-medium">Fechas importantes</h4>
              <ul className="ml-4 list-disc text-sm">
                {data.fechas.extras.map((f: any) => (
                  <li key={f.titulo}>
                    {f.titulo}: {fmt(f.fecha)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </ResumenBox>

        {/* Horario */}
        <ResumenBox titulo="Sesiones semanales" full>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="py-2">Día</th>
                <th className="py-2">Inicio</th>
                <th className="py-2">Duración</th>
              </tr>
            </thead>
            <tbody>
              {data.horario.sesiones.map((s: any, i: number) => (
                <tr key={i} className="border-t border-slate-700">
                  <td className="py-1">{s.dia}</td>
                  <td className="py-1">{s.inicio || "—"}</td>
                  <td className="py-1">{s.duracion} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ResumenBox>

        {/* Objetivos */}
        {data.objetivos && (
          <ResumenBox titulo="Objetivos de aprendizaje seleccionados" full>
            <ul className="ml-4 list-disc space-y-1 text-sm">
              {data.objetivos.map((oa: any) => (
                <li key={`${oa.level}-${oa.code}`}>
                  <b>{oa.code}</b> · {oa.level} — {oa.description}
                </li>
              ))}
            </ul>
          </ResumenBox>
        )}

        {/* Actividades */}
        {data.actividades && (
          <ResumenBox titulo="Actividades programadas" full>
            <ul className="ml-4 list-disc space-y-1 text-sm">
              {data.actividades.map((a: any, idx: number) => (
                <li key={idx}>
                  <b>{a.nombre}:</b> {a.detalle}
                </li>
              ))}
            </ul>
          </ResumenBox>
        )}

        {/* Evaluaciones */}
        {data.evaluaciones && (
          <ResumenBox titulo="Evaluaciones planificadas" full>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-2">Tipo</th>
                  <th className="py-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {data.evaluaciones.map((e: any, idx: number) => (
                  <tr key={idx} className="border-t border-slate-700">
                    <td className="py-1">{e.nombre}</td>
                    <td className="py-1">{e.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResumenBox>
        )}
      </section>

      {/* ─────────────── calendario ─────────────── */}
      <section>
        <h3 className="mb-2 text-lg font-semibold">
          Calendario de clases ({clases.length} en total)
        </h3>
        <div className="max-h-[50vh] overflow-y-auto rounded border border-slate-700">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-800">
              <tr>
                <th className="px-3 py-2 text-left">Fecha</th>
                <th className="px-3 py-2 text-left">Día</th>
                <th className="px-3 py-2 text-left">Inicio</th>
                <th className="px-3 py-2 text-left">Duración</th>
              </tr>
            </thead>
            <tbody>
              {clases.map((c) => (
                <tr key={c.fecha + c.inicio} className="border-t border-slate-700">
                  <td className="px-3 py-1">{fmt(c.fecha)}</td>
                  <td className="px-3 py-1">{c.dia}</td>
                  <td className="px-3 py-1">{c.inicio || "—"}</td>
                  <td className="px-3 py-1">{c.duracion} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─────────────── navegación ─────────────── */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={back}
          className="rounded border border-gray-500 px-6 py-2 transition-colors hover:bg-gray-700"
        >
          ← Atrás
        </button>

        <button
          type="button"
          onClick={next}
          className="flex items-center gap-1 rounded bg-green-600 px-6 py-2 transition-colors hover:bg-green-700"
        >
          Finalizar <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────── sub-componente decorativo ─────────────── */
function ResumenBox({
  titulo,
  children,
  full = false,
}: {
  titulo: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`rounded bg-slate-800 p-4 ${full ? "md:col-span-2" : ""}`}>
      <h3 className="mb-2 text-lg font-semibold">{titulo}</h3>
      {children}
    </div>
  );
}
