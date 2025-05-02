"use client"
import { useState } from "react";
import { promptGeneraInstrumento } from "@/util/prompts";

export default function PlanificacionInversePage() {
  const [trabajoProgresivo, setTrabajoProgresivo] = useState(false);
  const [evaluaciones, setEvaluaciones] = useState([{ texto: "", peso: 0 }]);
  const [dificultad, setDificultad] = useState(5);
  const [asignatura, setAsignatura] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  const [alternativas, setAlternativas] = useState(0);
  const [desarrollo, setDesarrollo] = useState(0);
  const [tipoRubrica, setTipoRubrica] = useState("tabla");
  const [respuestaIA, setRespuestaIA] = useState("");

  // helpers -----------------------------
  const handleEvaluacionChange = (
    index: number,
    field: "texto" | "peso",
    value: string | number
  ) => {
    const nueva = [...evaluaciones];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nueva[index][field] = value;
    setEvaluaciones(nueva);
  };

  const agregarEvaluacion = () =>
    setEvaluaciones([...evaluaciones, { texto: "", peso: 0 }]);

  // IA ----------------------------------
  const enviarAIA = async () => {
            const payload = {
      asignatura,
      objetivoAprendizaje: objetivo,
      objetivosEspecificos: evaluaciones.map((e) => ({
        descripcion: e.texto,
        puntaje: e.peso,
      })),
      numPreguntasAlternativas: alternativas,
      numPreguntasDesarrollo: desarrollo,
      formula: trabajoProgresivo
        ? undefined
        : `nota = (${puntajeTotal} * 0.6 + ${(desarrollo + alternativas)} * 0.4) / 100`,
      tipoRubrica: tipoRubrica === "tabla" ? "tabla_cotejo" : "matriz_niveles",
      dificultad,
    } as const;

    const prompt = promptGeneraInstrumento(payload);

    const res = await fetch("/api/enviarPromptDeepSeek/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setRespuestaIA(data.reply || "Error al obtener respuesta");
  };

  // ui ----------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Planificación Inversa</h1>

      <form className="space-y-6">
        {/* asignatura & objetivo */}
        <div>
          <label className="block mb-1">Asignatura</label>
          <input
            type="text"
            value={asignatura}
            onChange={(e) => setAsignatura(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Objetivo de Aprendizaje</label>
          <input
            type="text"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>

        {/* criterios */}
        <div>
          <label className="block mb-2">¿Qué quiero evaluar?</label>
          {evaluaciones.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 mb-2">
              <input
                type="text"
                placeholder="Indicador…"
                value={item.texto}
                onChange={(e) => handleEvaluacionChange(idx, "texto", e.target.value)}
                className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
              />
              <input
                type="number"
                min={0}
                max={100}
                placeholder="%"
                value={isNaN(item.peso) ? "" : item.peso}
                onChange={(e) =>
                  handleEvaluacionChange(
                    idx,
                    "peso",
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
        </div>

        {/* sólo si NO es TP */}
        {!trabajoProgresivo && (
          <>
            <div>
              <label className="block mb-1">Puntaje total</label>
              <input
                type="number"
                value={puntajeTotal}
                onChange={(e) => setPuntajeTotal(+e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
          </>
        )}

        {/* switches & selects */}
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
            onChange={(e) => setTipoRubrica(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          >
            <option value="tabla">Tabla de cotejo</option>
            <option value="matriz">Matriz</option>
          </select>
        </div>

        {/* dificultad */}
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
            Nivel: {dificultad <= 2
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

        {/* acción */}
        <button
          type="button"
          onClick={enviarAIA}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          Generar instrumento con IA
        </button>
      </form>

      {/* respuesta */}
      {respuestaIA && (
        <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded">
          <h2 className="text-xl font-semibold mb-2">Respuesta generada:</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-200">
            {respuestaIA}
          </pre>
        </div>
      )}
    </div>
  );
}
