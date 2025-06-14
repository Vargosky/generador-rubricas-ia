/* StepRecursosPresupuesto.tsx – recursos, costo, fuente y checkbox “Disponible” */
"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useWizard } from "../WizardProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FiPlus, FiTrash, FiZap } from "react-icons/fi";

/* ───────── tipos ───────── */
interface Recurso {
  nombre: string;
  unidad: string;
  descripcion: string;
  costo: string | number;                 // string si está vacío
  fuente: "SEP" | "FAEP" | "Municipal" | "Interno" | "Otro";
  disponible: boolean;
}

const ROUTES = {
  deepSeek: "/api/enviarPromptDeepSeek",
  gemini:   "/api/enviarPromptGemini",
} as const;

const FUENTES = ["SEP", "FAEP", "Municipal", "Interno", "Otro"] as const;

/* ───────── componente ───────── */
export default function StepRecursosPresupuesto() {
  const { saveStep, next, back, getStep } = useWizard();

  /* datos previos */
  const unidades    = getStep("unidades") || [];
  const actividades = [...(getStep("actividades") || []), ...(getStep("actividadesLudicas") || [])];

  /* estado */
  const [recursos, setRecursos] = useState<Recurso[]>(getStep("recursos") || []);
  const [loadingIA, setLoadingIA] = useState(false);
  const [provider, setProvider] = useState<"deepSeek" | "gemini">("deepSeek");

  /* ───────── helpers ───────── */
  const addEmpty = () =>
    setRecursos([
      ...recursos,
      {
        nombre: "",
        unidad: unidades[0]?.titulo || "General",
        descripcion: "",
        costo: "",
        fuente: "Interno",
        disponible: false,
      },
    ]);

  const update = (i: number, field: keyof Recurso, value: any) =>
    setRecursos((rs) => rs.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));

  const remove = (i: number) => setRecursos((rs) => rs.filter((_, idx) => idx !== i));

  /* total solicitado (solo recursos no disponibles) */
  const totalSolicitado = useMemo(
    () =>
      recursos.reduce(
        (sum, r) => (r.disponible ? sum : sum + Number(r.costo || 0)),
        0
      ),
    [recursos]
  );

  /* ───────── IA (opcional) ───────── */
  const generarConIA = async () => {
    if (!actividades.length) {
      alert("No hay actividades para estimar recursos.");
      return;
    }
    setLoadingIA(true);
    try {
      const actTxt = actividades
        .slice(0, 8)
        .map((a: any) => `- ${a.nombre}: ${a.detalle || a.descripcion || ""}`)
        .join("\n");

      const prompt = `Eres experto en gestión escolar. Sugiere recursos y costo estimado para:\n${actTxt}\nDevuelve JSON:\n[{\"nombre\":\"...\",\"unidad\":\"...\",\"descripcion\":\"...\",\"costo\":10000,\"fuente\":\"SEP\",\"disponible\":false}]`;

      const res = await fetch(ROUTES[provider], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const match = data.reply?.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (!match) throw new Error("La IA no devolvió JSON válido.");

      setRecursos(JSON.parse(match[0]));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoadingIA(false);
    }
  };

  /* ───────── guardar ───────── */
  const handleNext = () => {
    if (!recursos.length) {
      alert("Agrega al menos un recurso.");
      return;
    }
    const inval = recursos.find(
      (r) => !r.nombre.trim() || (!r.disponible && Number(r.costo) <= 0)
    );
    if (inval) {
      alert("Completa nombre y costo válido (o marca Disponible) en todos los recursos.");
      return;
    }
    saveStep("recursos", recursos);
    next();
  };

  /* ───────── UI ───────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl space-y-6 rounded-2xl bg-[#131C31] p-8 text-white shadow-lg"
    >
      <h2 className="text-2xl font-bold">Paso · Recursos y Presupuesto</h2>

      {/* selector IA */}
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={provider === "deepSeek"}
            onChange={() => setProvider("deepSeek")}
          />
          ChatGPT
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={provider === "gemini"}
            onChange={() => setProvider("gemini")}
          />
          Gemini
        </label>
      </div>

      <Button
        onClick={generarConIA}
        variant="ghost"
        disabled={loadingIA}
        className="flex items-center gap-2 text-blue-400"
      >
        <FiZap className={loadingIA ? "animate-spin" : ""} /> Generar con IA
      </Button>

      {/* lista recursos */}
      <div className="space-y-3">
        {recursos.map((r, idx) => (
          <div key={idx} className="bg-slate-800 p-4 rounded-lg space-y-2">
            {/* fila nombre + delete */}
            <div className="flex justify-between items-center">
              <Input
                value={r.nombre}
                onChange={(e) => update(idx, "nombre", e.target.value)}
                placeholder="Nombre recurso"
                className="flex-1 mr-2"
              />
              <button
                onClick={() => remove(idx)}
                className="text-red-400 hover:text-red-600"
              >
                <FiTrash />
              </button>
            </div>

            <div className="grid md:grid-cols-5 gap-2 text-sm">
              {/* unidad */}
              <select
                value={r.unidad}
                onChange={(e) => update(idx, "unidad", e.target.value)}
                className="rounded bg-slate-700 p-2"
              >
                <option value="General">General</option>
                {unidades.map((u: any) => (
                  <option key={u.titulo} value={u.titulo}>
                    {u.titulo}
                  </option>
                ))}
              </select>

              {/* descripción */}
              <Textarea
                value={r.descripcion}
                onChange={(e) => update(idx, "descripcion", e.target.value)}
                placeholder="Descripción"
              />

              {/* disponible */}
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={r.disponible}
                  onChange={(e) =>
                    update(idx, "disponible", e.target.checked)
                  }
                />
                Disponible
              </label>

              {/* costo */}
              <Input
                type="number"
                min={0}
                value={r.disponible ? "" : String(r.costo)}
                onChange={(e) => update(idx, "costo", e.target.value)}
                placeholder="Costo CLP"
                disabled={r.disponible}
                className={
                  r.disponible ? "opacity-50 cursor-not-allowed" : ""
                }
              />

              {/* fuente */}
              <select
                value={r.fuente}
                onChange={(e) =>
                  update(idx, "fuente", e.target.value as any)
                }
                className="rounded bg-slate-700 p-2"
                disabled={r.disponible}
              >
                {FUENTES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={addEmpty}
        variant="outline"
        className="flex items-center gap-2"
      >
        <FiPlus /> Agregar recurso
      </Button>

      {/* total */}
      <p className="text-right text-lg font-semibold mt-3">
        Total solicitado:{" "}
        {totalSolicitado.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        })}
      </p>

      <div className="flex justify-between pt-5">
        <Button variant="ghost" onClick={back}>
          ← Atrás
        </Button>
        <Button onClick={handleNext}>Siguiente →</Button>
      </div>
    </motion.div>
  );
}
