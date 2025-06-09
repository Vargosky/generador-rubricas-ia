"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useWizard } from "../WizardProvider";
import { tiposEvaluacion } from "@/data/tiposEvaluacion";

type Evaluacion = {
  nombre: string;
  detalle?: string;
  cantidad: number;
};

export default function StepEvaluaciones() {
  const { saveStep, next, back, getStep } = useWizard();
  const objetivosSeleccionados = getStep("objetivos") ?? [];

  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);

  const toggleEvaluacion = (nombre: string) => {
    setEvaluaciones((prev) => {
      const existe = prev.find((e) => e.nombre === nombre);
      return existe
        ? prev.filter((e) => e.nombre !== nombre)
        : [...prev, { nombre, cantidad: 1 }];
    });
  };

  const updateDetalle = (nombre: string, detalle: string) => {
    setEvaluaciones((prev) =>
      prev.map((e) =>
        e.nombre === nombre ? { ...e, detalle } : e
      )
    );
  };

  const updateCantidad = (nombre: string, cantidad: number) => {
    setEvaluaciones((prev) =>
      prev.map((e) =>
        e.nombre === nombre ? { ...e, cantidad } : e
      )
    );
  };

  const handleNext = () => {
    saveStep("evaluaciones", evaluaciones);
    next();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl rounded-2xl bg-[#131C31] p-8 text-white shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold">Paso · Evaluaciones</h2>

      {/* Objetivos seleccionados */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Objetivos de Aprendizaje a Evaluar:</h3>
        {objetivosSeleccionados.length === 0 ? (
          <p className="text-sm text-gray-400">No se han seleccionado objetivos aún.</p>
        ) : (
          <ul className="list-disc pl-6 text-sm text-blue-200 space-y-1">
            {objetivosSeleccionados.map((oa: any, i: number) => (
              <li key={`${oa.level}-${oa.code}`}>
                <span className="font-semibold text-blue-300">{oa.code} · {oa.level}:</span>{" "}
                {oa.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tipos de evaluación */}
      <div className="space-y-4">
        {tiposEvaluacion.map(({ nombre, descripcion }) => {
          const evaluacion = evaluaciones.find((e) => e.nombre === nombre);
          return (
            <div key={nombre} className="space-y-1 group">
              <label
                title={descripcion}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
                  ${evaluacion ? "bg-blue-700" : "bg-slate-800"}
                  group-hover:ring-1 group-hover:ring-blue-400`}
              >
                <input
                  type="checkbox"
                  checked={!!evaluacion}
                  onChange={() => toggleEvaluacion(nombre)}
                />
                <span className="group-hover:underline">{nombre}</span>
              </label>

              {evaluacion && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <textarea
                    placeholder="Detalles (opcional)"
                    className="w-full rounded bg-slate-700 text-sm p-2"
                    value={evaluacion.detalle || ""}
                    onChange={(e) => updateDetalle(nombre, e.target.value)}
                  />
                  <input
                    type="number"
                    min={1}
                    className="w-full rounded bg-slate-700 text-sm p-2"
                    value={evaluacion.cantidad}
                    onChange={(e) => updateCantidad(nombre, parseInt(e.target.value))}
                    placeholder="Cantidad"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botones de navegación */}
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
