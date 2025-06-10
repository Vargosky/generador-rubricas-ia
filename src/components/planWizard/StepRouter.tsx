// StepRouter.tsx
"use client";
import { useWizard } from "./WizardProvider";
import StepBienvenida from "./steps/StepBienvenida";
import StepFechas from "./steps/StepFechas";
import StepHorario from "./steps/StepHorario";
import StepResumen from "./steps/StepResumen";
import StepTipo from "./steps/StepTipo";
import StepObjetivos from "./steps/StepObjetivos";
import StepActividades from "./steps/StepActividades";
import StepEvaluaciones from "./steps/StepEvaluaciones";
import StepTaxonomia from "./steps/StepTaxonomia";

const steps = [
  { id: "bienvenida", comp: StepBienvenida },
  { id: "tipo", comp: StepTipo },
  { id: "objetivos", comp: StepObjetivos },
  { id: "taxonomia", comp: StepTaxonomia },
  { id: "fechas", comp: StepFechas },
  { id: "horario", comp: StepHorario },
  { id: "actividades", comp: StepActividades },
  { id: "evaluaciones", comp: StepEvaluaciones },
  { id: "resumen", comp: StepResumen },

];




export default function StepRouter() {
  const { stepIndex, next } = useWizard();
  const step = steps[stepIndex];

  if (!step) return <p className="text-white">¡Wizard completo!</p>;

  if (step.id === "bienvenida") {
    return <step.comp onNext={next} />;          {/* prop obligatoria */}
  }

  const StepComp = step.comp as React.ComponentType;
  return <StepComp />;
}
 