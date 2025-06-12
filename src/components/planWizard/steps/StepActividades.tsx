"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useWizard } from "../WizardProvider";
import { Button } from "@/components/ui/Button";
import { FiPlus, FiTrash, FiZap } from "react-icons/fi";

/* :::::::::::::::::::::::::::::::::::::::::::::::::::
   TYPES
::::::::::::::::::::::::::::::::::::::::::::::::::: */
interface Actividad {
  nombre: string;
  detalle?: string;
}

/* :::::::::::::::::::::::::::::::::::::::::::::::::::
   COMPONENT
::::::::::::::::::::::::::::::::::::::::::::::::::: */
export default function StepActividades() {
  const { saveStep, next, back, getStep } = useWizard();

  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loadingIA, setLoadingIA] = useState(false);

  /* ───────────────── helpers ───────────────── */
  const agregarActividad = () =>
    setActividades([...actividades, { nombre: "", detalle: "" }]);

  const quitarActividad = (index: number) =>
    setActividades(actividades.filter((_, i) => i !== index));

  const actualizarActividad = (
    index: number,
    field: keyof Actividad,
    value: string
  ) => {
    const tmp = [...actividades];
    tmp[index][field] = value;
    setActividades(tmp);
  };

  /* ───────────────── IA ───────────────── */
  const generarActividadesConIA = async () => {
    setLoadingIA(true);
    try {
      const tipo = getStep("tipo");
      const unidades = getStep("unidades") || [];

      const unidadesList = unidades
        .map((u: any) => `- ${u.titulo} (${u.semanas} semanas)`) // string list
        .join("\\n");

      const prompt = `Eres un experto en didáctica. Sugiere actividades variadas y eficaces para la asignatura "${tipo?.asignatura}".\nConsidera estas unidades:\n${unidadesList}\n\nDevuelve SOLO un array JSON:\n[ { \"nombre\": \"...\", \"detalle\": \"...\" } ]`;

      const res = await fetch("/api/enviarPromptDeepSeek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const raw = await res.text();

      // Si la respuesta HTTP no fue 200, mostramos error textual
      if (!res.ok) {
        console.error("IA error:", raw);
        alert("Error de la IA: " + raw);
        return;
      }

      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        console.error("Respuesta IA no es JSON:", raw);
        alert("La IA devolvió un formato inesperado. Intenta nuevamente.");
        return;
      }

      const match = data.reply?.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (!match) {
        console.error("No se encontró JSON de actividades:", data.reply);
        alert("La IA no devolvió actividades válidas.");
        return;
      }

      const sugeridas: Actividad[] = JSON.parse(match[0]);
      setActividades(sugeridas);
    } catch (err) {
      console.error("Error IA actividades:", err);
      alert("Ocurrió un problema al generar actividades automáticamente.");
    } finally {
      setLoadingIA(false);
    }
  };

  /* ───────────────── NEXT ───────────────── */
  const handleNext = () => {
    if (actividades.length === 0) {
      alert("Debes ingresar al menos una actividad.");
      return;
    }
    saveStep("actividades", actividades);
    next();
  };

  /* ───────────────── UI ───────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl rounded-2xl bg-[#131C31] p-8 text-white shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold">Paso · Actividades de clase</h2>

      <Button
        onClick={generarActividadesConIA}
        variant="ghost"
        disabled={loadingIA}
        className="text-blue-300 flex items-center gap-2 cursor-pointer"
      >
        <FiZap className={loadingIA ? "animate-spin" : ""} /> Generar con IA
      </Button>

      {actividades.map((act, idx) => (
        <div key={idx} className="bg-slate-800 p-4 rounded-lg shadow space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Actividad {idx + 1}</h4>
            <button
              onClick={() => quitarActividad(idx)}
              className="text-red-400 hover:text-red-600 cursor-pointer"
            >
              <FiTrash />
            </button>
          </div>
          <input
            placeholder="Nombre de la actividad"
            className="w-full rounded bg-slate-700 text-sm p-2"
            value={act.nombre}
            onChange={(e) => actualizarActividad(idx, "nombre", e.target.value)}
          />
          <textarea
            placeholder="Detalle (opcional)"
            className="w-full rounded bg-slate-700 text-sm p-2"
            value={act.detalle || ""}
            onChange={(e) => actualizarActividad(idx, "detalle", e.target.value)}
          />
        </div>
      ))}

      <Button onClick={agregarActividad} variant="outline" className="mt-2 cursor-pointer">
        <FiPlus className="inline mr-2" /> Agregar Actividad
      </Button>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={back}
          className="rounded border border-gray-500 px-6 py-2 transition-colors hover:bg-gray-700 cursor-pointer"
        >
          ← Atrás
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="rounded bg-blue-600 px-6 py-2 transition-colors hover:bg-blue-700 cursor-pointer"
        >
          Siguiente →
        </button>
      </div>
    </motion.div>
  );
}
