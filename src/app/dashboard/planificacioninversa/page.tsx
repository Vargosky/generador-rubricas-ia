
"use client";
import { useState, useEffect } from "react";

// ---------- utilidades ----------
import { promptGeneraInstrumento } from "@/util/prompts";
import { parseInstrumento } from "@/util/parseInstrumento";
import { promptClasesJson } from "@/util/prompts/promptsInverse";
import { Instrumento } from "@/types/Instrumento";
import { PlanificacionJSON } from "@/types/Planificacion";

// ---------- componentes ----------
import SelectorObjetivosInverso from "./SelectorObjetivosInverso";
import InstrumentoPreview from "@/components/InstrumentoPreview";
import PlanificacionResumenTable from "@/components/PlanificacionResumenTable";
import PlanificacionDetalleList from "@/components/PlanificacionDetalleList";

// ---------- datos fijos ----------
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
  /* ------------------------------- ESTADOS ------------------------------ */
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
  const [mostrarRaw, setMostrarRaw] = useState(false);

  // nuevos
  const [instrumento, setInstrumento] = useState<Instrumento | null>(null);
  const [numClases, setNumClases] = useState(6);
  const [docUTP, setDocUTP] = useState("");

  // planificación
  const [planClases, setPlanClases] = useState<string>("");        // texto crudo
  const [planJSON, setPlanJSON] = useState<PlanificacionJSON | null>(null); // objeto

  /* ------------------------------ HELPERS ------------------------------ */
  const handleEvaluacionChange = (
    index: number,
    field: "descripcion" | "puntaje",
    value: string | number
  ) => {
    const copia = [...evaluaciones];
    // @ts-ignore
    copia[index][field] = value;
    setEvaluaciones(copia);
  };

  const agregarEvaluacion = () =>
    setEvaluaciones((prev) => [...prev, { descripcion: "", puntaje: 0 }]);

  const agregarDesdeSelector = (obj: { descripcion: string; puntaje: number }) =>
    setEvaluaciones((prev) => [...prev, obj]);

  /* --------------------- GENERAR INSTRUMENTO (IA) --------------------- */
  const enviarAIA = async () => {
    if (!trabajoProgresivo) {
      const total = evaluaciones.reduce((sum, cur) => sum + cur.puntaje, 0);
      if (total !== puntajeTotal) {
        setError("La suma de los puntajes no coincide con el puntaje total");
        return;
      }
    }
    setError("");

    const payload = {
      asignatura,
      objetivoAprendizaje: evaluaciones.map((e) => e.descripcion).join(" | "),
      objetivosEspecificos: evaluaciones,
      numPreguntasAlternativas: alternativas,
      numPreguntasDesarrollo: desarrollo,
      formula: trabajoProgresivo
        ? undefined
        : `nota = (${puntajeTotal} * 0.6 + ${alternativas + desarrollo} * 0.4) / 100`,
      tipoRubrica,
      dificultad,
    };

    const res = await fetch("/api/enviarPromptDeepSeek", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptGeneraInstrumento(payload) }),
    });
    const data = await res.json();
    setRespuestaIA(data.reply ?? "Error al obtener respuesta");
  };

  /* -------------- Convierte respuesta IA en objeto Instrumento -------- */
  useEffect(() => {
    if (!respuestaIA) return;
    const inst = parseInstrumento(respuestaIA);
    if (inst) setInstrumento(inst);
  }, [respuestaIA]);

  /* --------------------------- UI principal --------------------------- */
  // -- el <return> empieza justo aquí abajo --

  /* --------------------------- UI principal -------------------------- */

  /* --------------------------- UI principal --------------------------- */
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Planificación Inversa</h1>

      {/* ---------- FORMULARIO PARA GENERAR EL INSTRUMENTO ---------- */}
      <form className="space-y-6">
        {/* Datos generales */}
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

        {/* Objetivos */}
        <fieldset className="border border-gray-700 rounded p-4">
          <legend className="text-lg font-semibold">Objetivos específicos</legend>
          <SelectorObjetivosInverso
            asignatura={asignatura}
            onAgregarObjetivo={agregarDesdeSelector}
          />
        </fieldset>

        {/* Criterios */}
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

        {/* Puntaje y preguntas */}
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
                nota = ({puntajeTotal} * 0.6 + {alternativas + desarrollo} * 0.4) / 100
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

        {/* switches */}
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
              setTipoRubrica(e.target.value as "tabla_cotejo" | "matriz_niveles")
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

      {/* ---------- PREVIEW DEL INSTRUMENTO + ACCIONES EXTRA ---------- */}
      {respuestaIA && (
        <>
          <InstrumentoPreview jsonString={respuestaIA} />

          <div className="mt-4">
            <button
              onClick={() => setMostrarRaw((prev) => !prev)}
              className="px-4 py-1 bg-gray-700 rounded hover:bg-gray-600 text-sm"
            >
              {mostrarRaw ? "Ocultar JSON bruto" : "Mostrar JSON bruto"}
            </button>

            {mostrarRaw && (
              <pre className="mt-2 p-2 bg-black overflow-auto max-h-96 border border-gray-700 rounded text-green-400 text-xs">
                {respuestaIA}
              </pre>
            )}
          </div>
        </>
      )}

      {/* ---------- BOTONES PARA UTP / PLANIFICACIÓN ---------- */}
      {instrumento && (
        <div className="mt-8 space-y-4">
          <label className="block">
            Nº de clases&nbsp;
            <input
              type="number"
              min={1}
              value={numClases}
              onChange={(e) => setNumClases(+e.target.value)}
              className="w-20 p-1 ml-2 bg-gray-800 border border-gray-700 rounded"
            />
          </label>

          <div className="flex gap-4">
            {/* Documento UTP */}
            <button
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
              onClick={async () => {
                const prompt = promptClasesJson(instrumento, "utp", numClases);
                const { reply } = await fetch("/api/enviarPromptDeepSeek", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ prompt }),
                }).then((r) => r.json());
                setDocUTP(reply);
              }}
            >
              Generar documento UTP
            </button>

            {/* Planificación clase a clase */}
            <button
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded"
              onClick={async () => {
                const prompt = promptClasesJson(instrumento, "", numClases);
                const { reply } = await fetch("/api/enviarPromptDeepSeek", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ prompt }),
                }).then((r) => r.json());

                setPlanClases(reply);
                try {
                  setPlanJSON(JSON.parse(reply));
                } catch {
                  setPlanJSON(null);
                }
              }}
            >
              Generar planificación
            </button>
          </div>

          {/* ---------- RESULTADOS ---------- */}
          {docUTP && (
            <section>
              <h2 className="text-xl font-semibold mt-4">Documento UTP</h2>
              <pre className="bg-black p-2 mt-2 overflow-auto border border-gray-700 rounded text-xs">
                {docUTP}
              </pre>
            </section>
          )}

          {planJSON && (
            <section className="space-y-10">
              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  Resumen de la planificación
                </h2>
                <PlanificacionResumenTable resumen={planJSON.resumen} />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-2">
                  Detalle por clase
                </h2>
                <PlanificacionDetalleList
                  detalle={planJSON.detalle}
                  instrumento={instrumento}
                />
              </div>

              {/* JSON crudo opcional */}
              <details className="bg-gray-800 rounded p-4">
                <summary className="cursor-pointer mb-2">Ver JSON bruto</summary>
                <pre className="text-xs overflow-x-auto">{planClases}</pre>
              </details>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

