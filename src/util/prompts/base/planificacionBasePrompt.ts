// util/prompts/base/planificacionBasePrompt.ts

import { marzanoTaxonomy } from "../marzanoTaxonomy";
import { PlanificacionData } from "../types";

/**
 * Devuelve el prompt base de planificación educativa con Marzano.
 * Este prompt será combinado con reglas específicas por asignatura
 * y datos del formulario para construir el prompt final.
 */
export function planificacionBasePrompt(data: PlanificacionData): string {
  const jsonData = JSON.stringify(data, null, 2);
  const taxonomyJson = JSON.stringify(marzanoTaxonomy, null, 2);

  return `
Eres un experto en planificación educativa utilizando la taxonomía de Marzano.

Datos proporcionados:
${jsonData}

Taxonomía de Marzano:
${taxonomyJson}

Instrucciones detalladas:
- Genera todas las clases necesarias entre las fechas "fechaInicio" y "fechaTermino", considerando únicamente los días y horarios especificados en "schedule".
- Cada clase debe contener obligatoriamente los siguientes campos:
  - numero: secuencial desde 1.
  - fecha: formato YYYY-MM-DD.
  - horaInicio: formato HH:MM.
  - duracion: en minutos.
  - objetivo: creado usando la taxonomía de Marzano.
  - habilidad: especifica claramente el nivel correspondiente según Marzano (debe avanzar progresivamente, sin retroceder, aunque puede repetirse en clases consecutivas).
  - inicio: actividad introductoria corta relacionada al objetivo.
  - desarrollo: actividad principal detallada acorde al objetivo y nivel de habilidad.
  - cierre: breve actividad final para consolidar lo aprendido.
  - evaluacionIncluida: valor booleano (true solo si corresponde a una evaluación).

Reglas especiales:
- Si hay múltiples clases en un mismo día, ordénalas en bloques continuos de tiempo.
- Para evaluaciones de tipo "Prueba" o "Test":
  - Genera sesiones exclusivas de evaluación antes de la "fechaNotas". En estas clases, solo completa el desarrollo con un resumen general del contenido, dejando inicio y cierre vacíos.
- Para evaluaciones de tipo "Proyecto":
  - Distribuye actividades a lo largo de todas las clases, asegurando avances progresivos y coherentes hasta completar el proyecto.

Construcción del objetivo de clase:
- Debe seguir estrictamente este formato:
  "[Verbo habilidad Marzano] mediante [actividad principal específica] [actitud positiva]."
  Ejemplo: "Analizar mediante trabajo grupal con pensamiento crítico."
- Cada objetivo de clase debe ser único, enfocado claramente en una parte específica del objetivo general de aprendizaje.

Formato de salida requerido (sin texto adicional):
{
  "clases": [
    {
      "numero": 1,
      "fecha": "YYYY-MM-DD",
      "horaInicio": "HH:MM",
      "duracion": minutos,
      "objetivo": "texto",
      "habilidad": "Nivel Marzano",
      "inicio": "actividad introductoria",
      "desarrollo": "actividad principal",
      "cierre": "actividad final",
      "evaluacionIncluida": false
    }
  ],
  "fechasEvaluacion": ["YYYY-MM-DD"]
}

Responde exclusivamente con el JSON solicitado, sin comentarios ni texto adicional.
`.trim();
}
