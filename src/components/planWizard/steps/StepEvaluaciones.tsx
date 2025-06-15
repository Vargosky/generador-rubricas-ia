/* StepEvaluaciones.tsx – ahora con IA y evaluación diagnóstica */
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { addDays, parseISO } from "date-fns";
import { FiPlus, FiTrash, FiZap } from "react-icons/fi";
import { useWizard } from "../WizardProvider";
import { Button } from "@/components/ui/Button";
import { tiposEvaluacion } from "@/data/tiposEvaluacion";

/* ----- Tipos ----- */
interface Evaluacion {
  nombre: string;
  detalle: string;
  cantidad: number;
  fecha: string;       // ISO
  instrumento: string;
  ponderacion: number;
}

/* rutas API */
const ROUTES = {
  deepSeek: "/api/enviarPromptDeepSeek",
  gemini: "/api/enviarPromptGemini",
} as const;

export default function StepEvaluaciones() {
  const { saveStep, next, back, getStep } = useWizard();

  /* datos previos */
  const objetivos = getStep("objetivos") ?? [];
  const fechas = getStep("fechas") ?? {};
  const tipo = getStep("tipo") ?? {};          // ← ya se guardó en StepTipo
  const asignatura = (tipo.asignatura || "").toLowerCase();

  /* estado UI */
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>(getStep("evaluaciones") || []);
  const [loadingIA, setLoadingIA] = useState(false);
  const [provider, setProvider] = useState<"deepSeek" | "gemini">("deepSeek");

  /* helpers CRUD */
  const addEmpty = () =>
    setEvaluaciones([
      ...evaluaciones,
      {
        nombre: "",
        detalle: "",
        cantidad: 1,
        fecha: "",
        instrumento: "Prueba",
        ponderacion: 0,
      },
    ]);

  const update = (i: number, field: keyof Evaluacion, v: any) =>
    setEvaluaciones((ev) => ev.map((e, idx) => idx === i ? { ...e, [field]: v } : e));

  const remove = (i: number) =>
    setEvaluaciones((ev) => ev.filter((_, idx) => idx !== i));

  /* ------------ IA ------------- */
  const generarConIA = async () => {
    if (!objetivos.length) {
      alert("Necesitas OA para proponer evaluaciones.");
      return;
    }
    if (!fechas.inicio || !fechas.termino) {
      alert("Debes definir rango de fechas primero.");
      return;
    }

    setLoadingIA(true);
    try {
      const oaTxt = objetivos.map((oa: any) => `- ${oa.code}: ${oa.description}`).join("\n");

      const prompt = `
      Eres un coordinador pedagógico. Diseña un calendario de evaluaciones para el periodo ${fechas.inicio} ➜ ${fechas.termino} ${
        asignatura.match(/arte|música|musica|tecnolog/) 
          ? "La asignatura es eminentemente práctica; evita pruebas escritas y prefiere rúbricas, portafolios, proyectos o presentaciones."
          : ""
      }.
      Incluye:
      • 1 evaluación diagnóstica dentro de los primeros 10 días.
      • Evaluaciones formativas y sumativas equilibradas (instrumento y % sugerido).
      • Última evaluación al menos 1 semana antes de ${fechas.termino}.
      
      Devuelve SOLO JSON:
      [
        {
          "nombre": "Diagnóstico inicial",
          "detalle": "...",
          "cantidad": 1,
          "fecha": "2025-03-05",
          "instrumento": "Portafolio",
          "ponderacion": 0
        },
        ...
      ]`;

      const res = await fetch(ROUTES[provider], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const match = data.reply?.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (!match) throw new Error("La IA no devolvió JSON válido.");

      /* normaliza fechas y números */
      const plan: Evaluacion[] = JSON.parse(match[0]).map((e: any) => ({
        nombre: e.nombre ?? "",
        detalle: e.detalle ?? "",
        cantidad: Number(e.cantidad || 1),
        fecha: e.fecha ?? "",
        instrumento: e.instrumento ?? "Prueba",
        ponderacion: Number(e.ponderacion || 0),
      }));

      setEvaluaciones(plan);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoadingIA(false);
    }
  };

  /* guardar y validar */
  const handleNext = () => {
    if (!evaluaciones.length) return alert("Añade al menos una evaluación.");
    const inval = evaluaciones.find(
      (e) => !e.nombre.trim() || !e.fecha || e.ponderacion < 0
    );
    if (inval) return alert("Revisa nombre, fecha y ponderación.");
    saveStep("evaluaciones", evaluaciones);
    next();
  };

  /* ---------- UI ---------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl space-y-6 rounded-2xl bg-[#131C31] p-8 text-white shadow-lg"
    >
      <h2 className="text-2xl font-bold">Paso · Evaluaciones</h2>

      {/* proveedor IA */}
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={provider === "deepSeek"}
            onChange={() => setProvider("deepSeek")}
          />{" "}
          ChatGPT
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={provider === "gemini"}
            onChange={() => setProvider("gemini")}
          />{" "}
          Gemini
        </label>
      </div>

      <Button
        onClick={generarConIA}
        variant="ghost"
        disabled={loadingIA}
        className="flex items-center gap-2 text-blue-400"
      >
        <FiZap className={loadingIA ? "animate-spin" : ""} /> Generar con IA
      </Button>

      {/* objetivos list */}
      <div>
        <h3 className="text-lg font-semibold mb-1">OA a evaluar</h3>
        {objetivos.length === 0 ? (
          <p className="text-sm text-gray-400">No hay OA seleccionados.</p>
        ) : (
          <ul className="ml-5 list-disc text-sm text-blue-200 space-y-1">
            {objetivos.map((oa: any) => (
              <li key={oa.code}>
                <span className="font-semibold text-blue-300">{oa.code}</span> —{" "}
                {oa.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* evaluaciones list */}
      <div className="space-y-3">
        {evaluaciones.map((e, idx) => (
          <div key={idx} className="bg-slate-800 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <input
                value={e.nombre}
                onChange={(ev) => update(idx, "nombre", ev.target.value)}
                placeholder="Nombre evaluación"
                className="flex-1 mr-2 rounded bg-slate-700 p-2 text-sm"
              />
              <button
                onClick={() => remove(idx)}
                className="text-red-400 hover:text-red-600"
              >
                <FiTrash />
              </button>
            </div>

            <textarea
              value={e.detalle}
              onChange={(ev) => update(idx, "detalle", ev.target.value)}
              placeholder="Detalle (opcional)"
              className="w-full rounded bg-slate-700 p-2 text-sm"
            />

            <div className="grid md:grid-cols-4 gap-2 text-sm">
              <input
                type="date"
                value={e.fecha}
                onChange={(ev) => update(idx, "fecha", ev.target.value)}
                className="rounded bg-slate-700 p-2"
              />

              <select
                value={e.instrumento}
                onChange={(ev) => update(idx, "instrumento", ev.target.value)}
                className="rounded bg-slate-700 p-2"
              >
                {tiposEvaluacion.map((te) => (
                  <option key={te.nombre} value={te.nombre}>
                    {te.nombre}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min={1}
                value={e.cantidad}
                onChange={(ev) =>
                  update(idx, "cantidad", Number(ev.target.value))
                }
                className="rounded bg-slate-700 p-2"
                placeholder="Cantidad"
              />

              <input
                type="number"
                min={0}
                max={100}
                value={e.ponderacion}
                onChange={(ev) =>
                  update(idx, "ponderacion", Number(ev.target.value))
                }
                className="rounded bg-slate-700 p-2"
                placeholder="%"
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={addEmpty}
        variant="outline"
        className="flex items-center gap-2"
      >
        <FiPlus /> Agregar evaluación
      </Button>

      <div className="flex justify-between pt-5">
        <Button variant="ghost" onClick={back}>
          ← Atrás
        </Button>
        <Button onClick={handleNext}>Siguiente →</Button>
      </div>
    </motion.div>
  );
}
