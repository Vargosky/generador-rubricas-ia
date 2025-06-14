"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWizard } from "../WizardProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FiPlus, FiTrash, FiZap } from "react-icons/fi";

/* :::::::::::::::::::::::::::::::::::::::::::::::::::
   TIPOS Y CONSTANTES
::::::::::::::::::::::::::::::::::::::::::::::::::: */
interface ActividadLudica {
  nombre: string;
  descripcion: string;
}

const ROUTES = {
  deepSeek: "/api/enviarPromptDeepSeek",
  gemini:   "/api/enviarPromptGemini",
};

/* :::::::::::::::::::::::::::::::::::::::::::::::::::
   COMPONENTE PRINCIPAL
::::::::::::::::::::::::::::::::::::::::::::::::::: */
export default function StepActividadesLudicas() {
  const { next, back, saveStep, getStep } = useWizard();

  const initial: ActividadLudica[] = getStep("actividadesLudicas") || [];
  const [actividades, setActividades] = useState<ActividadLudica[]>(initial);
  const [loadingIA, setLoadingIA]     = useState(false);
  const [provider, setProvider]       = useState<"deepSeek" | "gemini">("deepSeek");

  /* ───── helpers ───── */
  const addActividad = () => setActividades([...actividades, { nombre: "", descripcion: "" }]);
  const removeActividad = (idx: number) => setActividades(actividades.filter((_, i) => i !== idx));
  const updateActividad = (idx: number, field: keyof ActividadLudica, val: string) => {
    const copy = [...actividades];
    copy[idx][field] = val;
    setActividades(copy);
  };

  /* ───── IA ───── */
  const generarConIA = async () => {
    setLoadingIA(true);
    try {
      const tipo      = getStep("tipo");
      const unidades  = getStep("unidades") || [];
      const objetivos = getStep("objetivos") || [];

      // Construimos un prompt rico
      const unidadesTxt = unidades.map((u:any) => `• ${u.titulo} (${u.semanas} sem)`).join("\n");
      const objetivosTxt = objetivos.slice(0,5).map((o:any)=>o.code).join(", ");

      const prompt = `Eres un diseñador de aprendizaje lúdico. Sugiere actividades dinámicas, participativas y divertidas para la asignatura \"${tipo?.asignatura}\".\nUnidades a cubrir:\n${unidadesTxt}\n\nDebes inspirarte en juegos de rol, escape rooms, gamificación, competencias colaborativas, etc. Cada actividad debe incluir máximo 200 caracteres de descripción. Devuelve SOLO un array JSON:\n[ { \"nombre\":\"...\", \"descripcion\":\"...\" } ]`;

      const res = await fetch(ROUTES[provider], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const match = data.reply?.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (!match) throw new Error("Respuesta IA no válida");
      setActividades(JSON.parse(match[0]));
    } catch (e:any) {
      alert(e.message);
    } finally {
      setLoadingIA(false);
    }
  };

  /* ───── continuar ───── */
  const handleNext = () => {
    if (!actividades.length) return alert("Añade al menos una actividad lúdica");
    const incompletas = actividades.some(a=>!a.nombre.trim()||!a.descripcion.trim());
    if (incompletas) return alert("Completa nombre y descripción de todas las actividades");
    saveStep("actividadesLudicas", actividades);
    next();
  };

  /* ───── UI ───── */
  return (
    <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} className="mx-auto max-w-3xl space-y-6 rounded-2xl bg-[#131C31] p-8 text-white shadow-lg">
      <h2 className="text-2xl font-bold">Paso · Actividades Lúdicas</h2>

      {/* selector IA */}
      <div className="flex gap-4 text-sm mb-2">
        <label className="flex items-center gap-1"><input type="radio" value="deepSeek" checked={provider==='deepSeek'} onChange={()=>setProvider('deepSeek')}/> ChatGPT</label>
        <label className="flex items-center gap-1"><input type="radio" value="gemini" checked={provider==='gemini'} onChange={()=>setProvider('gemini')}/> Gemini</label>
      </div>

      <Button onClick={generarConIA} variant="ghost" disabled={loadingIA} className="flex items-center gap-2 text-blue-400 cursor-pointer"><FiZap className={loadingIA?"animate-spin":""}/> Generar actividades con IA</Button>

      {actividades.map((a,idx)=>(
        <div key={idx} className="bg-slate-800 p-4 rounded-lg shadow space-y-2">
          <div className="flex justify-between items-center"><h4 className="font-semibold">Actividad {idx+1}</h4><button onClick={()=>removeActividad(idx)} className="text-red-400 hover:text-red-600"><FiTrash/></button></div>
          <Input placeholder="Nombre" value={a.nombre} onChange={(e)=>updateActividad(idx,'nombre',e.target.value)}/>
          <Textarea placeholder="Descripción lúdica" value={a.descripcion} onChange={(e)=>updateActividad(idx,'descripcion',e.target.value)}/>
        </div>
      ))}

      <Button onClick={addActividad} variant="outline" className="flex items-center gap-2"><FiPlus/> Agregar Actividad</Button>

      <div className="flex justify-between pt-6"><Button variant="ghost" onClick={back}>← Atrás</Button><Button onClick={handleNext}>Siguiente →</Button></div>
    </motion.div>
  );
}
