// src/types/Rubrica.ts
export interface Rubrica {
    tipo: "tabla_cotejo" | "matriz_niveles";
    criterios: {
      id: number;
      niveles: {
        nivel: number;
        nombre: string;
        descripcion: string;
      }[];
    }[];
  }
  