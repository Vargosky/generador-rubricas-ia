/* StepEvaluaciones.tsx – versión extendida con Fecha, Instrumento y Ponderación (%) */
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { FiPlus, FiTrash } from "react-icons/fi";
import { useWizard } from "../WizardProvider";
import { Button } from "@/components/ui/Button";
import { tiposEvaluacion } from "@/data/tiposEvaluacion";

/* tipos */
interface Evaluacion {
  nombre: string;
  detalle: string;
  cantidad: number;
  fecha: string;      // ISO
  instrumento: string; // p.e. "Prueba", "Proyecto"
  ponderacion: number; // %
}

export default function StepEvaluaciones() {
  const { saveStep, next, back, getStep } = useWizard();
  const objetivos = getStep("objetivos") ?? [];

  /* estado */
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>(getStep("evaluaciones") || []);

  /* helpers */
  const addEmpty = () => setEvaluaciones([...evaluaciones, {
    nombre: "",
    detalle: "",
    cantidad: 1,
    fecha: "",
    instrumento: "Prueba",
    ponderacion: 0,
  }]);

  const update = (idx: number, field: keyof Evaluacion, value: any) => {
    setEvaluaciones(ev => ev.map((e,i)=> i===idx ? {...e,[field]:value}:e));
  };

  const remove = (idx: number) => setEvaluaciones(ev => ev.filter((_,i)=>i!==idx));

  /* validación y guardar */
  const handleNext = () => {
    if(!evaluaciones.length) return alert("Añade al menos una evaluación");
    const invalida = evaluaciones.find(e=>!e.nombre.trim() || !e.fecha || e.ponderacion<=0);
    if(invalida) return alert("Completa nombre, fecha y % de todas las evaluaciones");
    saveStep("evaluaciones", evaluaciones);
    next();
  };

  /* UI */
  return (
    <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} className="mx-auto max-w-3xl space-y-6 rounded-2xl bg-[#131C31] p-8 text-white shadow-lg">
      <h2 className="text-2xl font-bold">Paso · Evaluaciones</h2>

      {/* OA seleccionados */}
      <div>
        <h3 className="text-lg font-semibold mb-1">OA a evaluar</h3>
        {objetivos.length===0 ? <p className="text-sm text-gray-400">No hay OA seleccionados.</p> : (
          <ul className="ml-5 list-disc text-sm text-blue-200 space-y-1">
            {objetivos.map((oa:any)=>(<li key={oa.code}><span className="font-semibold text-blue-300">{oa.code}</span> — {oa.description}</li>))}
          </ul>) }
      </div>

      {/* tabla evaluaciones */}
      <div className="space-y-3">
        {evaluaciones.map((e,idx)=>(
          <div key={idx} className="bg-slate-800 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <input value={e.nombre} onChange={ev=>update(idx,'nombre',ev.target.value)} placeholder="Nombre evaluación" className="flex-1 mr-2 rounded bg-slate-700 p-2 text-sm" />
              <button onClick={()=>remove(idx)} className="text-red-400 hover:text-red-600"><FiTrash/></button>
            </div>
            <textarea value={e.detalle} onChange={ev=>update(idx,'detalle',ev.target.value)} placeholder="Detalle (opcional)" className="w-full rounded bg-slate-700 p-2 text-sm"/>
            <div className="grid md:grid-cols-4 gap-2 text-sm">
              <input type="date" value={e.fecha} onChange={ev=>update(idx,'fecha',ev.target.value)} className="rounded bg-slate-700 p-2"/>
              <select value={e.instrumento} onChange={ev=>update(idx,'instrumento',ev.target.value)} className="rounded bg-slate-700 p-2">
                {tiposEvaluacion.map(te=>(<option key={te.nombre} value={te.nombre}>{te.nombre}</option>))}
              </select>
              <input type="number" min={1} value={e.cantidad} onChange={ev=>update(idx,'cantidad',Number(ev.target.value))} className="rounded bg-slate-700 p-2" placeholder="Cantidad"/>
              <input type="number" min={0} max={100} value={e.ponderacion} onChange={ev=>update(idx,'ponderacion',Number(ev.target.value))} className="rounded bg-slate-700 p-2" placeholder="%"/>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={addEmpty} variant="outline" className="flex items-center gap-2"><FiPlus/> Agregar evaluación</Button>

      <div className="flex justify-between pt-5"><Button variant="ghost" onClick={back}>← Atrás</Button><Button onClick={handleNext}>Siguiente →</Button></div>
    </motion.div>
  );
}
