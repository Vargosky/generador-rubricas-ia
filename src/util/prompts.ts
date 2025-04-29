// util/prompts.ts
import { marzanoTaxonomy } from "./marzanoTaxonomy";

export const promptRefinarRubrica = ({
    asignatura,
    objetivoAprendizaje,
    objetivosEspecificos,
    formula
  }: {
    asignatura: string;
    objetivoAprendizaje: string;
    objetivosEspecificos: { descripcion: string; puntaje: number }[];
    formula?: string;
  }) => {
    const objetivos = objetivosEspecificos
      .map(
        (obj, i) => `  ${i + 1}. ${obj.descripcion} (Puntaje: ${obj.puntaje})`
      )
      .join("\n");
  
    return `
  Eres una inteligencia artificial encargada de generar una rúbrica de evaluación detallada, estructurada y útil para ser utilizada por otra inteligencia artificial durante la corrección automática de un trabajo escolar.
  
  ⚠️ Es muy importante que no inventes ni asumas información adicional que no haya sido proporcionada por el profesor. Solo puedes usar los datos entregados por el usuario. Si alguna parte falta, omítela sin agregar contenido de tu autoría.
  
  La rúbrica debe estar organizada por **criterios claros de evaluación**, cada uno con:
  - una breve descripción,
  - el puntaje asociado,
  - y una explicación de qué se espera que el estudiante demuestre para obtener dicho puntaje.
  
  Además:
  - Mantén un lenguaje técnico, preciso y sin adornos innecesarios.
  - No agregues introducciones ni conclusiones.
  - El formato de salida debe ser un objeto estructurado (JSON ), dentro del json debe incluir la rubrica en lenguaje natural
  - suma los puntajes y entrega el puntaje máximo
  
  
  ### Datos del formulario:
  
  - **Asignatura**: ${asignatura}
  - **Objetivo de aprendizaje general**: ${objetivoAprendizaje}
  - **Objetivos específicos**:
  ${objetivos}
  
  ${formula ? `- **Cálculo de nota**: ${formula}` : ""}
    `.trim();
  };

  
  
// utils/prompts.ts

export function generarPromptEvaluacionMatriz({
  nombreArchivo,
  contenido,
  rubrica
}: {
  nombreArchivo: string;
  contenido: string;
  rubrica: {
    tipo: string;
    criterios: {
      nombre: string;
      peso: number;
      niveles: {
        nivel: number;
        porcentaje: number;
        descripcion: string;
      }[];
    }[];
    escala_notas?: {
      nivel: number;
      nota: string;
    }[];
  };
}): string {
  // Prompt base para REFINAR la rúbrica de matriz de niveles
  return `Eres una inteligencia artificial experta en diseño de rúbricas de evaluación educativa basadas en matriz de niveles.

Tu tarea es REFINAR una rúbrica existente según los criterios y niveles provistos. No debes evaluar trabajos ni asignar niveles al contenido del estudiante.

Sólo utiliza la información de la rúbrica recibida. Mejora la redacción de las descripciones de cada nivel para que sean claras, concisas y medibles.

Aquí está la rúbrica actual:
\`\`\`json
${JSON.stringify(rubrica, null, 2)}
\`\`\`

Indicaciones para la refinación:
- Asegúrate de que cada descripción de nivel sea precisa y contenga verbos de acción claros.
- Mantén el orden de los criterios y niveles.
- Corrige ortografía y gramática.
- Optimiza la claridad de los porcentajes de logro.

Devuélveme la rúbrica refinada en formato JSON con la misma estructura:
{
  "tipo": "matriz_niveles",
  "criterios": [ ... ],
  "escala_notas": [ ... ]
}
`.trim();
}

export interface PlanificacionData {
  asignatura: string;
  tiempoHora: number;
  horasSemana: number;
  fechaInicio: string;
  fechaTermino: string;
  numEvaluaciones: number;
  semanasAntesNotas: number;
  fechaNotas: string | null;
  objetivos: { descripcion: string; puntaje: number }[];
  schedule: Record<string, boolean[]>;
}

/**
 * Devuelve el prompt completo para enviar a DeepSeek,
 * usando los datos de la planificación.
 */
export interface PlanificacionData {
  asignatura: string;
  tiempoHora: number;
  horasSemana: number;
  fechaInicio: string;
  fechaTermino: string;
  numEvaluaciones: number;
  semanasAntesNotas: number;
  fechaNotas: string | null;
  objetivos: { descripcion: string; puntaje: number }[];
  schedule: Record<string, boolean[]>;
}

