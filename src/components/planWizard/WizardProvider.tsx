/* src/components/planWizard/WizardProvider.tsx */
"use client";
import { createContext, useContext, useState } from "react";

type WizardState = {
  stepIndex: number;
  next: () => void;
  back: () => void;                               // ← renombrado
  saveStep: (id: string, payload: any) => void;
  data: Record<string, any>;
};

const WizardCtx = createContext<WizardState | null>(null);

/* ⬇️ Custom hook: arroja error si se usa fuera del provider */
export const useWizard = () => {
  const ctx = useContext(WizardCtx);
  if (!ctx) throw new Error("useWizard debe usarse dentro de WizardProvider");
  return ctx;
};

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<Record<string, any>>({});

  const next = () => setStepIndex((i) => i + 1);
  const back = () => setStepIndex((i) => Math.max(0, i - 1));

  const saveStep = (id: string, payload: any) =>
    setData((d) => ({ ...d, [id]: payload }));

  const value: WizardState = { stepIndex, next, back, saveStep, data };

  return <WizardCtx.Provider value={value}>{children}</WizardCtx.Provider>;
}
