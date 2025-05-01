// app/dashboard/cursos/page.tsx
import { CourseCard } from "@/app/components/cards/CourseCard";

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
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cursos.map(({ title, stats }) => (
        <CourseCard key={title} title={title} stats={stats} />
      ))}
    </div>
  );
}

  