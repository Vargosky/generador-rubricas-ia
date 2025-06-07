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
  const { saveStep, next } = useWizard();

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
    next(); // → irá a StepHorario
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg bg-[#131C31] text-white rounded-2xl shadow-lg p-8 space-y-8"
    >
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <CalendarDays size={28} className="text-blue-400" />
        Paso&nbsp;2&nbsp;· Fechas del semestre
      </h2>

      {/* fechas inicio / término */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 text-sm">Inicio semestre</label>
          <input
            type="date"
            {...register("inicio")}
            className="w-full bg-slate-800 p-2 rounded"
          />
          {errors.inicio && (
            <p className="text-red-500 text-xs mt-1">
              {errors.inicio.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm">Término semestre</label>
          <input
            type="date"
            {...register("termino")}
            className="w-full bg-slate-800 p-2 rounded"
          />
          {errors.termino && (
            <p className="text-red-500 text-xs mt-1">
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
            className="grid grid-cols-[1fr_140px_auto] gap-2 items-center"
          >
            <input
              placeholder="Aniversario, Día del alumno…"
              {...register(`extras.${i}.titulo`)}
              className="bg-slate-800 p-2 rounded"
            />
            <input
              type="date"
              {...register(`extras.${i}.fecha`)}
              className="bg-slate-800 p-2 rounded"
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
          className="flex items-center gap-1 text-blue-400 hover:underline text-sm"
        >
          <Plus size={14} /> Añadir fecha
        </button>
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
          Siguiente
        </button>
      </div>
    </motion.form>
  );
}
