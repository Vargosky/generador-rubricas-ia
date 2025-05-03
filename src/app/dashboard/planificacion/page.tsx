"use client"
import PlanificacionForm from "@/components/PlanificacionForm";
import ClasesBox from "@/app/components/cards/ClasesBox";
import { usePlanificacion } from "@/hooks/usePlanificacion";

export default function PlanificacionPage() {
  const plan = usePlanificacion();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-2xl">
      <PlanificacionForm {...plan} />
      <ClasesBox clases={plan.clases} asignatura={plan.asignatura} onGenerate={plan.generarGuion} />
      {/* Puedes agregar el componente PromptDebug más adelante */}
      {plan.clases.length > 0 && (
        <button
          onClick={plan.exportarDocx}
          className="mt-8 px-4 py-2 rounded text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          📄 Descargar planificación .docx
        </button>
      )}

    </div>
  );
}
