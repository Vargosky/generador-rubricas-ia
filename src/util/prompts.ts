// utils/prompts.ts

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
  vecesSemana: number;
  fechaInicio: string;
  fechaTermino: string;
  numEvaluaciones: number;
  semanasVerObjetivo: number;
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
  vecesSemana: number;
  fechaInicio: string;
  fechaTermino: string;
  numEvaluaciones: number;
  semanasVerObjetivo: number;
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
  vecesSemana: number;
  fechaInicio: string;
  fechaTermino: string;
  numEvaluaciones: number;
  semanasVerObjetivo: number;
  semanasAntesNotas: number;
  fechaNotas: string | null;
  objetivos: { descripcion: string; puntaje: number }[];
  schedule: Record<string, boolean[]>;
}

/**
 * Construye un prompt para DeepSeek que garantice:
 * - Solo usa los días marcados en schedule.
 * - Evaluaciones en días de clase válidos y sin contenido de clase normal.
 * - Cada sesión con sección de entrada, desarrollo y cierre (salvo evaluación).
 * - Taxonomía de Marzano aplicada a habilidades.
 * - Incluye un id incremental para cada clase.
 */
export interface PlanificacionData {
  asignatura: string;
  tiempoHora: number;
  horasSemana: number;
  vecesSemana: number;
  fechaInicio: string;
  fechaTermino: string;
  numEvaluaciones: number;
  semanasVerObjetivo: number;
  semanasAntesNotas: number;
  fechaNotas: string | null;
  objetivos: { descripcion: string; puntaje: number }[];
  schedule: Record<string, boolean[]>;
}

/**
 * Construye un prompt para DeepSeek que garantice:
 * - Solo usa los días marcados en schedule.
 * - Evaluaciones en días de clase válidos y sin contenido de clase normal.
 * - Cada sesión con sección de entrada, desarrollo y cierre (salvo evaluación).
 * - Taxonomía de Marzano aplicada a habilidades.
 * - Incluye un id incremental para cada clase.
 * - En días con múltiples clases, agrupa horarios desde la primera hasta la última hora.
 * - Indica que la descripción resultante será usada por otra IA para crear un script de cada clase.
 */
export function generatePlanificacionPrompt(data: PlanificacionData): string {
  const jsonData = JSON.stringify(data, null, 2);
  return `Eres un experto pedagógico en diseño curricular.

Datos de la planificación (formato JSON):
${jsonData}

Objetivo de la tarea:
Generar una secuencia detallada de clases que incluya un identificador incremental "id" para cada elemento y que:
- Solo planifique en los días activos según el objeto "schedule".
- Para sesiones de evaluación (evaluacionIncluida: true): omita entrada, desarrollo y cierre.
- Para el resto de clases: incluya las secciones Entrada, Desarrollo y Cierre.
- Promueva habilidades según la Taxonomía de Marzano.
- Si hay más de una clase en el mismo día, agrupe las horas en un bloque continuo desde la primera hasta la última clase de ese día.
- La descripción generada servirá como entrada para otra IA encargada de crear un script detallado de cada clase.

Restricciones y criterios:
1. Incluir exactamente ${data.numEvaluaciones} sesiones evaluativas en días de clase válidos, antes de ${data.fechaNotas}.
2. Revisar cada objetivo cada ${data.semanasVerObjetivo} semanas.

Formato de salida:
Devuelve un objeto JSON con:
- "clases": array donde cada elemento tiene:
    * id: número incremental (1, 2, 3, ...)
    * fecha: "YYYY-MM-DD"
    * horaInicio: "HH:MM"
    * duracion: número (minutos)
    * objetivo: texto
    * entrada: texto (omitido en evaluaciones)
    * desarrollo: texto (omitido en evaluaciones)
    * cierre: texto (omitido en evaluaciones)
    * evaluacionIncluida: booleano
- "fechasEvaluacion": array de strings con las fechas programadas para evaluación.

Ejemplo de clase normal:
{
  "id": 3,
  "fecha": "2025-05-04",
  "horaInicio": "09:00",
  "duracion": 45,
  "objetivo": "Comprender el concepto de energía cinética.",
  "entrada": "Discusión breve sobre ejemplos de movimiento cotidiano.",
  "desarrollo": "Experimentos con carros de juguete y cálculo de energía.",
  "cierre": "Reflexión sobre aplicaciones en la vida real.",
  "evaluacionIncluida": false
}

Ejemplo de evaluación:
{
  "id": 8,
  "fecha": "2025-05-18",
  "horaInicio": "10:00",
  "duracion": 45,
  "objetivo": "Evaluación práctica de conceptos vistos.",
  "evaluacionIncluida": true
}

Ejemplo de dos clases en un día agrupadas:
{
  "id": 12,
  "fecha": "2025-05-05",
  "horaInicio": "08:00",
  "duracion": 90, // Agrupado de 8:00 a 9:30
  "objetivo": "Unidad de estudio continuo sobre "xxxx".",
  "entrada": "Resumen de la clase anterior.",
  "desarrollo": "Actividades prácticas y discusión.",
  "cierre": "Preguntas y reflexión.",
  "evaluacionIncluida": false
}
`;
}


