"use client";
import { useState } from "react";
import { promptRefinarRubrica, generarPromptEvaluacionMatriz } from "../util/prompts";
import { FiTrash, FiPlus, FiSettings, FiBookOpen, FiTarget, FiList } from "react-icons/fi";

export default function Home() {
  const [tipoRubrica, setTipoRubrica] = useState<string>("analitica");
  const [objetivos, setObjetivos] = useState<{ descripcion: string; puntaje: number }[]>([{ descripcion: "", puntaje: 0 }]);
  const [criterios, setCriterios] = useState<{
    nombre: string;
    peso: number;
    niveles: { nivel: number; porcentaje: number; descripcion: string }[];
  }[]>([
    {
      nombre: "Conceptual",
      peso: 15,
      niveles: [
        { nivel: 1, porcentaje: 60, descripcion: "" },
        { nivel: 2, porcentaje: 70, descripcion: "" },
        { nivel: 3, porcentaje: 80, descripcion: "" },
        { nivel: 4, porcentaje: 100, descripcion: "" }
      ]
    }
  ]);
  const [promptGenerado, setPromptGenerado] = useState<string | null>(null);
  const [respuestaIA, setRespuestaIA] = useState<string | null>(null);
  const [respuestaJSON, setRespuestaJSON] = useState<any>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  const handleChangeObjetivo = (index: number, field: string, value: string | number) => {
    const nuevos = [...objetivos];
    // @ts-ignore
    nuevos[index][field] = value;
    setObjetivos(nuevos);
  };
  const agregarObjetivo = () => setObjetivos([...objetivos, { descripcion: "", puntaje: 0 }]);
  const quitarObjetivo = (index: number) => setObjetivos(objetivos.filter((_, i) => i !== index));

  const handleChangeNivel = (ci: number, ni: number, field: string, value: string | number) => {
    const updated = [...criterios];
    // @ts-ignore
    updated[ci].niveles[ni][field] = value;
    setCriterios(updated);
  };
  const agregarCriterio = () => setCriterios([
    ...criterios,
    {
      nombre: "Nuevo Criterio",
      peso: 0,
      niveles: [
        { nivel: 1, porcentaje: 60, descripcion: "" },
        { nivel: 2, porcentaje: 70, descripcion: "" },
        { nivel: 3, porcentaje: 80, descripcion: "" },
        { nivel: 4, porcentaje: 100, descripcion: "" }
      ]
    }
  ]);
  const quitarCriterio = (index: number) => setCriterios(criterios.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const asignatura = data.get("asignatura") as string;
    const oa = data.get("oa") as string;
    const formula = data.get("formula") as string;

    let prompt = "";
    if (tipoRubrica === "analitica") {
      prompt = promptRefinarRubrica({ asignatura, objetivoAprendizaje: oa, objetivosEspecificos: objetivos, formula: formula || undefined });
    } else {
      const rubrica = { tipo: "matriz_niveles", criterios, escala_notas: [ { nivel: 1, nota: "4.0 a 4.9" }, { nivel: 2, nota: "5.0 a 5.9" }, { nivel: 3, nota: "6.0 a 6.9" }, { nivel: 4, nota: "7.0" } ] };
      prompt = generarPromptEvaluacionMatriz({ nombreArchivo: "Trabajo.docx", contenido: oa, rubrica });
    }
    setPromptGenerado(prompt);
    setRespuestaIA(null);
    setRespuestaJSON(null);
    setCargando(true);
    try {
      const res = await fetch("/api/enviarPrompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const dataRes = await res.json();
      setRespuestaIA(dataRes.reply || "No se recibió respuesta.");
      try {
        setRespuestaJSON(JSON.parse(dataRes.reply));
      } catch {
        setRespuestaJSON(null);
      }
    } catch {
      setRespuestaIA("Hubo un error al enviar el prompt.");
    }
    setCargando(false);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">🧠 Generador de Rúbricas con IA</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center gap-2 mb-1 font-medium"><FiBookOpen /> Asignatura</label>
          <input name="asignatura" className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" required />
        </div>
        <div>
          <label className="flex items-center gap-2 mb-1 font-medium"><FiTarget /> Objetivo de Aprendizaje / Contenido</label>
          <textarea name="oa" className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" rows={3} required />
        </div>
        <div>
          <label className="flex items-center gap-2 mb-1 font-medium"><FiList /> Tipo de Rúbrica</label>
          <select value={tipoRubrica} onChange={e => setTipoRubrica(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600">
            <option value="analitica">Analítica</option>
            <option value="matriz">Matriz con niveles</option>
          </select>
        </div>

        {/* Analítica */}
        {tipoRubrica === "analitica" && (
          <>
            <div>
              <label className="block mb-2 font-medium">🎯 Objetivos Específicos</label>
              {objetivos.map((obj, idx) => (
                <div key={idx} className="mb-2 flex gap-2 items-center border p-2 rounded dark:border-gray-700">
                  <input type="text" placeholder="Descripción" value={obj.descripcion} onChange={e => handleChangeObjetivo(idx, "descripcion", e.target.value)} className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600" required />
                  <input type="number" placeholder="Puntaje" value={obj.puntaje} onChange={e => handleChangeObjetivo(idx, "puntaje", Number(e.target.value))} className="w-24 p-2 border rounded dark:bg-gray-800 dark:border-gray-600" required />
                  <button type="button" onClick={() => quitarObjetivo(idx)} className="text-red-500 flex items-center gap-1"><FiTrash /> Quitar</button>
                </div>
              ))}
              <button type="button" onClick={agregarObjetivo} className="mt-2 flex items-center gap-1 text-blue-500 underline"><FiPlus /> Agregar Objetivo</button>
            </div>
            <div>
              <label className="block mb-1 font-medium">🧮 Fórmula para nota (opcional)</label>
              <input type="text" name="formula" className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" placeholder="Ej: (puntaje * 0.5) + 1" />
            </div>
          </>
        )}

        {/* Matriz */}
        {tipoRubrica === "matriz" && (
          <div className="space-y-6">
            {criterios.map((c, idx) => (
              <div key={idx} className="border p-4 rounded relative dark:border-gray-700">
                <button type="button" onClick={() => quitarCriterio(idx)} className="absolute top-2 right-2 text-red-500"><FiTrash /></button>
                <input value={c.nombre} onChange={e => { const up = [...criterios]; up[idx].nombre = e.target.value; setCriterios(up); }} className="font-semibold mb-2 w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" />
                <input type="number" value={c.peso} onChange={e => { const up = [...criterios]; up[idx].peso = Number(e.target.value); setCriterios(up); }} className="mb-4 w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600" placeholder="Peso (%)" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {c.niveles.map((n, j) => (
                    <div key={j} className="border rounded p-2 dark:border-gray-700">
                      <strong>Nivel {n.nivel} ({n.porcentaje}%)</strong>
                      <textarea rows={2} value={n.descripcion} onChange={e => handleChangeNivel(idx, j, "descripcion", e.target.value)} className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600" placeholder={`Descripción nivel ${n.nivel}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button type="button" onClick={agregarCriterio} className="mt-4 flex items-center gap-2 text-blue-600 underline"><FiPlus /> Agregar Criterio</button>
          </div>
        )}

        <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"><FiSettings /> Generar Prompt</button>
      </form>

      {promptGenerado && (
        <div className="mt-10 space-y-6">
          <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">🧠 Prompt enviado a la IA</h2>
            <pre className="whitespace-pre-wrap text-sm">{promptGenerado}</pre>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 border p-4 rounded shadow-sm overflow-auto dark:border-gray-700">
              <h2 className="text-xl font-bold mb-2">📋 Rúbrica generada</h2>
              {respuestaJSON?.criterios?.length ? (
                <table className="table-auto w-full text-sm border dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="border px-2 py-1 text-left">#</th>
                      <th className="border px-2 py-1 text-left">Criterio</th>
                      <th className="border px-2 py-1 text-left">Nivel</th>
                      <th className="border px-2 py-1 text-left">Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {respuestaJSON.criterios.map((c: any, i: number) => (
                      <tr key={i}>
                        <td className="border px-2 py-1">{i + 1}</td>
                        <td className="border px-2 py-1">{c.nombre}</td>
                        <td className="border px-2 py-1">{c.nivel}</td>
                        <td className="border px-2 py-1">{c.descripcion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No se pudo mostrar la rúbrica en formato tabla.</p>
              )}
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 border p-4 rounded overflow-auto dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">📦 Respuesta JSON completa</h2>
                <button
                  className="text-blue-600 text-sm underline hover:text-blue-800"
                  onClick={() => {
                    if (respuestaIA) {
                      navigator.clipboard.writeText(respuestaIA);
                      alert("Respuesta copiada al portapapeles ✅");
                    }
                  }}
                >
                  Copiar
                </button>
              </div>
              {cargando ? (
                <p className="text-gray-500">Enviando solicitud a DeepSeek...</p>
              ) : (
                <pre className="whitespace-pre-wrap text-sm">{respuestaIA}</pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
