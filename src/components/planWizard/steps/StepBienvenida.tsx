/* components/planWizard/steps/StepBienvenida.tsx */
"use client";

import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";

type StepBienvenidaProps = {
  onNext: () => void;               // función que avanza al siguiente paso
};

export default function StepBienvenida({ onNext }: StepBienvenidaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-xl bg-[#131C31] text-white rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-6"
    >
      <CalendarClock className="h-12 w-12 text-blue-400" />

      <h1 className="text-3xl font-bold text-center">
        ¡Bienvenido al asistente de planificación!
      </h1>

      <div className="text-gray-300 space-y-4 leading-relaxed">
        <p className="text-center">
          Este proceso se divide en&nbsp;
          <span className="font-semibold text-blue-300">etapas guiadas</span>:
        </p>

        <ol className="list-decimal list-inside space-y-2 marker:text-blue-400">
          <li>
            <span className="font-semibold text-blue-300">Fechas clave</span>:
            indicaremos el año escolar y rangos importantes.
          </li>
          <li>
            <span className="font-semibold text-blue-300">Horario semanal</span>:
            día, duración y hora de inicio de cada sesión.
          </li>
          <li>
            <span className="font-semibold text-blue-300">Asignatura&nbsp;y&nbsp;tipo de planificación</span>:
            anual, inversa o semanal.
          </li>
        </ol>

        <p className="text-center">
          Con esa información el sistema&nbsp;
          <span className="font-semibold text-blue-300">construirá un plan anual de referencia</span>.  
          Después la IA generará la planificación detallada de <em>cada clase</em>,
          pruebas y trabajos, guiándote en todo momento.
        </p>

        <p className="text-center">
          ¿Listo para comenzar? Siempre podrás&nbsp;
          <span className="font-semibold text-blue-300">ajustar fechas o sesiones</span> antes de confirmar.
        </p>
      </div>

      <button
        onClick={onNext}
        className="mt-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition"
      >
        Comenzar
      </button>
    </motion.div>
  );
}
