/* app/asistente-rubrica/page.tsx */
"use client";

import { WizardProvider } from "@/components/planWizard/WizardProvider";
import StepRouter from "@/components/planWizard/StepRouter";

export default function AsistenteRubricaPage() {
  return (
    <WizardProvider>
      <StepRouter />          {/* StepRouter mostrará StepBienvenida, StepFechas, etc. */}
    </WizardProvider>
  );
}

