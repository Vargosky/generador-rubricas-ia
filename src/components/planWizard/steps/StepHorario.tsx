/* StepHorario.tsx
   Paso · Horario semanal
------------------------------------------------------------ */
"use client";

import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Clock } from "lucide-react";
import { useWizard } from "../WizardProvider";

/* ---------- esquema ---------- */
const SesionSchema = z.object({
  dia: z.enum(["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]),
  duracion: z.number().min(45).max(360),
  inicio: z.string().optional(),               // HH:MM
});

const StepSchema = z.object({
  sesiones: z.array(SesionSchema).min(1, "Añade al menos una sesión"),
});

type StepData = z.infer<typeof StepSchema>;

export default function StepHorario() {
  const { saveStep, next } = useWizard();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<StepData>({
    defaultValues: { sesiones: [{ dia: "Lun", duracion: 45, inicio: "" }] },
    resolver: zodResolver(StepSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sesiones",
  });

  /* total minutos para feedback UX */
  const totalMin = watch("sesiones").reduce(
    (acc, s) => acc + Number(s.duracion),
    0
  );

  const onSubmit = (data: StepData) => {
    saveStep("horario", data);
    next();
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl bg-[#131C31] text-white rounded-2xl shadow-lg p-8 space-y-8"
    >
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Clock size={28} className="text-blue-400" />
        Paso&nbsp;3&nbsp;· Horario semanal
      </h2>

      {/* ---------- tabla de sesiones ---------- */}
      <table className="w-full text-sm border border-slate-700 rounded overflow-hidden">
        <thead className="bg-slate-800 text-gray-300">
          <tr>
            <th className="py-2 px-3 text-left">Día</th>
            <th className="py-2 px-3 text-left">Duración</th>
            <th className="py-2 px-3 text-left">Hora inicio</th>
            <th className="py-2 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f, i) => (
            <tr key={f.id} className="border-t border-slate-700">
              <td className="p-2">
                <select
                  {...register(`sesiones.${i}.dia` as const)}
                  className="bg-slate-800 w-full rounded"
                >
                  {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </td>

              <td className="p-2">
                <select
                  {...register(`sesiones.${i}.duracion` as const, { valueAsNumber: true })}
                  className="bg-slate-800 w-full rounded"
                >
                  {[...Array(8)].map((_, idx) => {
                    const min = 45 * (idx + 1);
                    return (
                      <option key={min} value={min}>
                        {idx + 1} bloque{idx ? "s" : ""} ({min} min)
                      </option>
                    );
                  })}
                </select>
              </td>

              <td className="p-2">
                <input
                  type="time"
                  {...register(`sesiones.${i}.inicio` as const)}
                  className="bg-slate-800 w-full rounded px-2"
                />
              </td>

              <td className="p-2 text-center">
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={() => append({ dia: "Lun", duracion: 45, inicio: "" })}
        className="text-blue-400 hover:underline text-sm"
      >
        ➕ Añadir sesión
      </button>

      {errors.sesiones && (
        <p className="text-red-500 text-sm">{errors.sesiones.message as string}</p>
      )}

      <p className="text-sm text-gray-400">
        Total programado:{" "}
        <span className="font-semibold text-blue-300">{totalMin}</span> min.
      </p>

      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
          Siguiente
        </button>
      </div>
    </motion.form>
  );
}
