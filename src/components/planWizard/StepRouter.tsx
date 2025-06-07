"use client";
import { useWizard } from "./WizardProvider";
import StepBienvenida from "./steps/StepBienvenida";
import StepFechas from "./steps/StepFechas";
import StepHorario from "./steps/StepHorario";

const steps = [
  { id: "bienvenida", comp: StepBienvenida },
  { id: "fechas", comp: StepFechas },
  { id: "horario", comp: StepHorario },
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
