/* StepResumen.tsx – resumen global + mapa mensual acumulativo */
"use client";
import {
  format,
  addWeeks,
  addMonths,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import { useMemo } from "react";
import { useWizard } from "../WizardProvider";
import { generarClases } from "@/lib/calendario/generarClases";
import { ChevronsRight } from "lucide-react";
import { ResumenBox } from "@/app/components/ResumeBox";

export default function StepResumen() {
  const { data, back, next } = useWizard();

  /* seguridad mínima */
  if (!data.fechas || !data.horario || !data.tipo) {
    return <p className="text-red-400">Información incompleta…</p>;
  }

  const fmt = (d: string | Date) => format(new Date(d), "dd/MM/yyyy");
  const iniPlan = new Date(data.fechas.inicio);
  const finPlan = new Date(data.fechas.termino);

  /* calendario clases */
  const clases = generarClases(
    data.fechas.inicio,
    data.fechas.termino,
    data.horario.sesiones
  );

  function MesCell({ unidades }: { unidades: string[] }) {
    if (!unidades.length) return <span>—</span>;
  
    return (
      <ul className="space-y-0.5 text-left list-disc ml-3">
        {unidades.map((u, i) => (
          <li key={i} className="whitespace-pre-wrap break-words">{u}</li>
        ))}
      </ul>
    );
  }

  /* ---- mapa mensual (ahora acumula) ---- */
  const months = useMemo(() => {
    type Mes = { label: string; unidades: string[] };
    const arr: Mes[] = [];

    for (let cur = startOfMonth(iniPlan); cur <= finPlan; cur = addMonths(cur, 1)) {
      arr.push({ label: format(cur, "MMM yyyy"), unidades: [] });
    }

    let cursor = new Date(iniPlan);
    (data.unidades || []).forEach((u: any) => {
      const semanas = Number(u.semanas) || 0;
      const finU    = addWeeks(cursor, semanas);

      arr.forEach((m) => {
        const rango = { start: startOfMonth(new Date(m.label)), end: endOfMonth(new Date(m.label)) };
        if (
          isWithinInterval(cursor, rango) ||
          isWithinInterval(finU, rango)
        ) {
          if (!m.unidades.includes(u.titulo)) m.unidades.push(u.titulo);
        }
      });

      cursor = finU;
    });

    return arr;
  }, [data.unidades, data.fechas.inicio, data.fechas.termino]);

  /* total recursos */
  const totalRec = (data.recursos || []).reduce(
    (s: number, r: any) => (r.disponible ? s : s + Number(r.costo || 0)),
    0
  );

  /* ------------------- UI ------------------- */
  return (
    <div className="mx-auto max-w-6xl space-y-8 rounded-2xl bg-[#131C31] p-8 text-white shadow-lg">
      <h2 className="text-2xl font-bold">Resumen general de la planificación</h2>

      {/* ---- información principal ---- */}
      <section className="grid gap-4 md:grid-cols-2">
        <ResumenBox titulo="Tipo de planificación">
          <p className="capitalize">{data.tipo?.tipo}</p>
        </ResumenBox>

        <ResumenBox titulo="Rango de fechas">
          <p><b>Inicio:</b> {fmt(data.fechas.inicio)}</p>
          <p><b>Término:</b> {fmt(data.fechas.termino)}</p>
        </ResumenBox>

        <ResumenBox titulo="Sesiones semanales" full>
          <table className="w-full text-sm">
            <thead><tr><th>Día</th><th>Inicio</th><th>Duración</th></tr></thead>
            <tbody>
              {data.horario.sesiones.map((s: any, i: number) => (
                <tr key={i}><td>{s.dia}</td><td>{s.inicio || "—"}</td><td>{s.duracion} min</td></tr>
              ))}
            </tbody>
          </table>
        </ResumenBox>

        {data.taxonomia && (
          <ResumenBox titulo="Taxonomía / Enfoque" full>
            <pre className="whitespace-pre-wrap text-sm">{data.taxonomia.descripcion}</pre>
          </ResumenBox>
        )}

        {data.objetivos && (
          <ResumenBox titulo="Objetivos seleccionados" full>
            <ul className="ml-4 list-disc space-y-1 text-sm">
              {data.objetivos.map((oa: any) => (
                <li key={oa.code}><b>{oa.code}</b> · {oa.level} — {oa.description}</li>
              ))}
            </ul>
          </ResumenBox>
        )}

        {data.unidades && (
          <ResumenBox titulo="Unidades planificadas" full>
            <ul className="ml-4 list-disc space-y-1 text-sm">
              {data.unidades.map((u: any, i: number) => (
                <li key={i}><b>{u.titulo}</b> · {u.semanas} sem<br /><i>{u.objetivos}</i></li>
              ))}
            </ul>
          </ResumenBox>
        )}

        {data.actividades && (
          <ResumenBox titulo="Actividades programadas" full>
            <ul className="ml-4 list-disc space-y-1 text-sm">
              {data.actividades.map((a: any, i: number) => (
                <li key={i}><b>{a.nombre}</b>: {a.detalle || "—"}</li>
              ))}
            </ul>
          </ResumenBox>
        )}

        {data.evaluaciones && (
          <ResumenBox titulo="Evaluaciones planificadas" full>
            <table className="w-full text-sm">
              <thead><tr><th>Tipo</th><th>Cant.</th></tr></thead>
              <tbody>
                {data.evaluaciones.map((e: any, i: number) => (
                  <tr key={i}><td>{e.nombre}</td><td>{e.cantidad}</td></tr>
                ))}
              </tbody>
            </table>
          </ResumenBox>
        )}

        {data.recursos && (
          <ResumenBox titulo="Recursos y presupuesto" full>
            <p className="font-semibold">
              Total solicitado:&nbsp;
              {totalRec.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
            </p>
            <ul className="ml-4 list-disc text-sm">
              {data.recursos.map((r: any, i: number) => (
                <li key={i}>
                  {r.nombre} —{" "}
                  {r.disponible
                    ? "Disponible"
                    : Number(r.costo).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
                </li>
              ))}
            </ul>
          </ResumenBox>
        )}
      </section>

      {/* ---- mapa mensual ---- */}
      <section>
  <h3 className="mb-2 text-lg font-semibold">Mapa mensual (macro)</h3>
  <table className="w-full text-sm border border-slate-600">
    <thead className="bg-slate-800">
      <tr>
        {months.map((m, i) => (
          <th key={i} className="px-2 py-1">{m.label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        {months.map((m, i) => (
          <td
            key={i}
            className="px-2 py-2 align-top border border-slate-700"
            /* alto mínimo para aire */
            style={{ minWidth: "10rem" }}
          >
            <MesCell unidades={m.unidades} />
          </td>
        ))}
      </tr>
    </tbody>
  </table>
</section>

      {/* ---- calendario ---- */}
      <section>
        <h3 className="mb-2 text-lg font-semibold">Calendario de clases ({clases.length})</h3>
        <div className="max-h-[50vh] overflow-y-auto rounded border border-slate-700">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-800"><tr><th>Fecha</th><th>Día</th><th>Inicio</th><th>Duración</th></tr></thead>
            <tbody>
              {clases.map((c) => (
                <tr key={c.fecha + c.inicio} className="border-t border-slate-700">
                  <td>{fmt(c.fecha)}</td><td>{c.dia}</td><td>{c.inicio || "—"}</td><td>{c.duracion} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex justify-between">
        <button onClick={back} className="rounded border border-gray-500 px-6 py-2 hover:bg-gray-700">← Atrás</button>
        <button onClick={next} className="flex items-center gap-1 rounded bg-green-600 px-6 py-2 hover:bg-green-700">
          Finalizar <ChevronsRight size={18}/>
        </button>
      </div>
    </div>
  );
}
