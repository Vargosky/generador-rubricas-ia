/** ----- Tipos que mapean la respuesta JSON del modelo ----- */
export interface PlanificacionResumen {
    numero: number;
    objetivoEspecifico: string;
    actividadCentral: string;
    recursoTIC: string;
    evaluacionFormativa: string;
  }
  
  export interface PlanificacionDetalle {
    numero: number;
    inicio: string[];
    desarrollo: string[];
    cierre: {
      preguntaReflexion: string;
      conexionOA: string;
    };
    tarea: string;
  }
  
  export interface PlanificacionJSON {
    resumen: PlanificacionResumen[];
    detalle: PlanificacionDetalle[];
    conexionInstrumento: string;
  }
  