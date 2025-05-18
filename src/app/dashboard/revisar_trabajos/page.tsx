"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";

/* 
   ►► Si instalaste el Select avanzado de shadcn, mantén estos 4 imports.
   ►► Si creaste tu propio Select “nativo”, deja solo `Select` y comenta los demás.
*/
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

/* ---------- formularios de rúbrica dummy ---------- */
function RubricaMatriz() {
  return (
    <div className="space-y-4">
      <Label>Niveles (ej. 1-4)</Label>
      <Input placeholder="Ej: 1, 2, 3, 4" />
      <Label>Criterios (uno por línea)</Label>
      <textarea className="w-full bg-gray-800 p-2 rounded" rows={4} />
    </div>
  );
}
function RubricaCotejo() {
  return (
    <div className="space-y-4">
      <Label>Ítems a cotejar (uno por línea)</Label>
      <textarea className="w-full bg-gray-800 p-2 rounded" rows={6} />
    </div>
  );
}
function RubricaAnalitica() {
  return (
    <div className="space-y-4">
      <Label>Criterios y pesos (JSON o tabla)</Label>
      <textarea className="w-full bg-gray-800 p-2 rounded" rows={6} />
    </div>
  );
}
function RubricaHolistica() {
  return (
    <div className="space-y-4">
      <Label>Descripción de los niveles holísticos</Label>
      <textarea className="w-full bg-gray-800 p-2 rounded" rows={6} />
    </div>
  );
}

/* ---------- page ---------- */
export default function CorreccionPage() {
  const { control, watch } = useForm({ defaultValues: { tipo: "matriz" } });
  const tipo = watch("tipo");

  const [archivos, setArchivos] = useState<{ name: string; url: string }[]>([]);

  /* UploadThing entrega por defecto { url, name, size, key } */
  const handleUpload = (
    files: { url: string; name: string }[] // simplificado
  ) => {
    setArchivos(files.map((f) => ({ name: f.name, url: f.url })));
  };

  return (
    <main className="min-h-screen p-8 bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Sistema de corrección automática</h1>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* ----------- columna rúbrica ----------- */}
        <section className="space-y-6 rounded-2xl bg-slate-800/60 p-6 backdrop-blur">
          <h2 className="text-xl font-semibold">Configurar rúbrica</h2>

          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Tipo de rúbrica</Label>

                {/*  Usa tu Select */}
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-slate-700">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matriz">Matriz de niveles</SelectItem>
                    <SelectItem value="cotejo">Lista de cotejo</SelectItem>
                    <SelectItem value="analitica">Analítica por criterios</SelectItem>
                    <SelectItem value="holistica">Holística</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          {/* formulario condicional */}
          <AnimatePresence mode="wait">
            {tipo === "matriz" && (
              <motion.div key="matriz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <RubricaMatriz />
              </motion.div>
            )}
            {tipo === "cotejo" && (
              <motion.div key="cotejo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <RubricaCotejo />
              </motion.div>
            )}
            {tipo === "analitica" && (
              <motion.div key="analitica" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <RubricaAnalitica />
              </motion.div>
            )}
            {tipo === "holistica" && (
              <motion.div key="holistica" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <RubricaHolistica />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ----------- columna archivos ----------- */}
        <section className="space-y-6 rounded-2xl bg-slate-800/60 p-6 backdrop-blur">
          <h2 className="text-xl font-semibold">Archivos a corregir</h2>

          {/* sin genéricos → TypeScript infiere OurFileRouter y “uploads” */}
<UploadDropzone<OurFileRouter, "uploads">
  endpoint="uploads"
  onClientUploadComplete={(files) =>
    setArchivos(files.map((f) => ({ name: f.name, url: f.url })))
  }
  appearance={{
    container:
      "border-2 border-dashed border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center",
  }}
/>

          {archivos.length > 0 && (
            <ul className="space-y-2">
              {archivos.map((f) => (
                <li key={f.url} className="flex items-center justify-between bg-slate-700 px-3 py-2 rounded">
                  <span className="truncate">{f.name}</span>
                  <a href={f.url} target="_blank" className="text-indigo-400 text-sm underline">
                    Ver
                  </a>
                </li>
              ))}
            </ul>
          )}

          <Button className="w-full mt-4">Revisar con IA</Button>
        </section>
      </div>
    </main>
  );
}
