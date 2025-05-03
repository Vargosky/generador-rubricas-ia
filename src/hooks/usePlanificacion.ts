"use client"
import { useState } from "react";
import { saveAs } from "file-saver";
import { generatePlanificacionPrompt, generateGuionPrompt, PlanificacionData } from "@/util/prompts";
import { Clase } from "@/app/components/cards/ClasesBox";
import { Schedule } from "@/app/dashboard/planificacion/ScheduleSelector";
import { buildPromptPlanificacion } from "@/util/prompts/buildPrompt";


type Objetivo = { descripcion: string; puntaje: number };

export function usePlanificacion() {
  const [tiposEvaluacion, setTiposEvaluacion] = useState<string[]>([]);
  const [detallesExtra, setDetallesExtra] = useState("");
  const [asignatura, setAsignatura] = useState("");
  const [tiempoHora, setTiempoHora] = useState(45);
  const [horasSemana, setHorasSemana] = useState(1);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaTermino, setFechaTermino] = useState("");
  const [numEvaluaciones, setNumEvaluaciones] = useState(1);
  const [semanasAntesNotas, setSemanasAntesNotas] = useState(1);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([{ descripcion: "", puntaje: 1 }]);
  const [schedule, setSchedule] = useState<Schedule>(
    ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
      .reduce((acc, d) => ({ ...acc, [d]: Array(8).fill(false) }), {} as Schedule)
  );
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [clases, setClases] = useState<Clase[]>([]);
  const [fechasEval, setFechasEval] = useState<string[]>([]);

  const handleObjetivoChange = <K extends keyof Objetivo>(
    idx: number,
    field: K,
    value: Objetivo[K]
  ) => {
    setObjetivos((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  const agregarObjetivo = () => setObjetivos((prev) => [...prev, { descripcion: "", puntaje: 1 }]);

  const eliminarObjetivo = (i: number) => setObjetivos((prev) => prev.filter((_, idx) => idx !== i));

  const generarGuion = async (idx: number, clase: Clase) => {
    try {
      const prompt = generateGuionPrompt(clase);
      const res = await fetch("/api/enviarPromptDeepSeek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const { reply, error } = await res.json();
      if (!reply) throw new Error(error || "Sin respuesta");
      setClases((prev) => prev.map((c, i) => (i === idx ? { ...c, guion: reply } : c)));
    } catch (e: any) {
      alert(`Error generando guion: ${e.message}`);
    }
  };

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
    const prompt = buildPromptPlanificacion(data);

    setGeneratedPrompt(prompt);

    try {
      const res = await fetch("/api/enviarPromptDeepSeek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const { reply, error } = await res.json();
      if (!reply) throw new Error(error || "Sin respuesta");
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

  const exportarDocx = async () => {
    if (!clases.length) return;
    try {
      const res = await fetch("/api/exportPlanificacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: { asignatura, clases, fechasEvaluacion: fechasEval } }),
      });
      const blob = await res.blob();
      saveAs(blob, `planificacion_${asignatura || "curso"}.docx`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return {
    asignatura,
    tiempoHora,
    horasSemana,
    fechaInicio,
    fechaTermino,
    numEvaluaciones,
    semanasAntesNotas,
    objetivos,
    schedule,
    generatedPrompt,
    aiReply,
    clases,
    fechasEval,
    setAsignatura,
    setTiempoHora,
    setHorasSemana,
    setFechaInicio,
    setFechaTermino,
    setNumEvaluaciones,
    setSemanasAntesNotas,
    setObjetivos,
    setSchedule,
    handleObjetivoChange,
    agregarObjetivo,
    eliminarObjetivo,
    handleSubmit,
    generarGuion,
    exportarDocx,
    tiposEvaluacion,
    detallesExtra,
    setTiposEvaluacion,
    setDetallesExtra,
  };
}
