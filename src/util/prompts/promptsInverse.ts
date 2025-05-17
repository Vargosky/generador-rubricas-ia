// src/util/promptClasesJson.ts
import { Instrumento } from "@/types/Instrumento";

/** ----- Tipos de la respuesta que esperamos del modelo ----- */
export interface PlanificacionResumen {
  /** Número correlativo de la clase (1 … n) */
  numero: number;
  objetivoEspecifico: string;
  actividadCentral: string;
  recursoTIC: string;
  evaluacionFormativa: string;
}

export interface PlanificacionDetalle {
  /** Número correlativo, debe coincidir con el resumen */
  numero: number;
  inicio: string[];               // Preguntas detonantes
  desarrollo: string[];           // Pasos principales
  cierre: {
    preguntaReflexion: string;
    conexionOA: string;
  };
  /** Tarea o trabajo progresivo (puede ser cadena vacía si no aplica) */
  tarea: string;
}

export interface PlanificacionJSON {
  resumen: PlanificacionResumen[];
  detalle: PlanificacionDetalle[];
  /** ≤ 6 líneas que expliquen la conexión con el instrumento */
  conexionInstrumento: string;
}

/**
 * Devuelve el prompt que se envía al modelo para obtener una planificación inversa
 * estrictamente en formato JSON (sin Markdown ni texto suelto).
 *
 * @param instrumento Objeto Instrumento que proviene del generador de instrumentos
 * @param contexto    (Opcional) Texto que quieras anteponer como p0 para dar más contexto al modelo
 * @param numClases   (Opcional) Número de clases a generar (por defecto 5)
 */
export const promptClasesJson = (
  instrumento: Instrumento,
  contexto: string = "",
  numClases: number = 5
): string => `
${contexto}
Eres docente de ${instrumento.asignatura} y aplicas planificación inversa.

=== INSTRUMENTO JSON ===
${JSON.stringify(instrumento, null, 2)}
=== FIN ===

INSTRUCCIONES DE FORMATO (OBLIGATORIAS):
1. Devuelve **solo** un objeto JSON **válido** (sin \`markdown\`, sin \`###\`, sin comentarios, sin textos antes o después).
2. Usa **comillas dobles** en todas las claves y valores.
3. Estructura:

{
  "resumen": [
    {
      "numero": 1,
      "objetivoEspecifico": "",
      "actividadCentral": "",
      "recursoTIC": "",
      "evaluacionFormativa": ""
    }
    /* … uno por cada clase … */
  ],
  "detalle": [
    {
      "numero": 1,
      "inicio": ["Pregunta 1", "Pregunta 2"],
      "desarrollo": ["Paso 1", "Paso 2"],
      "cierre": {
        "preguntaReflexion": "",
        "conexionOA": ""
      },
      "tarea": ""
    }
    /* … uno por cada clase … */
  ],
  "conexionInstrumento": ""
}

4. Debe haber **exactamente ${numClases}** entradas en "resumen" y en "detalle".
5. Mantén la longitud de "conexionInstrumento" ≤ 6 líneas (usa \\n si necesitas saltos de línea internos).
6. No incluyas claves extra ni valores nulos: si algo no aplica, devuelve cadena vacía "".

Genera la planificación para **${numClases} clases** ahora.
`.trim();
