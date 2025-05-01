"use client";
import React, { useState } from "react";
import { ScheduleSelector, Schedule } from "./ScheduleSelector";
import { generatePlanificacionPrompt, PlanificacionData } from "@/util/prompts";

type Objetivo = { descripcion: string; puntaje: number };

export default function PlanificacionForm() {
  const [asignatura, setAsignatura] = useState<string>("");
  const [tiempoHora, setTiempoHora] = useState<number>(45);
  const [horasSemana, setHorasSemana] = useState<number>(1);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaTermino, setFechaTermino] = useState<string>("");
  const [numEvaluaciones, setNumEvaluaciones] = useState<number>(1);
  const [semanasAntesNotas, setSemanasAntesNotas] = useState<number>(1);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([{ descripcion: "", puntaje: 1 }]);
  const initSchedule: Schedule = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
  ].reduce((acc, d) => ({ ...acc, [d]: Array(8).fill(false) }), {} as Schedule);
  const [schedule, setSchedule] = useState<Schedule>(initSchedule);

  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [aiReply, setAiReply] = useState<string>("");

  const handleObjetivoChange = <K extends keyof Objetivo>(index: number, field: K, value: Objetivo[K]) => {
    const updated = [...objetivos];
    updated[index][field] = value;
    setObjetivos(updated);
  };

  const agregarObjetivo = () => setObjetivos([...objetivos, { descripcion: "", puntaje: 1 }]);
  const eliminarObjetivo = (idx: number) => setObjetivos((objs) => objs.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let fechaNotas: string | null = null;
    if (fechaTermino) {
      const t = new Date(fechaTermino);
      t.setDate(t.getDate() - semanasAntesNotas * 7);
      fechaNotas = t.toISOString().split("T")[0];
    }

    const data: PlanificacionData = {
      asignatura,
      tiempoHora,
      horasSemana,
      fechaInicio,
      fechaTermino,
      numEvaluaciones,
      semanasAntesNotas,
      fechaNotas,
      objetivos,
      schedule,
    };

    const prompt = generatePlanificacionPrompt(data);
    setGeneratedPrompt(prompt);

    try {
      const resp = await fetch("/api/enviarPromptDeepSeek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const { reply, error } = await resp.json();
      if (reply) {
        setAiReply(reply);
      } else {
        throw new Error(error);
      }
    } catch (err: any) {
      setAiReply(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-14">Crear Planificación</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Asignatura</label>
            <input
              type="text"
              value={asignatura}
              onChange={(e) => setAsignatura(e.target.value)}
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Tiempo por hora (min)</label>
            <input
              type="number"
              min={1}
              value={tiempoHora}
              onChange={(e) => setTiempoHora(Number(e.target.value))}
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Horas por semana</label>
            <input
              type="number"
              min={1}
              value={horasSemana}
              onChange={(e) => setHorasSemana(Number(e.target.value))}
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Fecha de inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Fecha de término</label>
            <input
              type="date"
              value={fechaTermino}
              onChange={(e) => setFechaTermino(e.target.value)}
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Número de evaluaciones</label>
            <input
              type="number"
              min={1}
              value={numEvaluaciones}
              onChange={(e) => setNumEvaluaciones(Number(e.target.value))}
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Semanas antes para notas</label>
            <input
              type="number"
              min={1}
              value={semanasAntesNotas}
              onChange={(e) => setSemanasAntesNotas(Number(e.target.value))}
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Objetivos */}
        <div>
          <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Objetivos específicos</h3>
          {objetivos.map((obj, idx) => (
            <div key={idx} className="flex gap-2 items-center mb-2">
              <input
                type="text"
                placeholder="Descripción"
                value={obj.descripcion}
                onChange={(e) => handleObjetivoChange(idx, "descripcion", e.target.value)}
                className="flex-1 border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="number"
                min={1}
                value={obj.puntaje}
                onChange={(e) => handleObjetivoChange(idx, "puntaje", Number(e.target.value))}
                className="w-20 border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                className="text-red-500"
                onClick={() => eliminarObjetivo(idx)}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-blue-600 hover:underline dark:text-blue-400"
            onClick={agregarObjetivo}
          >
            + Agregar objetivo
          </button>
        </div>

        {/* Horario */}
        <div>
          <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Horario de clases</h3>
          <ScheduleSelector schedule={schedule} setSchedule={setSchedule} />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Generar con IA
        </button>
      </form>

      {/* Salidas */}
      {generatedPrompt && (
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Prompt generado</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
            {generatedPrompt}
          </pre>
        </div>
      )}
      {aiReply && (
        <div className="mt-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Respuesta de la IA</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
            {aiReply}
          </pre>
        </div>
      )}
    </div>
  );
}
