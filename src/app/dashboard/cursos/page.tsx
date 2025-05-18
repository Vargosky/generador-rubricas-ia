// app/dashboard/cursos/page.tsx
"use client"
import { CourseCard } from "@/app/components/cards/CourseCard";
import FormularioObjetivos from "@/components/FormularioObjetivos";


export default function CursosPage() {
  // Ejemplo de datos. Luego podrás cargarlos de tu API / BD.
  const cursos = [
    {
      title: "2° Medio A",
      stats: [
        { label: "Planificaciones de clases", value: 75 },
        { label: "Avance de curso", value: 40 },
        { label: "Evaluaciones hechas", value: 60 },
        { label: "Avance General", value: 88 },
      ],
    },
    {
      title: "3° Medio B",
      stats: [
        { label: "Planificaciones de clases", value: 55 },
        { label: "Avance de curso", value: 30 },
        { label: "Evaluaciones hechas", value: 20 },
        { label: "Avance General", value: 33 },
      ],
    },
    {
      title: "3° Medio C",
      stats: [
        { label: "Planificaciones de clases", value: 80 },
        { label: "Avance de curso", value: 60 },
        { label: "Evaluaciones hechas", value: 50 },
        { label: "Avance General", value: 75 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Mensaje informativo */}
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
        El sistema funciona completamente en localhost debido a los tiempos de respuesta del modelo.
      </h3>

      {/* Tarjetas de cursos */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cursos.map(({ title, stats }) => (
          <CourseCard key={title} title={title} stats={stats} />
        ))}
      </div>


    </div>
  );
}

  