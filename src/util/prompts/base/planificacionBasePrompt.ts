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
Eres un experto en planificación educativa basada en la taxonomía de Marzano.

Datos de entrada:
${jsonData}

Taxonomía de Marzano:
${taxonomyJson}

Tu tarea:
- Crear todas las clases necesarias entre "fechaInicio" y "fechaTermino", usando los días activos en "schedule".
- Cada clase debe tener: numero incremental, fecha, horaInicio, duracion, objetivo (según taxonomía), habilidad (nivel Marzano), inicio, desarrollo, cierre y evaluacionIncluida (false excepto en evaluaciones).
- La habilidad Marzano debe progresar lentamente (puede repetir nivel, nunca retroceder).
- Genera sesiones de evaluación (sin objetivo ni contenido) antes de "fechaNotas", distribuidas de manera razonable.
- Si hay más de una clase en un mismo día, agrúpalas en bloques continuos.

Construcción del objetivo:
- Verbo de la habilidad Marzano + "mediante" + actividad principal + actitud positiva (ej.: "con respeto", "con pensamiento crítico").

Formato de salida exacto (no añadas ningún texto afuera del bloque JSON):

{
  "clases": [
    {
      "numero": 1,
      "fecha": "YYYY-MM-DD",
      "horaInicio": "HH:MM",
      "duracion": minutos,
      "objetivo": "texto",
      "habilidad": "Nivel Marzano",
      "inicio": "actividad de inicio",
      "desarrollo": "actividad principal",
      "cierre": "actividad de cierre",
      "evaluacionIncluida": false
    }
  ],
  "fechasEvaluacion": ["YYYY-MM-DD"]
}

Responde **únicamente** con el objeto JSON solicitado, sin comentarios ni explicaciones adicionales.
`.trim();
}
