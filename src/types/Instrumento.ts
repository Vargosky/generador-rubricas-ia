// src/types/Instrumento.ts
//----------------------------------------------------------
export interface Instrumento {
    asignatura: string;
    objetivoGeneral: string;
    dificultad: number;
    examen: {
      enunciadoGeneral: string;
      preguntas: {
        alternativas: {
          enunciado: string;
          opciones: Record<"A" | "B" | "C" | "D", string>;
          correcta: "A" | "B" | "C" | "D";
        }[];
        desarrollo: string[];
      };
    };
    criterios: { id: number; descripcion: string; peso: number }[];
    rubrica: unknown;         // (ajústalo cuando declares el tipo Rubrica)
    formulaNota: string;
  }
  