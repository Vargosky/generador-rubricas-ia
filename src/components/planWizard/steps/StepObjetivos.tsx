/* StepObjetivos.tsx – guarda la asignatura en el wizard */
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, ChevronsRight, BookOpenText } from "lucide-react";
import { useWizard } from "../WizardProvider";

/* ─────────────── ajustes ─────────────── */
const ASIGNATURAS = [
  "artes_visuales",
  "ciencias_naturales",
  "educacion_fisica",
  "historia",
  "musica",
  "orientacion",
  "tecnologia",
] as const;

const NIVELES = ["1M", "2M", "3M", "4M"] as const;

/* ─────────────── tipos ─────────────── */
type OA = { level: string; code: string; description: string };

export default function StepObjetivos() {
  const { saveStep, next, back, getStep } = useWizard();

  /* ───── estado local ───── */
  const [asignatura, setAsignatura] = useState<string>(
    (getStep("asignatura") as string) ?? ""
  );
  const [nivel, setNivel] = useState<string>("");
  const [objetivos, setObjetivos] = useState<OA[]>([]);
  const [seleccionados, setSeleccionados] = useState<OA[]>(
    (getStep("objetivos") as OA[]) || []
  );
  const [error, setError] = useState("");

  /* ───── carga JSON OA según asignatura ───── */
  useEffect(() => {
    if (!asignatura) {
      setObjetivos([]);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/data/AsiganturasOA/${asignatura}.json`);
        const data: OA[] = await res.json();
        setObjetivos(data);
        setNivel(""); // reinicia selección de nivel
      } catch (err) {
        console.error(err);
        setObjetivos([]);
      }
    })();
  }, [asignatura]);

  /* ───── helpers selección OA ───── */
  const toggleOA = (oa: OA) => {
    setSeleccionados((prev) => {
      const exists = prev.some(
        (o) => o.code === oa.code && o.level === oa.level
      );
      return exists
        ? prev.filter((o) => o.code !== oa.code || o.level !== oa.level)
        : [...prev, oa];
    });
  };

  /* ───── guardar y continuar ───── */
  const submit = () => {
    if (!seleccionados.length) {
      setError("Elige al menos un objetivo");
      return;
    }
    saveStep("asignatura", asignatura);      // ① persiste asignatura
    saveStep("objetivos", seleccionados);    // ② persiste OA
    next();
  };

  /* ───── render OA filtrados ───── */
  const objetivosFiltrados = nivel
    ? objetivos.filter((o) => (o.level ?? (o as any).nivel) === nivel)
    : [];

  /* ───── UI ───── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl space-y-8 rounded-2xl bg-[#131C31] p-8 text-white shadow-lg"
    >
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        <BookOpenText size={28} className="text-blue-400" />
        Paso 4 · Objetivos de aprendizaje
      </h2>

      {/* ─── selectores ─── */}
      <div className="flex flex-wrap gap-4">
        {/* Asignatura */}
        <select
          value={asignatura}
          onChange={(e) => {
            setAsignatura(e.target.value);
            saveStep("asignatura", e.target.value);
          }}
          className="rounded bg-slate-800 p-2"
        >
          <option value="">-- Asignatura --</option>
          {ASIGNATURAS.map((a) => (
            <option key={a} value={a}>
              {a.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>

        {/* Nivel */}
        {asignatura && (
          <select
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            className="rounded bg-slate-800 p-2"
          >
            <option value="">-- Nivel --</option>
            {NIVELES.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        )}
      </div>

      {/* ─── tabla OA ─── */}
      {nivel && (
        <div className="overflow-x-auto rounded border border-slate-700">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800 text-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">Código</th>
                <th className="px-4 py-2 text-left">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {objetivosFiltrados.map((oa) => {
                const activo = seleccionados.some(
                  (o) => o.code === oa.code && o.level === oa.level
                );
                return (
                  <tr
                    key={oa.code}
                    onClick={() => toggleOA(oa)}
                    className={`cursor-pointer border-t border-slate-700 ${
                      activo ? "bg-slate-700/60" : "hover:bg-slate-800"
                    }`}
                  >
                    <td className="px-4 py-2">{oa.code}</td>
                    <td className="px-4 py-2">{oa.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── OA seleccionados ─── */}
      {seleccionados.length > 0 && (
        <div className="space-y-2">
          <p className="font-medium">Objetivos seleccionados:</p>
          <ul className="flex flex-wrap gap-2">
            {seleccionados.map((oa) => (
              <li
                key={`${oa.level}-${oa.code}`}
                className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-sm"
              >
                <span>
                  {oa.code} · {oa.level}
                </span>
                <button
                  onClick={() => toggleOA(oa)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* ─── navegación ─── */}
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
          onClick={submit}
          className="flex items-center gap-1 rounded bg-blue-600 px-6 py-2 transition-colors hover:bg-blue-700"
        >
          Siguiente <ChevronsRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
