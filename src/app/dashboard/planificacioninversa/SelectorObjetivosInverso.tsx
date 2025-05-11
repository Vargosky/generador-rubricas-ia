"use client";
import React, { useState, useEffect } from "react";

type Objetivo = { descripcion: string; puntaje: number };

type SelectorObjetivosInversoProps = {
  /** Asignatura ya seleccionada arriba; si viene vacía, mostramos el select */
  asignatura?: string;
  onAgregarObjetivo?: (objetivo: Objetivo) => void;
};

const niveles = ["1M", "2M", "3M", "4M"];
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

export default function SelectorObjetivosInverso({
  asignatura: asignaturaProp = "",
  onAgregarObjetivo,
}: SelectorObjetivosInversoProps) {
  const [selectedAsignatura, setSelectedAsignatura] = useState(asignaturaProp);
  const [objetivos, setObjetivos] = useState<any[]>([]);
  const [selectedNivel, setSelectedNivel] = useState("");

  /* ------------------------------------------------------------------ */
  /*           Cargar JSON cada vez que cambia la asignatura            */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const asign = asignaturaProp || selectedAsignatura;
    if (!asign) return;

    const cargarObjetivos = async () => {
      try {
        const response = await fetch(`/data/AsiganturasOA/${asign}.json`);
        const data = await response.json();
        setObjetivos(data);
        setSelectedNivel("");
      } catch (error) {
        console.error("Error al cargar JSON:", error);
        setObjetivos([]);
      }
    };

    cargarObjetivos();
  }, [asignaturaProp, selectedAsignatura]);

  /* ------------------------------ helpers --------------------------- */

  const objetivosFiltrados = selectedNivel
    ? objetivos.filter((item) => (item.level || item.nivel) === selectedNivel)
    : [];

  const confirmarAgregado = (objetivoTexto: string) => {
    onAgregarObjetivo?.({ descripcion: objetivoTexto, puntaje: 0 });
  };

  /* --------------------------- UI ---------------------------------- */

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-lg font-bold">Seleccionar Objetivos de Aprendizaje</h2>

      {/* ------------ Select de asignatura (solo si no viene de arriba) ------------ */}
      {!asignaturaProp && (
        <select
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          value={selectedAsignatura}
          onChange={(e) => setSelectedAsignatura(e.target.value)}
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
      )}

      {/* ------------ Select de nivel ------------ */}
      {(asignaturaProp || selectedAsignatura) && (
        <select
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          value={selectedNivel}
          onChange={(e) => setSelectedNivel(e.target.value)}
        >
          <option value="">-- Seleccione su nivel --</option>
          {niveles.map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>
      )}

      {/* ------------ Tabla de objetivos ------------ */}
      {selectedNivel && (
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="min-w-full border border-gray-600 text-sm">
            <thead className="bg-gray-700">
              <tr>
                <th className="border px-2 py-1">#</th>
                <th className="border px-2 py-1">Nivel</th>
                <th className="border px-2 py-1">Objetivo</th>
                <th className="border px-2 py-1">Acción</th>
              </tr>
            </thead>
            <tbody>
              {objetivosFiltrados.map((item, index) => {
                const nivel = item.level || item.nivel;
                const objetivo = item.description || item.objetivo;

                return (
                  <tr key={index} className="hover:bg-gray-800">
                    <td className="border px-2 py-1 text-center">
                      {index + 1}
                    </td>
                    <td className="border px-2 py-1 text-center">{nivel}</td>
                    <td className="border px-2 py-1">{objetivo}</td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => confirmarAgregado(objetivo)}
                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded w-full"
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
