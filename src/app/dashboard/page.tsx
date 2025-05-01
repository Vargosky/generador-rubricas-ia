// app/dashboard/cursos/page.tsx
import { CourseCard } from "@/app/components/cards/CourseCard";

export default function CursosPage() {
  // Ejemplo de datos. Luego podrás cargarlos de tu API / BD.
  const cursos = [
    {
      title: "2° Medio A",
      stats: [
        { label: "Planificaciones creadas", value: 75 },
        { label: "Evaluaciones subidas", value: 40 },
        { label: "Correcciones IA", value: 60 },
        { label: "Promedio aprobación", value: 88 },
      ],
    },
    {
      title: "3° Medio B",
      stats: [
        { label: "Planificaciones creadas", value: 55 },
        { label: "Evaluaciones subidas", value: 20 },
        { label: "Correcciones IA", value: 35 },
        { label: "Promedio aprobación", value: 72 },
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

  