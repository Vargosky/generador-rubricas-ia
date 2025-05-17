import { Instrumento } from "@/types/Instrumento";
import { PlanificacionDetalle } from "@/types/Planificacion";

/**
 * Crea el prompt para un guion detallado de UNA clase.
 * Devuelve markdown (o texto simple) con secciones Inicio - Desarrollo - Cierre.
 */
export const promptGuionClase = (
  instrumento: Instrumento,
  clase: PlanificacionDetalle
) => `
Eres un docente de ${instrumento.asignatura} y elaboras guiones de clase muy
detallados siguiendo la planificación inversa.

=== CONTEXTO DEL INSTRUMENTO (JSON) ===
${JSON.stringify(instrumento, null, 2)}
=== FIN ===

=== DATOS DE LA CLASE (JSON) ===
${JSON.stringify(clase, null, 2)}
=== FIN ===

Genera el **guion completo** de la clase en texto plano (sin Markdown).
Incluye tiempos aproximados para cada fase e indicaciones al profesor.
Devuelve UN solo bloque de texto, sin encabezados adicionales.
`.trim();
