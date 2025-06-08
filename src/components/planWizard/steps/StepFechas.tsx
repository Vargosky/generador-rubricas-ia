/* src/components/planWizard/steps/StepFechas.tsx */
"use client";
import { motion } from "framer-motion";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizard } from "../WizardProvider";

/* ---------- esquema ---------- */
const FechaExtraSchema = z.object({
  titulo: z.string().min(1, "Nombre requerido"),
  fecha: z.string().min(1, "Fecha requerida"),
});

const StepSchema = z
  .object({
    inicio: z.string().min(1, "Requerido"),
    termino: z.string().min(1, "Requerido"),
    extras: z.array(FechaExtraSchema),
  })
  .refine((d) => new Date(d.inicio) < new Date(d.termino), {
    message: "Inicio debe ser anterior a término",
    path: ["termino"],
  });

type StepData = z.infer<typeof StepSchema>;

export default function StepFechas() {
  const { saveStep, next, back } = useWizard();     // ⬅️ 1) añadimos `back`

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StepData>({
    defaultValues: { inicio: "", termino: "", extras: [] },
    resolver: zodResolver(StepSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "extras",
  });

  const onSubmit = (data: StepData) => {
    saveStep("fechas", data);
    next();
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg rounded-2xl bg-[#131C31] p-8 text-white shadow-lg space-y-8"
    >
      <h2 className="flex items-center gap-2 text-2xl font-bold">
        <CalendarDays size={28} className="text-blue-400" />
        Paso&nbsp;2&nbsp;· Fechas del semestre
      </h2>

      {/* fechas inicio / término */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Inicio semestre</label>
          <input
            type="date"
            {...register("inicio")}
            className="w-full rounded bg-slate-800 p-2"
          />
          {errors.inicio && (
            <p className="mt-1 text-xs text-red-500">{errors.inicio.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm">Término semestre</label>
          <input
            type="date"
            {...register("termino")}
            className="w-full rounded bg-slate-800 p-2"
          />
          {errors.termino && (
            <p className="mt-1 text-xs text-red-500">
              {errors.termino.message as string}
            </p>
          )}
        </div>
      </div>

      {/* fechas importantes */}
      <div className="space-y-3">
        <p className="font-medium">Fechas importantes del colegio</p>

        {fields.map((f, i) => (
          <div
            key={f.id}
            className="grid items-center gap-2 grid-cols-[1fr_140px_auto]"
          >
            <input
              placeholder="Aniversario, Día del alumno…"
              {...register(`extras.${i}.titulo`)}
              className="rounded bg-slate-800 p-2"
            />
            <input
              type="date"
              {...register(`extras.${i}.fecha`)}
              className="rounded bg-slate-800 p-2"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ titulo: "", fecha: "" })}
          className="flex items-center gap-1 text-sm text-blue-400 hover:underline"
        >
          <Plus size={14} /> Añadir fecha
        </button>
      </div>

      {/* navegación */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={back}                          // ⬅️ 2) usamos `back`
          className="rounded border border-gray-500 px-6 py-2 transition-colors hover:bg-gray-700"
        >
          ← Atrás
        </button>

        <button
          className="rounded bg-blue-600 px-6 py-2 transition-colors hover:bg-blue-700"
        >
          Siguiente
        </button>
      </div>
    </motion.form>
  );
}
