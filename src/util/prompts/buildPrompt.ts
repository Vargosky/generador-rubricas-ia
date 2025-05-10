import { PlanificacionData } from "./types";
import { planificacionBasePrompt } from "./base/planificacionBasePrompt";
import { reglasTecnologia } from "./asignaturas/tecnologia";
import { reglasLenguaje } from "./asignaturas/lenguaje";
import { reglasMatematicas } from "./asignaturas/matematicas";

export function buildPromptPlanificacion(data: PlanificacionData): string {
  const reglas = getReglasPorAsignatura(data.asignatura);

  const listaObjetivos = data.objetivos.map(
    (obj, i) => `  ${i + 1}. ${obj.descripcion} (Puntaje: ${obj.puntaje})`
  ).join("\n");

  return `
${planificacionBasePrompt}

${reglas}

Objetivos que debe considerar en la planificación:
${listaObjetivos || "No se han proporcionado objetivos."}

Datos de entrada del profesor:
${JSON.stringify(data, null, 2)}

Responde exclusivamente con el bloque JSON solicitado.
`.trim();
}


function getReglasPorAsignatura(asignatura: string): string {
  switch (asignatura.toLowerCase()) {
    case "tecnologia":
      return reglasTecnologia;
    case "lenguaje":
      return reglasLenguaje;
    case "matematicas":
      return reglasMatematicas;
    default:
      return "// No hay reglas definidas para esta asignatura.";
  }
}
