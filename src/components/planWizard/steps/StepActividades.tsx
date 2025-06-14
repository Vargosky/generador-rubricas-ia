"use client";

import { useState } from "react";
import { useWizard } from "../WizardProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FiPlus, FiTrash, FiZap } from "react-icons/fi";

/* :::::::::::::::::::::::::::::::::::::::::::::::::::
   TIPOS Y CONSTANTES
::::::::::::::::::::::::::::::::::::::::::::::::::: */
interface Unidad {
  titulo: string;
  semanas: string | number;
  objetivos: string;
}

const ROUTES = {
  deepSeek: "/api/enviarPromptDeepSeek",
  gemini: "/api/enviarPromptGemini",
};

/* ▒▒ util: calcular semanas (hoisted) ▒▒ */
function calcularSemanas(inicio: string, termino: string): number {
  return Math.ceil(
    (new Date(termino).getTime() - new Date(inicio).getTime()) / 604800000
  );
}

/* :::::::::::::::::::::::::::::::::::::::::::::::::::
   COMPONENTE PRINCIPAL
::::::::::::::::::::::::::::::::::::::::::::::::::: */
export default function StepUnidades() {
  const { next, back, saveStep, getStep } = useWizard();
  const initial: Unidad[] = getStep("unidades") || [];

  const [unidades, setUnidades] = useState<Unidad[]>(initial);
  const [loadingIA, setLoadingIA] = useState(false);
  const [provider, setProvider] = useState<"deepSeek" | "gemini">("deepSeek");

  /* ───── datos previos ───── */
  const fechas = getStep("fechas") || {};
  const tipo   = getStep("tipo")   || {};
  const objetivos: any[] = getStep("objetivos") || [];

  const totalSemanas = fechas.inicio && fechas.termino
    ? calcularSemanas(fechas.inicio, fechas.termino)
    : null;

  /* ───── handlers ───── */
  const handleChange = (idx: number, field: keyof Unidad, val: string) => {
    const copia = [...unidades];
    copia[idx] = { ...copia[idx], [field]: val } as Unidad;
    setUnidades(copia);
  };
  const addUnidad = () => setUnidades([...unidades, { titulo: "", semanas: "", objetivos: "" }]);
  const removeUnidad = (i: number) => setUnidades(unidades.filter((_, idx) => idx !== i));

  /* ───── guardar ───── */
  const handleNext = () => {
    const incompletas = unidades.some((u) => {
      const sem = String(u.semanas || "").trim();
      return !u.titulo.trim() || !sem || !u.objetivos.trim();
    });
    if (incompletas) return alert("Completa todos los campos de cada unidad.");
    saveStep("unidades", unidades.map((u) => ({ ...u, semanas: String(u.semanas).trim() })));
    next();
  };

  /* ───── IA ───── */
  const generarConIA = async () => {
    if (!objetivos.length) return alert("Sin objetivos seleccionados");
    if (!fechas.inicio || !fechas.termino) return alert("Define fechas primero");

    setLoadingIA(true);
    try {
      const objetivosTxt = objetivos.map((oa) => `- ${oa.code}: ${oa.description}`).join("\n");
      const prompt = `Eres un planificador pedagógico experto. Genera unidades para \"${tipo?.asignatura}\".\n\nObjetivos:\n${objetivosTxt}\n\nPeriodo: ${fechas.inicio} al ${fechas.termino} (~${totalSemanas} semanas). Devuelve un array JSON:\n[ { \"titulo\":\"...\", \"semanas\":\"...\", \"objetivos\":\"...\" } ]`;

      const res = await fetch(ROUTES[provider], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const match = data.reply?.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (!match) throw new Error("Respuesta IA inválida");
      setUnidades(JSON.parse(match[0]));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoadingIA(false);
    }
  };

  /* ───── UI ───── */
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">📦 Planificación por Unidades</h2>
      <p className="text-muted-foreground">Ingresa manualmente o genera con IA.</p>

      {/* proveedor */}
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1"><input type="radio" value="deepSeek" checked={provider==='deepSeek'} onChange={()=>setProvider('deepSeek')}/> ChatGPT</label>
        <label className="flex items-center gap-1"><input type="radio" value="gemini"   checked={provider==='gemini'}   onChange={()=>setProvider('gemini')}/> Gemini</label>
      </div>
      {totalSemanas && <p className="text-sm text-muted-foreground">~{totalSemanas} semanas</p>}

      <Button onClick={generarConIA} variant="ghost" disabled={loadingIA} className="flex items-center gap-2 text-blue-600"><FiZap className={loadingIA?"animate-spin":""}/> Generar con IA</Button>

      {unidades.map((u,idx)=>(
        <div key={idx} className="border p-4 rounded-xl space-y-4">
          <div className="flex justify-between"><h3 className="font-bold">Unidad {idx+1}</h3><button onClick={()=>removeUnidad(idx)} className="text-red-500"><FiTrash/></button></div>
          <Input placeholder="Título" value={u.titulo} onChange={(e)=>handleChange(idx,'titulo',e.target.value)}/>
          <Input placeholder="Semanas" value={u.semanas} onChange={(e)=>handleChange(idx,'semanas',e.target.value)}/>
          <Textarea placeholder="Objetivos" value={u.objetivos} onChange={(e)=>handleChange(idx,'objetivos',e.target.value)}/>
        </div>))}

      <Button onClick={addUnidad} variant="outline" className="flex items-center gap-2"><FiPlus/> Agregar unidad</Button>
      <div className="flex justify-between my-6"><Button variant="ghost" onClick={back}>← Volver</Button><Button onClick={handleNext}>Siguiente →</Button></div>
    </div>
  );
}
