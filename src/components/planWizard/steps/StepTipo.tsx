/* src/components/planWizard/steps/StepTipo.tsx */
"use client";
import { useWizard } from "../WizardProvider";

export default function StepTipo() {
  // Asegúrate de que WizardProvider exponga también `back`
  const { saveStep, next, back } = useWizard();

  const setTipo = (tipo: "general" | "inverso" | "semanal") => {
    saveStep("tipo", tipo);
    next();
  };

  return (
    <div className="mx-auto max-w-md rounded-xl bg-[#1E293B] p-8 text-gray-100 space-y-6">
      <h2 className="text-center text-2xl font-semibold">
        ¿Qué tipo de planificación deseas crear?
      </h2>

      <button
        onClick={() => setTipo("general")}
        className="w-full rounded-lg bg-sky-700 py-3 transition-colors hover:bg-sky-600"
      >
        Plan General (anual / unidad)
      </button>

      <button
        onClick={() => setTipo("inverso")}
        className="w-full rounded-lg bg-emerald-700 py-3 transition-colors hover:bg-emerald-600"
      >
        Planificación Inversa
      </button>

      <button
        onClick={() => setTipo("semanal")}
        className="w-full rounded-lg bg-violet-700 py-3 transition-colors hover:bg-violet-600"
      >
        Plan Semanal
      </button>

      {/* Botón Atrás */}
      <button
        onClick={back}
        className="w-full rounded-lg border border-gray-500 py-3 transition-colors hover:bg-gray-700"
      >
        ← Atrás
      </button>
    </div>
  );
}
