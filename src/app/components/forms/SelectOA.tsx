"use client";
import React, { useState, useEffect } from 'react';

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
    : objetivos;

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
          <option value="">Todos los niveles</option>
          {niveles.map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>
      )}

      {/* Tabla de objetivos */}
      {selectedAsignatura && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-slate-600 mt-4">
            <thead className="bg-gray-100 dark:bg-slate-700">
              <tr>
                <th className="border px-4 py-2">Código</th>
                <th className="border px-4 py-2">Nivel</th>
                <th className="border px-4 py-2">Objetivo</th>
              </tr>
            </thead>
            <tbody>
              {objetivosFiltrados.map((item, index) => (
                <tr key={item.code} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td className="border px-4 py-2 text-center">{item.code}</td>
                  <td className="border px-4 py-2 text-center">{item.level || item.nivel}</td>
                  <td className="border px-4 py-2">{item.description || item.objetivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SelectOA;
