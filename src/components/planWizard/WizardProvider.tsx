/* src/components/planWizard/WizardProvider.tsx */
"use client";
import { createContext, useContext, useState } from "react";

type WizardState = {
  stepIndex: number;
  next: () => void;
  prev: () => void;
  saveStep: (id: string, payload: any) => void;   // 👈 AÑADE ESTO
  data: Record<string, any>;                      //  opcional: guardar info
};

const WizardCtx = createContext<WizardState | null>(null);
export const useWizard = () => useContext(WizardCtx)!;

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<Record<string, any>>({});

  const next = () => setStepIndex((i) => i + 1);
  const prev = () => setStepIndex((i) => Math.max(0, i - 1));

  /* función que guardará la data de cada paso ------------------- */
  const saveStep = (id: string, payload: any) =>
    setData((d) => ({ ...d, [id]: payload }));

  return (
    <WizardCtx.Provider value={{ stepIndex, next, prev, saveStep, data }}>
      {children}
    </WizardCtx.Provider>
  );
}
