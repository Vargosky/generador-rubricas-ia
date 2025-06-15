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
  semanas: string | number; // Gemini devuelve número, normalizamos a string luego
  objetivos: string;
}

const ROUTES = {
  deepSeek: "/api/enviarPromptDeepSeek", // OpenAI/DeepSeek
  gemini: "/api/enviarPromptGemini",     // Google Gemini
};

/* :::::::::::::::::::::::::::::::::::::::::::::::::::
   COMPONENTE PRINCIPAL
::::::::::::::::::::::::::::::::::::::::::::::::::: */
export default function StepUnidades() {
  const { next, back, saveStep, getStep } = useWizard();
  const initial: Unidad[] = getStep("unidades") || [];

  const [unidades, setUnidades] = useState<Unidad[]>(initial);
  const [loadingIA, setLoadingIA] = useState(false);
  const [provider, setProvider] = useState<"deepSeek" | "gemini">("gemini");

  /* ───── util ───── */
  const calcularSemanas = (i: string, t: string) =>
    Math.ceil((new Date(t).getTime() - new Date(i).getTime()) / 604800000); // ms en semana

  /* ───── datos previos (para prompt) ───── */
  const fechas = getStep("fechas") || {};
  const tipo   = getStep("tipo") || {};
  const objetivos: any[] = getStep("objetivos") || [];

  const totalSemanas = fechas.inicio && fechas.termino
    ? calcularSemanas(fechas.inicio, fechas.termino)
    : null;

  /* ───── handlers UI ───── */
  const handleChange = (idx: number, field: keyof Unidad, val: string) => {
    const copia = [...unidades];
    copia[idx] = { ...copia[idx], [field]: val } as Unidad;
    setUnidades(copia);
  };

  const addUnidad    = () => setUnidades([...unidades, { titulo: "", semanas: "", objetivos: "" }]);
  const removeUnidad = (i: number) => setUnidades(unidades.filter((_, idx) => idx !== i));

  /* ───── guardar ───── */
  const handleNext = () => {
    const incompletas = unidades.some((u) => {
      const semanasTxt = String(u.semanas ?? "").trim();
      return !u.titulo.trim() || !semanasTxt || !u.objetivos.trim();
    });
    if (incompletas) {
      alert("Por favor completa todos los campos de cada unidad.");
      return;
    }
    const normalizadas = unidades.map((u) => ({ ...u, semanas: String(u.semanas).trim() }));
    saveStep("unidades", normalizadas);
    next();
  };

  /* ───── llamada IA ───── */
  const generarConIA = async () => {
    if (!objetivos.length) {
      alert("No hay objetivos para generar unidades");
      return;
    }
    if (!fechas.inicio || !fechas.termino) {
      alert("Primero define el rango de fechas");
      return;
    }

    setLoadingIA(true);
    try {
      const unidadesLista = objetivos
        .map((oa) => `- ${oa.code}: ${oa.description}`)
        .join("\n");

      const prompt = `Eres un planificador pedagógico experto. Genera una planificación anual dividida en unidades para la asignatura \"${tipo?.asignatura}\".\n\nObjetivos de aprendizaje:\n${unidadesLista}\n\nPeriodo: ${fechas.inicio} al ${fechas.termino} (~${totalSemanas} semanas). Devuelve SOLO un array JSON como este:\n[ { \"titulo\": \"...\", \"semanas\": \"...\", \"objetivos\": \"...\" } ]`;

      const res = await fetch(ROUTES[provider], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      }).catch((e) => {
        throw new Error("No se pudo conectar con la API (" + e.message + ")");
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error("IA respondió " + res.status +": " + txt);
      }

      const data = await res.json();
      const match = data.reply?.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (!match) throw new Error("La IA no devolvió un JSON de unidades válido");

      const generadas: Unidad[] = JSON.parse(match[0]).map((u: any) => ({
        titulo: u.titulo ?? "",
        semanas: String(u.semanas ?? ""),
        objetivos: u.objetivos ?? "",
      }));

      setUnidades(generadas);
    } catch (err: any) {
      console.error("Error IA unidades:", err);
      alert(err.message || "No se pudieron generar unidades");
    } finally {
      setLoadingIA(false);
    }
  };

  /* ───── UI ───── */
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold">📦 Planificación por Unidades</h2>
      <p className="text-muted-foreground">Ingresa manualmente o genera con IA.</p>

      {/* selector de proveedor */}
      <div className="flex items-center gap-3">
        <label className="text-sm flex items-center gap-1">
          <input type="radio" name="prov" value="deepSeek" checked={provider === "deepSeek"} onChange={() => setProvider("deepSeek")}/> ChatGPT/DeepSeek
        </label>
        <label className="text-sm flex items-center gap-1">
          <input type="radio" name="prov" value="gemini" checked={provider === "gemini"} onChange={() => setProvider("gemini")}/> Gemini 1.5 Flash
        </label>
      </div>

      {totalSemanas && (
        <p className="text-sm text-muted-foreground">🗓️ ~{totalSemanas} semanas lectivas.</p>
      )}

      <Button onClick={generarConIA} variant="ghost" disabled={loadingIA} className="flex items-center gap-2 text-blue-600 cursor-pointer">
        <FiZap className={loadingIA ? "animate-spin" : ""} /> Generar con IA
      </Button>

      {unidades.map((u, idx) => (
        <div key={idx} className="border p-4 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Unidad {idx + 1}</h3>
            <button onClick={() => removeUnidad(idx)} className="text-red-500 hover:text-red-700 cursor-pointer">
              <FiTrash />
            </button>
          </div>
          <Input placeholder="Título de la unidad" value={u.titulo} onChange={(e) => handleChange(idx, "titulo", e.target.value)} />
          <Input placeholder="Semanas (ej: 4)" value={u.semanas} onChange={(e) => handleChange(idx, "semanas", e.target.value)} />
          <Textarea placeholder="Objetivos de aprendizaje" value={u.objetivos} onChange={(e) => handleChange(idx, "objetivos", e.target.value)} />
        </div>
      ))}

      <Button onClick={addUnidad} variant="outline" className="flex items-center gap-2 cursor-pointer"><FiPlus /> Agregar unidad</Button>

      <div className="flex justify-between my-6">
        <Button variant="ghost" onClick={back} className="cursor-pointer">← Volver</Button>
        <Button onClick={handleNext}>Siguiente →</Button>
      </div>
    </div>
  );
}