/**
 * Construye un prompt para DeepSeek que garantice:
 * - Solo usa los días marcados en schedule.
 * - Evaluaciones en días de clase válidos.
 * - Cada sesión con sección de entrada, desarrollo y cierre.
 * - Taxonomía de Marzano aplicada a habilidades.
 * Devuelve un string completo listo para enviarse al API.
 */
export interface PlanificacionData {
  asignatura: string;
  tiempoHora: number;
  horasSemana: number;
  fechaInicio: string;
  fechaTermino: string;
  numEvaluaciones: number;
  semanasAntesNotas: number;
  fechaNotas: string | null;
  objetivos: { descripcion: string; puntaje: number }[];
  schedule: Record<string, boolean[]>;
}

/**
 * Construye un prompt para DeepSeek/OpenAI que garantice:
 * - Solo usa los días marcados en "schedule".
 * - Las habilidades de la Taxonomía de Marzano deben progresar de menor a mayor complejidad.
 * - Evaluaciones en días de clase válidos y sin contenido de clase normal.
 * - Cada sesión con sección de Entrada, Desarrollo y Cierre (salvo evaluación).
 * - Incluye un id incremental para cada clase.
 * - En días con múltiples clases, agrupa horarios desde la primera hasta la última hora.
 * - La descripción servirá como entrada para otra IA que genere un script detallado de cada clase.
 */
export interface PlanificacionData {
  asignatura: string;
  tiempoHora: number;
  horasSemana: number;
  fechaInicio: string;
  fechaTermino: string;
  numEvaluaciones: number;
  semanasAntesNotas: number;
  fechaNotas: string | null;
  objetivos: { descripcion: string; puntaje: number }[];
  schedule: Record<string, boolean[]>;
}

/**
 * Construye un prompt para el LLM que garantice:
 * - Solo usa los días marcados en schedule.
 * - Inserta la taxonomía completa de Marzano (niveles y verbos).
 * - Detalla cada clase con Entrada, Desarrollo y Cierre.
 * - Especifica la habilidad Marzano a desarrollar, progresando en complejidad.
 * - Agrupa varias sesiones en el mismo día en un solo bloque.
 * - Identifica sesiones de evaluación sin contenido de clase.
 * - Termina con habilidades de Metacognición/Autoregulación.
 */
export function generatePlanificacionPrompt(data: PlanificacionData): string {
  const jsonData = JSON.stringify(data, null, 2);
  const taxonomyJson = JSON.stringify(marzanoTaxonomy, null, 2);

  return `Eres un experto en planificación educativa basada en la taxonomía de Marzano.

Datos de entrada:
${jsonData}

Taxonomía de Marzano:
${taxonomyJson}

Tu tarea:
- Crear todas las clases necesarias entre 'fechaInicio' y 'fechaTermino', usando los días activos en 'schedule'.
- Cada clase debe tener: id incremental, fecha, hora de inicio, duración, objetivo basado en taxonomía, habilidad Marzano, inicio, desarrollo, cierre, y evaluacionIncluida (false excepto en evaluaciones).
- La habilidad Marzano debe progresar lentamente (permitido repetir niveles, pero nunca retroceder).
- Generar sesiones de evaluación (sin objetivo, sin contenido) antes de la fecha 'fechaNotas', distribuidas de manera razonable.
- Si hay más de una clase en un mismo día, se agrupan en bloques continuos.

Sobre el objetivo de cada clase:
- Usa el verbo de la habilidad Marzano + mediante (actividad principal) + actitudinal positivo (por ejemplo, con respeto, con pensamiento crítico).

Formato de salida:
{
  "clases": [
    {
      "id": 1,
      "fecha": "YYYY-MM-DD",
      "horaInicio": "HH:MM",
      "duracion": minutos,
      "objetivo": "texto",
      "habilidad": "Nivel Marzano",
      "inicio": "actividad de inicio",
      "desarrollo": "actividad principal",
      "cierre": "actividad de cierre",
      "evaluacionIncluida": false
    },
    ...
  ],
  "fechasEvaluacion": ["YYYY-MM-DD", ...]
}

Importante:
- Genera todas las clases necesarias.
- Sé claro, preciso y breve en cada actividad.
- No agregues explicaciones fuera del formato JSON pedido.
`;
}

