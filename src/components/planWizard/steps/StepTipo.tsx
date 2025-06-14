/* StepTipo.tsx – elige Plan Anual / Unidad / Semanal y guarda objeto { tipo: "..." } */
"use client";
import { useWizard } from "../WizardProvider";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function StepTipo() {
  const { saveStep, next, back } = useWizard();

  const opciones: { label: string; value: "Anual" | "xUnidad" | "xClases" }[] = [
    { label: "Plan Anual",    value: "Anual"   },
    { label: "Planificación Unidad", value: "xUnidad" },
    { label: "Plan Semanal",  value: "xClases" },
  ];

  const setTipo = (value: "Anual" | "xUnidad" | "xClases") => {
    /* Guardamos un objeto, así StepResumen puede acceder a .tipo */
    saveStep("tipo", { tipo: value });
    next();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md space-y-6 rounded-xl bg-[#1E293B] p-8 text-gray-100 shadow-lg">
      <h2 className="text-center text-2xl font-semibold mb-4">¿Qué tipo de planificación deseas crear?</h2>

      {opciones.map((o) => (
        <Button key={o.value} onClick={() => setTipo(o.value)} className="w-full" variant="default">
          {o.label}
        </Button>
      ))}

      <Button onClick={back} variant="outline" className="w-full">← Atrás</Button>
    </motion.div>
  );
}
