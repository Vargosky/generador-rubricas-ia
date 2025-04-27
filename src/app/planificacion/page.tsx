"use client";
import React, { useState } from "react";
import { ScheduleSelector, Schedule } from "./ScheduleSelector";
import { generatePlanificacionPrompt, PlanificacionData } from "@/util/prompts";

type Objetivo = { descripcion: string; puntaje: number };

export default function PlanificacionForm() {
  const [asignatura, setAsignatura] = useState<string>("");
  const [tiempoHora, setTiempoHora] = useState<number>(45);
  const [horasSemana, setHorasSemana] = useState<number>(1);
  const [vecesSemana, setVecesSemana] = useState<number>(1);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaTermino, setFechaTermino] = useState<string>("");
  const [numEvaluaciones, setNumEvaluaciones] = useState<number>(1);
  const [semanasVerObjetivo, setSemanasVerObjetivo] = useState<number>(1);
  const [semanasAntesNotas, setSemanasAntesNotas] = useState<number>(1);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([{ descripcion: "", puntaje: 1 }]);

  // Inicializar la grilla de horarios
  const initSchedule: Schedule = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
  ].reduce((acc, d) => ({ ...acc, [d]: Array(8).fill(false) }), {} as Schedule);
  const [schedule, setSchedule] = useState<Schedule>(initSchedule);

  // Estados para salida
  const [submittedData, setSubmittedData] = useState<PlanificacionData | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [aiReply, setAiReply] = useState<string>("");

  const handleObjetivoChange = <K extends keyof Objetivo>(
    index: number,
    field: K,
    value: Objetivo[K]
  ) => {
    const updated = [...objetivos];
    updated[index][field] = value;
    setObjetivos(updated);
  };

  const agregarObjetivo = () =>
    setObjetivos([...objetivos, { descripcion: "", puntaje: 1 }]);

  const eliminarObjetivo = (idx: number) =>
    setObjetivos((objs) => objs.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calcular fecha límite para ingreso de notas
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
      vecesSemana,
      fechaInicio,
      fechaTermino,
      numEvaluaciones,
      semanasVerObjetivo,
      semanasAntesNotas,
      fechaNotas,
      objetivos,
      schedule,
    };
    setSubmittedData(data);

    const prompt = generatePlanificacionPrompt(data);
    setGeneratedPrompt(prompt);

    try {
      const resp = await fetch("/api/enviarPromptDeepSeek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        setAiReply(`Error en servidor: ${text}`);
        return;
      }
      const { reply, error } = await resp.json();
      if (reply) setAiReply(reply);
      else setAiReply(`Error IA: ${error}`);
    } catch (err: any) {
      setAiReply(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold">Crear Planificación</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Asignatura</label>
            <input type="text" value={asignatura} onChange={e => setAsignatura(e.target.value)} className="w-full border rounded px-2 py-1" required />
          </div>
          <div>
            <label className="block font-medium">Tiempo por hora (min)</label>
            <input type="number" min={1} value={tiempoHora} onChange={e => setTiempoHora(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block font-medium">Horas por semana</label>
            <input type="number" min={1} value={horasSemana} onChange={e => setHorasSemana(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block font-medium">Veces por semana</label>
            <input type="number" min={1} value={vecesSemana} onChange={e => setVecesSemana(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block font-medium">Fecha de inicio</label>
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block font-medium">Fecha de término</label>
            <input type="date" value={fechaTermino} onChange={e => setFechaTermino(e.target.value)} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block font-medium">Número de evaluaciones</label>
            <input type="number" min={1} value={numEvaluaciones} onChange={e => setNumEvaluaciones(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block font-medium">Semanas para ver objetivo</label>
            <input type="number" min={1} value={semanasVerObjetivo} onChange={e => setSemanasVerObjetivo(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block font-medium">Semanas antes de término para notas</label>
            <input type="number" min={1} value={semanasAntesNotas} onChange={e => setSemanasAntesNotas(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Objetivos específicos</h3>
          {objetivos.map((obj, idx) => (
            <div key={idx} className="flex gap-2 items-center mb-2">
              <input type="text" placeholder="Descripción" value={obj.descripcion} onChange={e => handleObjetivoChange(idx, "descripcion", e.target.value)} className="flex-1 border rounded px-2 py-1" required />
              <input type="number" min={1} value={obj.puntaje} onChange={e => handleObjetivoChange(idx, "puntaje", Number(e.target.value))} className="w-20 border rounded px-2 py-1" />
              <button type="button" className="text-red-500" onClick={() => eliminarObjetivo(idx)}>✕</button>
            </div>
          ))}
          <button type="button" onClick={agregarObjetivo} className="text-blue-600 hover:underline">+ Agregar objetivo</button>
        </div>

        <div>
          <h3 className="font-medium mb-2">Horario de clases</h3>
          <ScheduleSelector schedule={schedule} setSchedule={setSchedule} />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Generar con IA</button>
      </form>

      {submittedData && (
        <pre className="bg-gray-100 p-4 mt-6 rounded text-sm">{JSON.stringify(submittedData, null, 2)}</pre>
      )}
      {generatedPrompt && (
        <pre className="bg-gray-100 p-4 mt-4 rounded text-sm">{generatedPrompt}</pre>
      )}
      {aiReply && (
        <div className="mt-6">
          <h3 className="text-xl font-medium mb-2">Respuesta de la IA</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">{aiReply}</pre>
        </div>
      )}
    </div>
  );
}
