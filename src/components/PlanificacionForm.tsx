"use client";
import React from "react";
import { ScheduleSelector, Schedule } from "../app/dashboard/planificacion/ScheduleSelector";
import SelectorObjetivos from "@/app/dashboard/planificacion/SelectorObjetivos";


type Objetivo = { descripcion: string; puntaje: number };

type PlanificacionFormProps = {
  asignatura: string;
  tiempoHora: number;
  horasSemana: number;
  fechaInicio: string;
  fechaTermino: string;
  numEvaluaciones: number;
  semanasAntesNotas: number;
  objetivos: Objetivo[];
  schedule: Schedule;
  tiposEvaluacion: string[];
  detallesExtra: string;

  setAsignatura: (value: string) => void;
  setTiempoHora: (value: number) => void;
  setHorasSemana: (value: number) => void;
  setFechaInicio: (value: string) => void;
  setFechaTermino: (value: string) => void;
  setNumEvaluaciones: (value: number) => void;
  setSemanasAntesNotas: (value: number) => void;
  setObjetivos: (value: Objetivo[]) => void;
  setSchedule: (value: Schedule) => void;
  setDetallesExtra: (value: string) => void;
  setTiposEvaluacion: (value: string[]) => void;

  handleObjetivoChange: <K extends keyof Objetivo>(idx: number, field: K, value: Objetivo[K]) => void;
  agregarObjetivo: () => void;
  eliminarObjetivo: (i: number) => void;

  handleSubmit: (e: React.FormEvent) => void;
};

const EVALUACION_TIPOS = ["Prueba escrita", "Trabajo práctico", "Proyecto", "Presentación", "Lectura"];

export default function PlanificacionForm({
  asignatura,
  tiempoHora,
  horasSemana,
  fechaInicio,
  fechaTermino,
  numEvaluaciones,
  semanasAntesNotas,
  objetivos,
  schedule,
  tiposEvaluacion,
  detallesExtra,
  setAsignatura,
  setTiempoHora,
  setHorasSemana,
  setFechaInicio,
  setFechaTermino,
  setNumEvaluaciones,
  setSemanasAntesNotas,
  setObjetivos,
  setSchedule,
  setDetallesExtra,
  setTiposEvaluacion,
  handleObjetivoChange,
  agregarObjetivo,
  eliminarObjetivo,
  handleSubmit,
}: PlanificacionFormProps) {
  const toggleTipoEvaluacion = (tipo: string) => {
    if (tiposEvaluacion.includes(tipo)) {
      setTiposEvaluacion(tiposEvaluacion.filter((t) => t !== tipo));
    } else {
      setTiposEvaluacion([...tiposEvaluacion, tipo]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      

      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Crear Planificación</h2>

      {/* ─── Datos generales ─── */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-lg font-medium mb-2">Datos generales</legend>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Asignatura</label>
            <select
              value={asignatura}
              onChange={(e) => setAsignatura(e.target.value)}
              className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
            >
              <option value="tecnologia">Tecnología</option>
              <option value="lenguaje">Lenguaje</option>
              <option value="matematicas">Matemáticas</option>
            </select>
          </div>
                   
          <div>
            <label className="block text-sm font-medium mb-1">Detalles opcionales</label>
            <input
              value={detallesExtra}
              onChange={(e) => setDetallesExtra(e.target.value)}
              className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
              placeholder="Ej: proyecto final, incluir lectura, etc."
            />
          </div>
        </div>
      </fieldset>

      {/* ─── Configuración de tiempo ─── */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-lg font-medium mb-2">Configuración de tiempo</legend>
        <div className="grid grid-cols-2 gap-4">
          <InputBlock label="Tiempo por clase (min)" value={tiempoHora} onChange={setTiempoHora} />
          <InputBlock label="Horas por semana" value={horasSemana} onChange={setHorasSemana} />
          <InputBlock label="Fecha de inicio" type="date" value={fechaInicio} onChange={setFechaInicio} />
          <InputBlock label="Fecha de término" type="date" value={fechaTermino} onChange={setFechaTermino} />
        </div>
      </fieldset>

      {/* ─── Evaluaciones ─── */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-lg font-medium mb-2">Evaluaciones</legend>
        <div className="grid grid-cols-2 gap-4">
          <InputBlock label="Cantidad de evaluaciones" value={numEvaluaciones} onChange={setNumEvaluaciones} />
          <InputBlock label="Semanas antes del cierre para notas" value={semanasAntesNotas} onChange={setSemanasAntesNotas} />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-1">Tipos de evaluación</p>
          <div className="flex flex-wrap gap-2">
            {EVALUACION_TIPOS.map((tipo) => (
              <label key={tipo} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tiposEvaluacion.includes(tipo)}
                  onChange={() => toggleTipoEvaluacion(tipo)}
                />
                <span className="text-sm">{tipo}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* ─── Objetivos específicos ─── */}
{/* ─── Objetivos específicos ─── */}
<fieldset className="border p-4 rounded-md space-y-4">
  <legend className="text-lg font-medium mb-2">Objetivos de Aprendizaje</legend>

  {/* Selector visual de objetivos */}
  <SelectorObjetivos
    onAgregarObjetivo={(nuevo) =>
      setObjetivos([...objetivos, { descripcion: nuevo.descripcion, puntaje: 10 }])
    }
  />

  {/* Campos de objetivos seleccionados */}
  {objetivos.map((obj, idx) => (
    <div key={idx} className="flex gap-2">
      <input
        className="flex-1 border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
        placeholder="Descripción"
        value={obj.descripcion}
        onChange={(e) => handleObjetivoChange(idx, "descripcion", e.target.value)}
        required
      />
      <input
        type="number"
        min={1}
        className="w-20 border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
        value={obj.puntaje}
        onChange={(e) => handleObjetivoChange(idx, "puntaje", Number(e.target.value))}
      />
      <button
        type="button"
        onClick={() => eliminarObjetivo(idx)}
        className="text-red-500"
      >
        ✕
      </button>
    </div>
  ))}

  {/* Botón para agregar objetivo vacío */}
  <button
    type="button"
    onClick={agregarObjetivo}
    className="text-blue-600 dark:text-blue-400 hover:underline mt-2"
  >
    + Agregar objetivo manualmente
  </button>
</fieldset>

        
      {/* ─── Horario ─── */}
      <fieldset className="border p-4 rounded-md">
        <legend className="text-lg font-medium mb-2">Horario de clases</legend>
        <ScheduleSelector schedule={schedule} setSchedule={setSchedule} />
      </fieldset>

      {/* ─── Enviar ─── */}
      <button
        type="submit"
        className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-2 rounded"
      >
        Generar con IA
      </button>
    </form>
  );
}

function InputBlock({
    label,
    value,
    onChange,
    type = "number",
  }: {
    label: string;
    value: string | number;
    onChange: (v: any) => void;
    type?: string;
  }) {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(type === "number" ? Number(e.target.value) : e.target.value)
          }
          className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
        />
      </div>
    );
  }
  
