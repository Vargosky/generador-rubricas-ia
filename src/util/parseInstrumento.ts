/** Limpia la cadena recibida y devuelve el objeto instrumento.  */
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
  rubrica: unknown;
  formulaNota: string;
}

export function parseInstrumento(raw: string): Instrumento | null {
  // 1 | Quitamos prefijo “Respuesta generada:” (si existe)
  let limpio = raw.replace(/^Respuesta generada:\s*/, "");

  // 2 | Eliminamos TODAS las líneas que empiecen con ```
  limpio = limpio
    .split("\n")
    .filter((line) => !line.trim().startsWith("```"))
    .join("\n")
    .trim();

  try {
    const obj = JSON.parse(limpio);
    // Si el backend envía { instrumento: … } lo extraemos;
    // en caso contrario asumimos que el propio objeto ES el instrumento.
    return (obj.instrumento ?? obj) as Instrumento;
  } catch (err) {
    console.error("No se pudo parsear el JSON del instrumento:", err);
    return null;
  }
}
