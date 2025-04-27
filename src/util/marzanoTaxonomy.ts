// utils/marzanoTaxonomy.ts

/**
 * Representación JSON de la Taxonomía de Robert Marzano para su uso en la generación de planificación.
 */
export const marzanoTaxonomy = [
    {
      nivel: 1,
      etiqueta: "Recuperación",
      descripcion: "Observación y recordación de información; conocimiento de fechas, eventos, lugares; dominio de ideas principales.",
      verbos: [
        "repetir", "registrar", "memorizar", "nombrar", "relatar", "subrayar",
        "enumerar", "enunciar", "recordar", "describir", "reproducir", "listar",
        "rotular", "identificar", "reconocer", "examinar", "citar"
      ]
    },
    {
      nivel: 2,
      etiqueta: "Comprensión",
      descripcion: "Entender la información, captar el significado, trasladar al conocimiento a nuevos contextos.",
      verbos: [
        "interpretar", "traducir", "reafirmar", "describir", "explicar", "ilustrar",
        "resumir", "parafrasear", "comparar", "predecir", "clasificar", "ordenar",
        "seleccionar", "contrastar", "identificar"
      ]
    },
    {
      nivel: 3,
      etiqueta: "Análisis",
      descripcion: "Extender y refinar el conocimiento: distinguir, examinar, indagar hipótesis, clasificar, relacionar.",
      verbos: [
        "distinguir", "examinar", "analizar", "inferir", "experimentar", "criticar",
        "descomponer", "ordenar", "comparar", "contrastar", "explicar"
      ]
    },
    {
      nivel: 4,
      etiqueta: "Aplicación",
      descripcion: "Usar el conocimiento significativamente en nuevas situaciones, resolver problemas, crear demostraciones.",
      verbos: [
        "aplicar", "resolver", "practicar", "programar", "operar", "demostrar",
        "calcular", "manipular", "emplear", "construir"
      ]
    },
    {
      nivel: 5,
      etiqueta: "Metacognición",
      descripcion: "Hábitos mentales productivos: planear, monitorear y evaluar el propio proceso de pensamiento.",
      verbos: [
        "planear", "organizar", "monitorear", "evaluar", "ajustar", "reorganizar",
        "justificar", "anticipar", "revisar"
      ]
    },
    {
      nivel: 6,
      etiqueta: "Autoregulación",
      descripcion: "Sistema de conciencia del Ser y autorregulación: actitudes, creencias y emociones para completar tareas.",
      verbos: [
        "juzgar", "valorar", "argumentar", "decidir", "convencer",
        "detectar sesgos", "evaluar eficacia", "reflexionar"
      ]
    }
  ];
  
  export type MarzanoLevel = (typeof marzanoTaxonomy)[number];
  