"use client";

import { useState } from "react";
import { useWizard } from "../WizardProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FiPlus, FiTrash, FiZap } from "react-icons/fi";

interface Unidad {
  titulo: string;
  semanas: string | number; // admite número o texto
  objetivos: string;
}

export default function StepUnidades() {
  const { next, back, saveStep, getStep } = useWizard();
  const initialData: Unidad[] = getStep("unidades") || [];

  const [unidades, setUnidades] = useState<Unidad[]>(initialData);
  const [loadingIA, setLoadingIA] = useState(false);

  /* ───────────── datos previos ───────────── */
  const fechas = getStep("fechas") || {};
  const tipo = getStep("tipo") || {};
  const objetivos: any[] = getStep("objetivos") || [];

  const totalSemanas = fechas.inicio && fechas.termino
    ? calcularSemanas(fechas.inicio, fechas.termino)
    : null;

  /* ───────────── helpers ───────────── */
  const handleChange = (index: number, field: keyof Unidad, value: string) => {
    const nuevas = [...unidades];
    nuevas[index] = { ...nuevas[index], [field]: value } as Unidad;
    setUnidades(nuevas);
  };

  const addUnidad = () => {
    setUnidades([...unidades, { titulo: "", semanas: "", objetivos: "" }]);
  };

  const removeUnidad = (index: number) => {
    setUnidades(unidades.filter((_, i) => i !== index));
  };

  /* ───────────── validación + guardar ───────────── */
  const handleNext = () => {
    const vacias = unidades.some((u) => {
      const semanasTxt = String(u.semanas ?? "").trim();
      return !u.titulo.trim() || !semanasTxt || !u.objetivos.trim();
    });

    if (vacias) {
      alert("Por favor completa todos los campos de cada unidad.");
      return;
    }

    // normalizar semanas a string
    const normalizadas = unidades.map((u) => ({
      ...u,
      semanas: String(u.semanas).trim(),
    }));

    saveStep("unidades", normalizadas);
    next();
  };

  /* ───────────── generación IA ───────────── */
  const generarConIA = async () => {
    if (!Array.isArray(objetivos) || objetivos.length === 0) {
      alert("No hay objetivos disponibles para generar las unidades.");
      return;
    }
    if (!fechas.inicio || !fechas.termino) {
      alert("Debes definir las fechas primero.");
      return;
    }

    setLoadingIA(true);
    try {
      const prompt = `Eres un planificador pedagógico experto. Necesito que generes una planificación anual dividida en unidades para la asignatura "${tipo?.asignatura}".\n\nObjetivos de aprendizaje:\n${objetivos
        .map((oa) => `- ${oa.code}: ${oa.description}`)
        .join("\n")}\n\nPeriodo lectivo: desde el ${fechas.inicio} hasta el ${fechas.termino}, equivalente a ${totalSemanas} semanas. Divide los objetivos en unidades equilibradas y devuelve un array JSON así:\n[ { \"titulo\": \"...\", \"semanas\": "...", \"objetivos\": \"...\" } ]`;

      const res = await fetch("/api/enviarPromptDeepSeek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const match = data.reply?.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (!match) throw new Error("Respuesta IA inválida");

      const generadas: Unidad[] = JSON.parse(match[0]).map((u: any) => ({
        titulo: u.titulo ?? "",
        semanas: String(u.semanas ?? ""),
        objetivos: u.objetivos ?? "",
      }));

      setUnidades(generadas);
    } catch (err) {
      console.error("Error IA unidades:", err);
      alert("No se pudieron generar unidades automáticamente.");
    } finally {
      setLoadingIA(false);
    }
  };

  /* ───────────── util ───────────── */
  function calcularSemanas(inicio: string, termino: string) {
    const i = new Date(inicio);
    const t = new Date(termino);
    return Math.ceil((t.getTime() - i.getTime()) / (1000 * 60 * 60 * 24 * 7));
  }

  /* ───────────── UI ───────────── */
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">📦 Planificación por Unidades</h2>
      <p className="text-muted-foreground">Ingresa manualmente las unidades o genera una propuesta automática con IA.</p>

      {totalSemanas && (
        <p className="text-sm text-muted-foreground">
          🗓️ Este periodo contiene aproximadamente <strong>{totalSemanas}</strong> semanas lectivas.
        </p>
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
          <Input placeholder="Cantidad de semanas (ej: 4)" value={u.semanas} onChange={(e) => handleChange(idx, "semanas", e.target.value)} />
          <Textarea placeholder="Objetivos de aprendizaje (puedes enumerarlos o describir)" value={u.objetivos} onChange={(e) => handleChange(idx, "objetivos", e.target.value)} />
        </div>
      ))}

      <Button onClick={addUnidad} variant="outline" className="flex items-center gap-2 cursor-pointer">
        <FiPlus /> Agregar unidad
      </Button>

      <div className="flex justify-between my-6">
        <Button variant="ghost" onClick={back} className="cursor-pointer">
          ← Volver
        </Button>
        <Button onClick={handleNext}>Siguiente →</Button>
      </div>
    </div>
  );
}
