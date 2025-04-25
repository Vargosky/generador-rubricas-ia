"use client"
import React, { useState } from "react";
import type { NextApiRequest, NextApiResponse } from 'next';

// Tipos para la planificación
type Objetivo = { descripcion: string; puntaje: number };
type Schedule = Record<string, boolean[]>;

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const HOURS = 8;

interface ScheduleSelectorProps {
  schedule: Schedule;
  setSchedule: (schedule: Schedule) => void;
}

/**
 * Componente para seleccionar horarios: grilla de 6 días x 8 horas.
 */
export const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({ schedule, setSchedule }) => {
  const toggleCell = (day: string, hourIdx: number) => {
    const updated = { ...schedule };
    updated[day] = [...updated[day]];
    updated[day][hourIdx] = !updated[day][hourIdx];
    setSchedule(updated);
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Hora</th>
            {days.map((d) => (
              <th key={d} className="border p-2 text-center">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: HOURS }, (_, i) => i + 1).map((hor) => (
            <tr key={hor}>
              <td className="border p-1 text-center">{hor}</td>
              {days.map((d) => (
                <td key={`${d}-${hor}`} className="border p-1 text-center">
                  <input
                    type="checkbox"
                    checked={schedule[d][hor - 1]}
                    onChange={() => toggleCell(d, hor - 1)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Formulario principal de planificación, incluyendo campos básicos, selector de horarios, salida JSON, prompt y llamada API.
 */
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

  const initSchedule: Schedule = days.reduce((acc, d) => {
    acc[d] = Array(HOURS).fill(false);
    return acc;
  }, {} as Schedule);
  const [schedule, setSchedule] = useState<Schedule>(initSchedule);

  // Estados para salida, prompt y respuesta API
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [apiReply, setApiReply] = useState<string>("");

  const handleObjetivoChange = <K extends keyof Objetivo>(index: number, field: K, value: Objetivo[K]) => {
    const updated = [...objetivos];
    updated[index][field] = value;
    setObjetivos(updated);
  };

  const agregarObjetivo = () => setObjetivos([...objetivos, { descripcion: "", puntaje: 1 }]);
  const eliminarObjetivo = (idx: number) => setObjetivos(objs => objs.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Calcular fecha límite para ingreso de notas
    let fechaNotas: string | null = null;
    if (fechaTermino) {
      const termino = new Date(fechaTermino);
      termino.setDate(termino.getDate() - semanasAntesNotas * 7);
      fechaNotas = termino.toISOString().split('T')[0];
    }

    const data = { asignatura, tiempoHora, horasSemana, vecesSemana, fechaInicio, fechaTermino,
      numEvaluaciones, semanasVerObjetivo, semanasAntesNotas, fechaNotas, objetivos, schedule };
    setSubmittedData(data);

    // Generar prompt
    const jsonData = JSON.stringify(data, null, 2);
    const prompt = `Eres un asistente pedagógico experto en diseño curricular.\nPlanificación JSON:\n${jsonData}\nINSTRUCCIONES:\n1) Distribuye horas según schedule...`;
    setGeneratedPrompt(prompt);

    // Enviar prompt a API
    try {
      const res = await fetch('/api/enviarPrompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const { reply } = await res.json();
      setApiReply(reply);
    } catch (err) {
      setApiReply('Error al enviar el prompt');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* formulario campos... */}
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Generar y Enviar Prompt
        </button>
      </form>

      {submittedData && (
        <pre>{JSON.stringify(submittedData, null, 2)}</pre>
      )}
      {generatedPrompt && (
        <pre>{generatedPrompt}</pre>
      )}
      {apiReply && (
        <div className="mt-4 p-4 bg-gray-100 rounded">Respuesta API: {apiReply}</div>
      )}
    </div>
  );
}
