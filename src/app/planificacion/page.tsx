"use client";
import React, { useState } from "react";
import { ScheduleSelector, Schedule } from "./ScheduleSelector";

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
  const initSchedule: Schedule = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
    .reduce((acc, d) => ({ ...acc, [d]: Array(8).fill(false) }), {} as Schedule);
  const [schedule, setSchedule] = useState<Schedule>(initSchedule);

  const [submittedData, setSubmittedData] = useState<any>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");

  const handleObjetivoChange = <K extends keyof Objetivo>(
    index: number, field: K, value: Objetivo[K]
  ) => {
    const updated = [...objetivos];
    updated[index][field] = value;
    setObjetivos(updated);
  };

  const agregarObjetivo = () => setObjetivos([...objetivos, { descripcion: "", puntaje: 1 }]);
  const eliminarObjetivo = (idx: number) => setObjetivos(objs => objs.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let fechaNotas: string | null = null;
    if (fechaTermino) {
      const t = new Date(fechaTermino);
      t.setDate(t.getDate() - semanasAntesNotas * 7);
      fechaNotas = t.toISOString().split("T")[0];
    }

    const data = {
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

    const jsonData = JSON.stringify(data, null, 2);
    const prompt = `Eres un asistente pedagógico experto en diseño curricular…\n${jsonData}\nINSTRUCCIONES:…`;
    setGeneratedPrompt(prompt);

    try {
      const resp = await fetch("/api/enviarPrompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const { reply, error } = await resp.json();
      if (reply) {
        alert("✅ IA respondió: " + reply.slice(0, 100) + "…");
      } else {
        throw new Error(error);
      }
    } catch (err: any) {
      alert("❌ Error al generar con DeepSeek: " + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold">Crear Planificación</h2>
        {/* …(el resto de inputs igual que antes)… */}
        <div>
          <h3 className="font-medium mb-2">Horario de clases</h3>
          <ScheduleSelector schedule={schedule} setSchedule={setSchedule} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
          Generar con IA
        </button>
      </form>

      {submittedData && (
        <pre className="bg-gray-100 p-4 mt-6 rounded text-sm">
          {JSON.stringify(submittedData, null, 2)}
        </pre>
      )}
      {generatedPrompt && (
        <pre className="bg-gray-100 p-4 mt-4 rounded text-sm">{generatedPrompt}</pre>
      )}
    </div>
  );
}
