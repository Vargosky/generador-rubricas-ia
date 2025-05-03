// util/prompts/types.ts

export interface PlanificacionData {
    asignatura: string;
    tiempoHora: number;
    horasSemana: number;
    fechaInicio: string;
    fechaTermino: string;
    numEvaluaciones: number;
    semanasAntesNotas: number;
    fechaNotas: string | null;
    objetivos: {
      descripcion: string;
      puntaje: number;
    }[];
    schedule: Record<string, boolean[]>;
  }
  