/**
 * Sesión semanal (la misma estructura que guardas en StepHorario)
 */
export type SesionSemanal = {
    dia: "Lun" | "Mar" | "Mié" | "Jue" | "Vie" | "Sáb" | "Dom";
    duracion: number;       // minutos, múltiplo de 45
    inicio?: string;        // "HH:MM" (opcional)
  };
  
  /**
   * Clase generada con fecha concreta
   */
  export type ClaseProgramada = {
    fecha: string;          // "YYYY-MM-DD"
    dia: SesionSemanal["dia"];
    inicio?: string;
    duracion: number;
  };
  
  /**
   * Genera todas las clases comprendidas entre inicio y término.
   * Usa date-fns para manipular fechas sin depender de la zona horaria.
   */
  import { parseISO, formatISO, addDays, isBefore, isEqual } from "date-fns";
  
  export function generarClases(
    inicio: string,              // "YYYY-MM-DD"
    termino: string,             // "YYYY-MM-DD"
    sesiones: SesionSemanal[]
  ): ClaseProgramada[] {
    const clases: ClaseProgramada[] = [];
    const start = parseISO(inicio);
    const end   = parseISO(termino);
  
    const nombreDia: Record<number, SesionSemanal["dia"]> = {
      0: "Dom", 1: "Lun", 2: "Mar", 3: "Mié", 4: "Jue", 5: "Vie", 6: "Sáb",
    };
  
    for (let fecha = start; isBefore(fecha, addDays(end, 1)); fecha = addDays(fecha, 1)) {
      const diaSemana = nombreDia[fecha.getDay()];      // 0-6 → Dom-Sáb
      const sesionesHoy = sesiones.filter((s) => s.dia === diaSemana);
  
      sesionesHoy.forEach((s) =>
        clases.push({
          fecha: formatISO(fecha, { representation: "date" }),
          dia: diaSemana,
          inicio: s.inicio,
          duracion: s.duracion,
        })
      );
    }
  
    return clases;
  }
  