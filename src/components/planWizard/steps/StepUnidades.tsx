"use client";

import { useState } from "react";
import { useWizard } from "../WizardProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FiPlus, FiTrash, FiZap } from "react-icons/fi";

interface Unidad {
  titulo: string;
  semanas: string;
  objetivos: string;
}

export default function StepUnidades() {
  const { next, back, saveStep, getStep } = useWizard();
  const initialData: Unidad[] = getStep("unidades") || [];

  const [unidades, setUnidades] = useState<Unidad[]>(initialData);
  const [loadingIA, setLoadingIA] = useState(false);

  const fechas = getStep("fechas") || {};
  const tipo = getStep("tipo") || {};
  const objetivos: any[] = getStep("objetivos") || [];

  const totalSemanas = fechas.inicio && fechas.termino
    ? calcularSemanas(fechas.inicio, fechas.termino)
    : null;

  const handleChange = (index: number, field: keyof Unidad, value: string) => {
    const newUnidades = [...unidades];
    newUnidades[index] = { ...newUnidades[index], [field]: value };
    setUnidades(newUnidades);
  };

  const addUnidad = () => {
    setUnidades([...unidades, { titulo: "", semanas: "", objetivos: "" }]);
  };

  const removeUnidad = (index: number) => {
    setUnidades(unidades.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    const vacias = unidades.some(
      (u) => !u.titulo.trim() || !u.semanas.trim() || !u.objetivos.trim()
    );
    if (vacias) {
      alert("Por favor completa todos los campos de cada unidad.");
      return;
    }

    saveStep("unidades", unidades);
    next();
  };

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
      const prompt = `
Eres un planificador pedagógico experto. Necesito que generes una planificación anual dividida en unidades para la asignatura "${tipo?.asignatura}".

Objetivos de aprendizaje:
${objetivos.map((oa) => `- ${oa.code}: ${oa.description}`).join("\n")}

Periodo lectivo: desde el ${fechas.inicio} hasta el ${fechas.termino}, lo que equivale aproximadamente a ${totalSemanas} semanas lectivas.

Divide los objetivos en unidades temáticas equilibradas. Cada unidad debe tener:
- Título
- Cantidad de semanas (aproximada)
- Objetivos abordados

Devuelve solo un array JSON como este:

[
  {
    "titulo": "...",
    "semanas": "...",
    "objetivos": "..."
  }
]
`;

      const res = await fetch("/api/enviarPromptDeepSeek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok || !data.reply) throw new Error("Error en respuesta de IA");

      const match = data.reply.match(/\[\s*{[\s\S]*?}\s*\]/);
      const unidadesGeneradas = JSON.parse(match?.[0] || "[]");

      setUnidades(unidadesGeneradas);
    } catch (error) {
      console.error("Error al llamar a la IA:", error);
      alert("Hubo un problema al generar las unidades con IA.");
    } finally {
      setLoadingIA(false);
    }
  };

  function calcularSemanas(inicio: string, termino: string) {
    const fechaInicio = new Date(inicio);
    const fechaTermino = new Date(termino);
    const msEnUnaSemana = 1000 * 60 * 60 * 24 * 7;
    const diferencia = fechaTermino.getTime() - fechaInicio.getTime();
    return Math.ceil(diferencia / msEnUnaSemana);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">📦 Planificación por Unidades</h2>
      <p className="text-muted-foreground">
        Ingresa manualmente las unidades o genera una propuesta automática con IA.
      </p>

      {totalSemanas && (
        <p className="text-sm text-muted-foreground">
          🗓️ Este periodo contiene aproximadamente <strong>{totalSemanas}</strong> semanas lectivas.
        </p>
      )}

      <Button
        onClick={generarConIA}
        variant="ghost"
        className="flex items-center gap-2 text-blue-600"
        disabled={loadingIA}
      >
        <FiZap className={loadingIA ? "animate-spin" : ""} /> Generar con IA
      </Button>

      {unidades.map((unidad, index) => (
        <div key={index} className="border p-4 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Unidad {index + 1}</h3>
            <button
              onClick={() => removeUnidad(index)}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash />
            </button>
          </div>

          <Input
            placeholder="Título de la unidad"
            value={unidad.titulo}
            onChange={(e) => handleChange(index, "titulo", e.target.value)}
          />
          <Input
            placeholder="Cantidad de semanas (ej: 4)"
            value={unidad.semanas}
            onChange={(e) => handleChange(index, "semanas", e.target.value)}
          />
          <Textarea
            placeholder="Objetivos de aprendizaje (puedes enumerarlos o describir)"
            value={unidad.objetivos}
            onChange={(e) => handleChange(index, "objetivos", e.target.value)}
          />
        </div>
      ))}

      <Button onClick={addUnidad} variant="outline" className="flex items-center gap-2">
        <FiPlus /> Agregar unidad
      </Button>

      <div className="flex justify-between mt-6 cursor-pointer">
        <Button className="cursor-pointer" variant="ghost" onClick={back}>
          ← Volver
        </Button>
        <Button onClick={handleNext}>Siguiente →</Button>
      </div>
    </div>
  );
}
