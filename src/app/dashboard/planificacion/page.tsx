/* ─ src/app/dashboard/planificacion/page.tsx ─ */
"use client";
import React, { useState } from "react";
import { saveAs } from "file-saver";
import { ScheduleSelector, Schedule } from "./ScheduleSelector";
import { generatePlanificacionPrompt, PlanificacionData } from "@/util/prompts";
import ClasesBox, { Clase } from "@/app/components/cards/ClasesBox";
import { generateGuionPrompt } from "@/util/prompts";

/* ───────── tipos ───────── */
type Objetivo = { descripcion: string; puntaje: number };

export default function PlanificacionPage() {
  /* ───────── estados del formulario ───────── */
  const [asignatura,        setAsignatura]        = useState("");
  const [tiempoHora,        setTiempoHora]        = useState(45);
  const [horasSemana,       setHorasSemana]       = useState(1);
  const [fechaInicio,       setFechaInicio]       = useState("");
  const [fechaTermino,      setFechaTermino]      = useState("");
  const [numEvaluaciones,   setNumEvaluaciones]   = useState(1);
  const [semanasAntesNotas, setSemanasAntesNotas] = useState(1);
  const [objetivos,         setObjetivos]         = useState<Objetivo[]>([
    { descripcion: "", puntaje: 1 },
  ]);

  /* ───────── horario ───────── */
  const initSchedule: Schedule = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",
  ].reduce((acc, d) => ({ ...acc, [d]: Array(8).fill(false) }), {} as Schedule);
  const [schedule, setSchedule] = useState<Schedule>(initSchedule);

  /* ───────── salidas ───────── */
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [aiReply,         setAiReply]         = useState("");
  const [clases,          setClases]          = useState<Clase[]>([]);
  const [fechasEval,      setFechasEval]      = useState<string[]>([]);

  /* ───────── helpers (objetivos) ───────── */
  const handleObjetivoChange = <K extends keyof Objetivo>(
    idx: number,
    field: K,
    value: Objetivo[K]
  ) => {
    const updated = [...objetivos];
    updated[idx][field] = value;
    setObjetivos(updated);
  };
  const agregarObjetivo   = () => setObjetivos([...objetivos, { descripcion: "", puntaje: 1 }]);
  const eliminarObjetivo  = (i: number) => setObjetivos(objs => objs.filter((_, idx) => idx !== i));

  /* ───────── genera guion para una clase ───────── */
  const generarGuion = async (idx: number, clase: Clase) => {
    try {
      const prompt = generateGuionPrompt(clase);
  
      const r = await fetch("/api/enviarPromptDeepSeek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const { reply, error } = await r.json();
      if (!reply) throw new Error(error);
  
      setClases(prev => prev.map((c, i) => (i === idx ? { ...c, guion: reply } : c)));
    } catch (e: any) {
      alert(`Error generando guion: ${e.message}`);
    }
  };
  

  /* ───────── genera planificación completa ───────── */
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
      const r = await fetch("/api/enviarPromptDeepSeek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const { reply, error } = await r.json();
      if (!reply) throw new Error(error);

      setAiReply(reply);

      const match = reply.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed.clases)) setClases(parsed.clases as Clase[]);
        if (Array.isArray(parsed.fechasEvaluacion)) setFechasEval(parsed.fechasEvaluacion);
      }
    } catch (err: any) {
      setAiReply(`Error: ${err.message}`);
    }
  };

  /* ───────── exporta docx global ───────── */
  const exportarDocx = async () => {
    if (!clases.length) return;
    try {
      const r = await fetch("/api/exportPlanificacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: { asignatura, clases, fechasEvaluacion: fechasEval },
        }),
      });
      const blob = await r.blob();
      saveAs(blob, `planificacion_${asignatura || "curso"}.docx`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  /* ───────── UI ───────── */
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-2xl">
      {/* ───────── formulario ───────── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold mt-14 text-gray-900 dark:text-white">
          Crear Planificación
        </h2>

        {/* Campos básicos */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Asignatura</label>
            <input
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={asignatura}
              onChange={(e) => setAsignatura(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Tiempo por hora (min)</label>
            <input
              type="number"
              min={1}
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={tiempoHora}
              onChange={(e) => setTiempoHora(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Horas por semana</label>
            <input
              type="number"
              min={1}
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={horasSemana}
              onChange={(e) => setHorasSemana(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Fecha de inicio</label>
            <input
              type="date"
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Fecha de término</label>
            <input
              type="date"
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={fechaTermino}
              onChange={(e) => setFechaTermino(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">N° de evaluaciones</label>
            <input
              type="number"
              min={1}
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={numEvaluaciones}
              onChange={(e) => setNumEvaluaciones(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">Semanas antes para notas</label>
            <input
              type="number"
              min={1}
              className="w-full border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={semanasAntesNotas}
              onChange={(e) => setSemanasAntesNotas(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Objetivos */}
        <div>
          <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Objetivos específicos</h3>
          {objetivos.map((obj, idx) => (
            <div key={idx} className="flex gap-2 items-center mb-2">
              <input
                className="flex-1 border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Descripción"
                value={obj.descripcion}
                onChange={(e) => handleObjetivoChange(idx, "descripcion", e.target.value)}
                required
              />
              <input
                type="number"
                min={1}
                className="w-20 border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700 dark:text-white"
                value={obj.puntaje}
                onChange={(e) => handleObjetivoChange(idx, "puntaje", Number(e.target.value))}
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
            onClick={agregarObjetivo}
            className="text-blue-600 hover:underline dark:text-blue-400"
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
          className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          Generar con IA
        </button>
      </form>

      {/* ───────── listado de clases ───────── */}
      <ClasesBox
        clases={clases}
        asignatura={asignatura}
        onGenerate={generarGuion}
      />

      {/* ───────── botón global export ───────── */}
      <button
        onClick={exportarDocx}
        disabled={clases.length === 0}
        className={`mt-8 px-4 py-2 rounded text-white transition
          ${clases.length === 0
            ? "bg-gray-400 cursor-not-allowed dark:bg-gray-700"
            : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"}`}
      >
        📄 Descargar planificación .docx
      </button>

      {/* Prompt / respuesta (opcional) */}
      {generatedPrompt && (
        <details className="mt-6">
          <summary className="cursor-pointer text-lg font-medium text-gray-900 dark:text-white">
            Ver prompt generado
          </summary>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
            {generatedPrompt}
          </pre>
        </details>
      )}
      {aiReply && (
        <details className="mt-6">
          <summary className="cursor-pointer text-lg font-medium text-gray-900 dark:text-white">
            Ver respuesta completa de la IA
          </summary>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto">
            {aiReply}
          </pre>
        </details>
      )}
    </div>
  );
}
