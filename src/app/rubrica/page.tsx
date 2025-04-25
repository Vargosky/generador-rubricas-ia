"use client"
import React, { useState } from "react";

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
 * Formulario principal de planificación, incluyendo campos básicos, selector de horarios, salida JSON y generación de prompt.
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

  // Inicializar la grilla de horarios
  const initSchedule: Schedule = days.reduce((acc, d) => {
    acc[d] = Array(HOURS).fill(false);
    return acc;
  }, {} as Schedule);
  const [schedule, setSchedule] = useState<Schedule>(initSchedule);

  // Estados para salida
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");

  const handleObjetivoChange = <K extends keyof Objetivo>(index: number, field: K, value: Objetivo[K]) => {
    const updated = [...objetivos];
    updated[index][field] = value;
    setObjetivos(updated);
  };

  const agregarObjetivo = () => setObjetivos([...objetivos, { descripcion: "", puntaje: 1 }]);
  const eliminarObjetivo = (idx: number) => setObjetivos(objs => objs.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calcular fecha límite para ingreso de notas
    let fechaNotas: string | null = null;
    if (fechaTermino) {
      const termino = new Date(fechaTermino);
      termino.setDate(termino.getDate() - semanasAntesNotas * 7);
      fechaNotas = termino.toISOString().split('T')[0];
    }

    // Construir el objeto final
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

    // Generar prompt para el LLM
    const jsonData = JSON.stringify(data, null, 2);
    const prompt = `Eres un asistente pedagógico experto en diseño curricular. A continuación, la planificación en JSON:\n${jsonData}\n\nINSTRUCCIONES:\n1. Distribuye las horas según "schedule" desde ${fechaInicio} hasta ${fechaTermino}.\n2. Reserva espacio para las ${numEvaluaciones} evaluaciones y asegura ingreso de notas antes de ${fechaNotas}.\n3. Revisa cada objetivo cada ${semanasVerObjetivo} semanas.\n4. Para cada sesión, genera un objeto con:\n   - fecha\n   - horaInicio\n   - duracion (igual a tiempoHora)\n   - objetivo\n   - actividadEntrada\n   - desarrollo\n   - cierre\n   - evaluacionIncluida\nSALIDA: un array JSON con un elemento por clase y un array de fechas de evaluación.`;
    setGeneratedPrompt(prompt);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold">Crear Planificación</h2>

        {/* Campos del formulario */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Asignatura</label>
            <input
              type="text"
              value={asignatura}
              onChange={e => setAsignatura(e.target.value)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Tiempo por hora (min)</label>
            <input
              type="number"
              min={1}
              value={tiempoHora}
              onChange={e => setTiempoHora(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-medium">Horas por semana</label>
            <input
              type="number"
              min={1}
              value={horasSemana}
              onChange={e => setHorasSemana(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-medium">Veces por semana</label>
            <input
              type="number"
              min={1}
              value={vecesSemana}
              onChange={e => setVecesSemana(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-medium">Fecha de inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-medium">Fecha de término</label>
            <input
              type="date"
              value={fechaTermino}
              onChange={e => setFechaTermino(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-medium">Número de evaluaciones</label>
            <input
              type="number"
              min={1}
              value={numEvaluaciones}
              onChange={e => setNumEvaluaciones(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-medium">Semanas para ver objetivo</label>
            <input
              type="number"
              min={1}
              value={semanasVerObjetivo}
              onChange={e => setSemanasVerObjetivo(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block font-medium">Semanas antes de término para notas</label>
            <input
              type="number"
              min={1}
              max={2}
              value={semanasAntesNotas}
              onChange={e => setSemanasAntesNotas(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Objetivos específicos */}
        <div>
          <h3 className="font-medium mb-2">Objetivos específicos</h3>
          {objetivos.map((obj, idx) => (
            <div key={idx} className="flex gap-2 items-center mb-2">
              <input
                type="text"
                placeholder="Descripción"
                value={obj.descripcion}
                onChange={e => handleObjetivoChange(idx, "descripcion", e.target.value)}
                className="flex-1 border rounded px-2 py-1"
                required
              />
              <input
                type="number"
                min={1}
                value={obj.puntaje}
                onChange={e => handleObjetivoChange(idx, "puntaje", Number(e.target.value))}
                className="w-20 border rounded px-2 py-1"
              />
              <button type="button" className="text-red-500" onClick={() => eliminarObjetivo(idx)}>
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="text-blue-600 hover:underline" onClick={agregarObjetivo}>
            + Agregar objetivo
          </button>
        </div>

        {/* Selector de horario */}
        <div>
          <h3 className="font-medium mb-2">Horario de clases</h3>
          <ScheduleSelector schedule={schedule} setSchedule={setSchedule} />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Mostrar JSON y Prompt
        </button>
      </form>

      {/* Salida JSON */}
      {submittedData && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Salida JSON</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}

      {/* Prompt generado */}
      {generatedPrompt && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Prompt para LLM</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {generatedPrompt}
          </pre>
        </div>
      )}
    </div>
  );
}
