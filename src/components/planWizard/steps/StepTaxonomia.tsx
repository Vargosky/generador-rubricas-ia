"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useWizard } from "../WizardProvider";
import { BookMarked } from "lucide-react";

export default function StepTaxonomia() {
  const { saveStep, next, back } = useWizard();
  const [taxonomia, setTaxonomia] = useState("bloom");

  const handleNext = () => {
    saveStep("taxonomia", taxonomia);
    next();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl rounded-2xl bg-[#131C31] p-8 text-white shadow-lg space-y-6"
    >
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        <BookMarked className="text-blue-400" size={28} />
        Paso · Selección de Taxonomía
      </h2>

      <p className="text-sm text-gray-300">
        Selecciona una taxonomía para orientar el diseño de tus actividades, evaluaciones y progresión de habilidades cognitivas.
      </p>

      <div className="space-y-4">
        <label className="flex items-start gap-3 bg-slate-800 rounded p-4 cursor-pointer hover:ring hover:ring-blue-500">
          <input
            type="radio"
            name="taxonomia"
            value="bloom"
            checked={taxonomia === "bloom"}
            onChange={(e) => setTaxonomia(e.target.value)}
          />
          <div>
            <strong>Taxonomía de Bloom</strong>
            <p className="text-xs text-gray-400">
              Enfocada en niveles como Recordar, Comprender, Aplicar, Analizar, Evaluar y Crear.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 bg-slate-800 rounded p-4 cursor-pointer hover:ring hover:ring-blue-500">
          <input
            type="radio"
            name="taxonomia"
            value="marzano"
            checked={taxonomia === "marzano"}
            onChange={(e) => setTaxonomia(e.target.value)}
          />
          <div>
            <strong>Taxonomía de Marzano</strong>
            <p className="text-xs text-gray-400">
              Clasifica habilidades en tres sistemas: conocimiento, procesos mentales y metacognición.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 bg-slate-800 rounded p-4 cursor-pointer hover:ring hover:ring-blue-500">
          <input
            type="radio"
            name="taxonomia"
            value="ninguna"
            checked={taxonomia === "ninguna"}
            onChange={(e) => setTaxonomia(e.target.value)}
          />
          <div>
            <strong>No usar taxonomía</strong>
            <p className="text-xs text-gray-400">Las actividades y evaluaciones se planificarán sin una referencia cognitiva específica.</p>
          </div>
        </label>
      </div>

      {/* navegación */}
      <div className="flex justify-between pt-4">
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
          Siguiente
        </button>
      </div>
    </motion.div>
  );
}
