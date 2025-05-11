"use client";
import { useState } from "react";
import { promptGeneraInstrumento } from "@/util/prompts";
import SelectorObjetivosInverso from "./SelectorObjetivosInverso";
import InstrumentoPreview from "@/components/InstrumentoPreview";


const asignaturasJSON = [
  "tecnologia",
  "lenguaje",
  "matematicas",
  "artes_visuales",
  "ciencias_naturales",
  "historia",
  "ingles",
  "musica",
  "orientacion",
];

export default function PlanificacionInversePage() {
  const [trabajoProgresivo, setTrabajoProgresivo] = useState(false);
  const [evaluaciones, setEvaluaciones] = useState<
    { descripcion: string; puntaje: number }[]
  >([]);
  const [dificultad, setDificultad] = useState(5);
  const [asignatura, setAsignatura] = useState("");
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  const [alternativas, setAlternativas] = useState(0);
  const [desarrollo, setDesarrollo] = useState(0);
  const [tipoRubrica, setTipoRubrica] = useState<
    "tabla_cotejo" | "matriz_niveles"
  >("tabla_cotejo");
  const [respuestaIA, setRespuestaIA] = useState("");
  const [error, setError] = useState("");

  /* ----------------------------- helpers ----------------------------- */

  const handleEvaluacionChange = (
    index: number,
    field: "descripcion" | "puntaje",
    value: string | number
  ) => {
    const nueva = [...evaluaciones];
    // @ts-ignore – guardamos string o number según el field
    nueva[index][field] = value;
    setEvaluaciones(nueva);
  };

  const agregarEvaluacion = () =>
    setEvaluaciones((prev) => [...prev, { descripcion: "", puntaje: 0 }]);

  /** Agrega desde el selector inverso */
  const agregarDesdeSelector = (obj: { descripcion: string; puntaje: number }) =>
    setEvaluaciones((prev) => [...prev, obj]);

  const enviarAIA = async () => {
    if (!trabajoProgresivo) {
      const total = evaluaciones.reduce((acc, cur) => acc + cur.puntaje, 0);
      if (total !== puntajeTotal) {
        setError("La suma de los puntajes no coincide con el puntaje total");
        return;
      }
    }
    setError("");

    const payload = {
      asignatura,
      objetivoAprendizaje: evaluaciones
        .map((e) => e.descripcion)
        .join(" | "),
      objetivosEspecificos: evaluaciones,
      numPreguntasAlternativas: alternativas,
      numPreguntasDesarrollo: desarrollo,
      formula: trabajoProgresivo
        ? undefined
        : `nota = (${puntajeTotal} * 0.6 + ${alternativas + desarrollo
        } * 0.4) / 100`,
      tipoRubrica,
      dificultad,
    };

    const res = await fetch("/api/enviarPromptDeepSeek/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptGeneraInstrumento(payload) }),
    });

    const data = await res.json();
    setRespuestaIA(data.reply || "Error al obtener respuesta");
  };

  /* --------------------------- UI principal -------------------------- */

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Planificación Inversa</h1>

      <form className="space-y-6">
        {/* ----------- DATOS GENERALES (asignatura única) ----------- */}
        <fieldset className="border border-gray-700 rounded p-4">
          <legend className="text-lg font-semibold">Datos generales</legend>

          <label className="block mb-1">Asignatura</label>
          <select
            value={asignatura}
            onChange={(e) => setAsignatura(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          >
            <option value="">-- Selecciona una asignatura --</option>
            {asignaturasJSON.map((asig) => (
              <option key={asig} value={asig}>
                {asig
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </fieldset>

        {/* ----------- OBJETIVOS ESPECÍFICOS ----------- */}
        <fieldset className="border border-gray-700 rounded p-4">
          <legend className="text-lg font-semibold">Objetivos específicos</legend>

          {/*  👉 el selector ahora recibe la asignatura ya elegida  */}
          <SelectorObjetivosInverso
            asignatura={asignatura}
            onAgregarObjetivo={agregarDesdeSelector}
          />
        </fieldset>

        {/* ----------- ¿QUÉ QUIERO EVALUAR? ----------- */}
        <fieldset className="border border-gray-700 rounded p-4">
          <legend className="text-lg font-semibold">¿Qué quiero evaluar?</legend>

          {evaluaciones.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 mb-2">
              <input
                type="text"
                placeholder="Indicador…"
                value={item.descripcion}
                onChange={(e) =>
                  handleEvaluacionChange(idx, "descripcion", e.target.value)
                }
                className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
              />
              <input
                type="number"
                min={0}
                max={100}
                placeholder="%"
                value={isNaN(item.puntaje) ? "" : item.puntaje}
                onChange={(e) =>
                  handleEvaluacionChange(
                    idx,
                    "puntaje",
                    e.target.value === "" ? 0 : parseInt(e.target.value)
                  )
                }
                className="w-20 p-2 bg-gray-800 border border-gray-700 rounded"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={agregarEvaluacion}
            className="mt-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
          >
            + Agregar criterio
          </button>
        </fieldset>

        {/* ----------- RESTO DEL FORMULARIO (puntajes, IA, etc.) ----------- */}
        {!trabajoProgresivo && (
          <fieldset className="border border-gray-700 rounded p-4">
            <legend className="text-lg font-semibold">Puntaje y preguntas</legend>

            <label className="block mb-1">Puntaje total</label>
            <input
              type="number"
              value={puntajeTotal}
              onChange={(e) => setPuntajeTotal(+e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            />
            <p className="text-sm text-gray-400 mt-1">
              Fórmula:{" "}
              <code>
                nota = ({puntajeTotal} * 0.6 +{" "}
                {alternativas + desarrollo} * 0.4) / 100
              </code>
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-1">Preguntas alternativas</label>
                <input
                  type="number"
                  value={alternativas}
                  onChange={(e) => setAlternativas(+e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Preguntas de desarrollo</label>
                <input
                  type="number"
                  value={desarrollo}
                  onChange={(e) => setDesarrollo(+e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                />
              </div>
            </div>
          </fieldset>
        )}

        {error && <p className="text-red-400 text-sm">⚠️ {error}</p>}

        <div className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={trabajoProgresivo}
            onChange={(e) => setTrabajoProgresivo(e.target.checked)}
          />
          <label>Trabajo progresivo (desactiva campos de puntaje)</label>
        </div>

        <div>
          <label className="block mb-1">Tipo de rúbrica</label>
          <select
            value={tipoRubrica}
            onChange={(e) =>
              setTipoRubrica(
                e.target.value as "tabla_cotejo" | "matriz_niveles"
              )
            }
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          >
            <option value="tabla_cotejo">Tabla de cotejo</option>
            <option value="matriz_niveles">Matriz de niveles</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Dificultad</label>
          <input
            type="range"
            min={1}
            max={10}
            value={dificultad}
            onChange={(e) => setDificultad(+e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-gray-400 mt-1">
            Nivel:{" "}
            {dificultad <= 2
              ? "Muy baja"
              : dificultad <= 4
                ? "Baja"
                : dificultad <= 6
                  ? "Media"
                  : dificultad <= 8
                    ? "Difícil"
                    : "Muy difícil"}
          </p>
        </div>

        <button
          type="button"
          onClick={enviarAIA}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          Generar instrumento con IA
        </button>
      </form>

      {respuestaIA && <InstrumentoPreview jsonString={respuestaIA} />}

    </div>
  );
}
