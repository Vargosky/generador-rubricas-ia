"use client"
import React, { useState, useEffect } from 'react';

const FormularioObjetivos = () => {
  const [asignaturas, setAsignaturas] = useState<string[]>(['Tecnologia', 'ingles', 'Matematica']); // Añadir más asignaturas según sea necesario
  const [objetivos, setObjetivos] = useState<any[]>([]);
  const [selectedAsignatura, setSelectedAsignatura] = useState<string>('');
  const [selectedNivel, setSelectedNivel] = useState<string>('');
  const [selectedObjetivo, setSelectedObjetivo] = useState<any>(null);

  // Cargar el archivo JSON según la asignatura seleccionada
  useEffect(() => {
    if (selectedAsignatura) {
      fetch(`/AsignaturaOA/${selectedAsignatura.toLowerCase()}.json`)  // Asumimos que los archivos están en /public/data/
        .then((response) => response.json())
        .then((data) => {
          setObjetivos(data); // Cargar los objetivos de la asignatura seleccionada
          setSelectedNivel(''); // Resetear el nivel al cambiar la asignatura
        })
        .catch((error) => console.error('Error cargando los objetivos:', error));
    }
  }, [selectedAsignatura]);

  // Filtrar los objetivos por nivel seleccionado (1° a 4° Medio)
  const objetivosPorNivel = objetivos.filter((obj: any) => {
    return ['1° Medio', '2° Medio', '3° Medio', '4° Medio'].includes(obj.level) && obj.level === selectedNivel;
  });

  return (
    <form>
      <h2>Formulario de Objetivos de Aprendizaje</h2>

      {/* Selección de asignatura */}
      <label htmlFor="asignatura">Asignatura:</label>
      <select
        id="asignatura"
        value={selectedAsignatura}
        onChange={(e) => setSelectedAsignatura(e.target.value)}
      >
        <option value="">Seleccionar Asignatura...</option>
        {asignaturas.map((asignatura) => (
          <option key={asignatura} value={asignatura}>
            {asignatura}
          </option>
        ))}
      </select>

      {/* Selección de nivel (1° a 4° Medio) */}
      {selectedAsignatura && (
        <>
          <label htmlFor="nivel">Nivel:</label>
          <select
            id="nivel"
            value={selectedNivel}
            onChange={(e) => setSelectedNivel(e.target.value)}
          >
            <option value="">Seleccionar Nivel...</option>
            <option value="1M">1° Medio</option>
            <option value="2M">2° Medio</option>
            <option value="3M">3° Medio</option>
            <option value="4M">4° Medio</option>
          </select>
        </>
      )}

      {/* Selección de objetivo de aprendizaje */}
      {selectedNivel && (
        <>
          <label htmlFor="objetivo">Objetivo de Aprendizaje:</label>
          <select
            id="objetivo"
            value={selectedObjetivo ? selectedObjetivo.code : ''}
            onChange={(e) => {
              const selected = objetivos.find((obj: any) => obj.code === e.target.value);
              setSelectedObjetivo(selected);
            }}
          >
            <option value="">Seleccionar Objetivo...</option>
            {objetivosPorNivel.map((obj: any) => (
              <option key={obj.code} value={obj.code}>
                {obj.code} - {obj.description}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Mostrar objetivo seleccionado */}
      {selectedObjetivo && (
        <div>
          <h3>Objetivo Seleccionado:</h3>
          <p>{selectedObjetivo.description}</p>
        </div>
      )}
    </form>
  );
};

export default FormularioObjetivos;
