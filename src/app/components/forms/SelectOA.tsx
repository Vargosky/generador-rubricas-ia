"use client";
import React, { useState, useEffect } from 'react';
import { FaRegCopy } from "react-icons/fa6";

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

const SelectOA = () => {
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
        setSelectedNivel(""); // Reiniciar nivel cuando cambia la asignatura
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
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Selecciona una asignatura</h2>

      {/* Select de asignatura */}
      <select
        className="border p-2 bg-white dark:bg-slate-800 dark:text-white dark:border-slate-600"
        value={selectedAsignatura}
        onChange={(e) => setSelectedAsignatura(e.target.value)}
      >
        <option value="">-- Selecciona una asignatura --</option>
        {asignaturasJSON.map((asig) => (
          <option key={asig} value={asig}>
            {asig.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </option>
        ))}
      </select>

      {/* Select de nivel */}
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

      {/* Tabla de objetivos */}
      {selectedNivel && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-slate-600 mt-4">
            <thead className="bg-gray-100 dark:bg-slate-700">
              <tr>
                <th className="border px-4 py-2">Code</th>
                {/* <th className="border px-4 py-2">Nivel</th> */}
                <th className="border px-4 py-2">Objetivo</th>
              </tr>
            </thead>
            <tbody>
              {objetivosFiltrados.map((item, index) => {
                const nivel = item.level || item.nivel;
                const code = item.code;
                const objetivo = item.description || item.objetivo;

                const copiarObjetivo = async () => {
                  try {
                    await navigator.clipboard.writeText(objetivo);
                    console.log("Objetivo copiado:", objetivo);
                  } catch (err) {
                    console.error("Error al copiar:", err);
                  }
                };

                return (
                  <tr key={code} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="border px-4 py-2 text-center w-1/6">{code}</td>
                    {/* <td className="border px-4 py-2 text-center">{nivel}</td> */}
                    <td className="border px-4 py-2 flex justify-between items-center gap-2">
                      <span>{objetivo}</span>
                      <button
                        onClick={copiarObjetivo}
                        className="text-sm px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      >
                        <FaRegCopy className='text-xl' />
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
};

export default SelectOA;
