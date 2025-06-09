"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useWizard } from "../WizardProvider";
import { tiposActividades } from "@/data/tiposActividades";

type Actividad = {
  nombre: string;
  detalle?: string;
};

export default function StepActividades() {
  const { saveStep, next, back } = useWizard();

  const [modoAutomatico, setModoAutomatico] = useState(true);
  const [actividades, setActividades] = useState<Actividad[]>([]);

  const actividadesPorDefecto: Actividad[] = [
    { nombre: "Introducción teórica" },
    { nombre: "Actividad práctica" },
    { nombre: "Reflexión final" },
  ];

  const toggleActividad = (nombre: string) => {
    setActividades((prev) => {
      const existe = prev.find((a) => a.nombre === nombre);
      return existe
        ? prev.filter((a) => a.nombre !== nombre)
        : [...prev, { nombre }];
    });
  };

  const updateDetalle = (nombre: string, detalle: string) => {
    setActividades((prev) =>
      prev.map((a) =>
        a.nombre === nombre ? { ...a, detalle } : a
      )
    );
  };

  const handleNext = () => {
    const final = modoAutomatico || actividades.length === 0
      ? actividadesPorDefecto
      : actividades;

    saveStep("actividades", final);
    next();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl rounded-2xl bg-[#131C31] p-8 text-white shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold">Paso · Actividades de clase</h2>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={modoAutomatico}
          onChange={(e) => {
            setModoAutomatico(e.target.checked);
            if (e.target.checked) setActividades([]);
          }}
        />
        Selección automática de actividades
      </label>

      {!modoAutomatico && (
        <div className="space-y-4">
          {tiposActividades.map(({ nombre, descripcion }) => {
            const seleccionada = actividades.find((a) => a.nombre === nombre);
            return (
              <div key={nombre} className="space-y-1 group">
                <label
                  title={descripcion}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
                    ${seleccionada ? "bg-blue-700" : "bg-slate-800"}
                    group-hover:ring-1 group-hover:ring-blue-400`}
                >
                  <input
                    type="checkbox"
                    checked={!!seleccionada}
                    onChange={() => toggleActividad(nombre)}
                  />
                  <span className="relative group-hover:underline">
                    {nombre}
                  </span>
                </label>

                {seleccionada && (
                  <textarea
                    placeholder="Especifica detalles (opcional)"
                    className="w-full rounded bg-slate-700 text-sm p-2"
                    value={seleccionada.detalle || ""}
                    onChange={(e) =>
                      updateDetalle(nombre, e.target.value)
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

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
