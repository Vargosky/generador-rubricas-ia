"use client";
import React, { useState, useEffect } from "react";

type Objetivo = {
  descripcion: string;
  puntaje: number;
};

type SelectorObjetivosProps = {
  onAgregarObjetivo?: (objetivo: Objetivo) => void;
};

const asignaturasJSON = [
  "artes_visuales",
  "ciencias_naturales",
  "educacion_fisica",
  "historia",
  "musica",
  "orientacion",
  "tecnologia"
];

const niveles = ["1M", "2M", "3M", "4M"];

export default function SelectorObjetivos({ onAgregarObjetivo }: SelectorObjetivosProps) {
  const [selectedAsignatura, setSelectedAsignatura] = useState("");
  const [objetivos, setObjetivos] = useState<any[]>([]);
  const [selectedNivel, setSelectedNivel] = useState("");

  useEffect(() => {
    const cargarObjetivos = async () => {
      if (!selectedAsignatura) return;
      try {
        const response = await fetch(`/data/AsiganturasOA/${selectedAsignatura}.json`);
        const data = await response.json();
        setObjetivos(data);
        setSelectedNivel("");
      } catch (error) {
        console.error("Error al cargar JSON:", error);
        setObjetivos([]);
      }
    };

    cargarObjetivos();
  }, [selectedAsignatura]);

  const objetivosFiltrados = selectedNivel
    ? objetivos.filter((item) => (item.level || item.nivel) === selectedNivel)
    : [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Seleccionar Objetivos</h2>

      <select
        className="border p-2 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-600"
        value={selectedAsignatura}
        onChange={(e) => setSelectedAsignatura(e.target.value)}
      >
        <option value="">-- Selecciona una asignatura --</option>
        {asignaturasJSON.map((asig) => (
          <option key={asig} value={asig}>
            {asig.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </option>
        ))}
      </select>

      {selectedAsignatura && (
        <select
          className="border p-2 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-600"
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

      {selectedNivel && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-slate-600 mt-4">
            <thead className="bg-gray-100 dark:bg-slate-700">
              <tr>
                <th className="border px-4 py-2">Code</th>
                <th className="border px-4 py-2">Nivel</th>
                <th className="border px-4 py-2">Objetivo</th>
                {/* <th className="border px-4 py-2">Acciones</th> */}
              </tr>
            </thead>
            <tbody>
              {objetivosFiltrados.map((item, index) => {
                const nivel = item.level || item.nivel;
                const code = item.code
                const objetivo = item.description || item.objetivo;

                return (
                  <tr key={code} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="border px-4 py-2 text-center">{code}</td>
                    {/* <td className="border px-4 py-2 text-center">{nivel}</td> */}
                    <td className="border px-4 py-2">{objetivo}</td>
                    <td className="border px-4 py-2 flex gap-2 justify-center">
                      <button
                        onClick={() => navigator.clipboard.writeText(objetivo)}
                        className="text-sm px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      >
                        Copiar
                      </button>
                      {onAgregarObjetivo && (
                        <button
                          onClick={() =>
                            onAgregarObjetivo({ descripcion: objetivo, puntaje: 10 })
                          }
                          className="text-sm px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                        >
                          Agregar
                        </button>
                      )}
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
