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

