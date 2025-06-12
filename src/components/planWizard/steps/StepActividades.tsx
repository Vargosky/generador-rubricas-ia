"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useWizard } from "../WizardProvider";
import { Button } from "@/components/ui/Button";
import { FiPlus, FiTrash, FiZap } from "react-icons/fi";

type Actividad = {
  nombre: string;
  detalle?: string;
};

export default function StepActividades() {
  const { saveStep, next, back, getStep } = useWizard();

  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loadingIA, setLoadingIA] = useState(false);

  const agregarActividad = () => {
    setActividades([...actividades, { nombre: "", detalle: "" }]);
  };

  const quitarActividad = (index: number) => {
    setActividades(actividades.filter((_, i) => i !== index));
  };

  const actualizarActividad = (index: number, field: keyof Actividad, value: string) => {
    const nuevas = [...actividades];
    nuevas[index][field] = value;
    setActividades(nuevas);
  };

  const generarActividadesConIA = async () => {
    setLoadingIA(true);
    try {
      const tipo = getStep("tipo");
      const unidades = getStep("unidades") || [];

      const prompt = `Eres un experto en didáctica. Sugiere una lista de actividades didácticas variadas y eficaces para desarrollar la asignatura "${tipo?.asignatura}".
      Considera estas unidades:
      ${unidades.map((u: any) => `- ${u.titulo} (${u.semanas} semanas)`).join("\n")}

      Devuelve un array JSON con actividades variadas:
      [
        { "nombre": "...", "detalle": "..." },
        ...
      ]`;

      const res = await fetch("/api/enviarPromptDeepSeek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const match = data.reply?.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (!match) throw new Error("Respuesta inválida");

      const sugeridas: Actividad[] = JSON.parse(match[0]);
      setActividades(sugeridas);
    } catch (err) {
      console.error("Error IA actividades:", err);
      alert("Ocurrió un problema al generar las actividades automáticamente.");
    } finally {
      setLoadingIA(false);
    }
  };

  const handleNext = () => {
    if (actividades.length === 0) {
      alert("Debes ingresar al menos una actividad.");
      return;
    }
    saveStep("actividades", actividades);
    next();
  };

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
        className="text-blue-300 flex items-center gap-2"
      >
        <FiZap className={loadingIA ? "animate-spin" : ""} /> Generar con IA
      </Button>

      {actividades.map((actividad, index) => (
        <div
          key={index}
          className="bg-slate-800 p-4 rounded-lg shadow space-y-2"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Actividad {index + 1}</h4>
            <button onClick={() => quitarActividad(index)} className="text-red-400 hover:text-red-600">
              <FiTrash />
            </button>
          </div>
          <input
            placeholder="Nombre de la actividad"
            className="w-full rounded bg-slate-700 text-sm p-2"
            value={actividad.nombre}
            onChange={(e) => actualizarActividad(index, "nombre", e.target.value)}
          />
          <textarea
            placeholder="Detalle (opcional)"
            className="w-full rounded bg-slate-700 text-sm p-2"
            value={actividad.detalle || ""}
            onChange={(e) => actualizarActividad(index, "detalle", e.target.value)}
          />
        </div>
      ))}

      <Button onClick={agregarActividad} variant="outline" className="mt-2">
        <FiPlus className="inline mr-2" /> Agregar Actividad
      </Button>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={back}
          className="rounded border border-gray-500 px-6 py-2 transition-colors hover:bg-gray-700"
        >
          ← Atrás
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="rounded bg-blue-600 px-6 py-2 transition-colors hover:bg-blue-700"
        >
          Siguiente →
        </button>
      </div>
    </motion.div>
  );
}
