"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

/* ---------- tipos y datos de ejemplo ---------- */
type HistItem = { id: string; titulo: string; tipo: "Trabajo" | "Actividad"; fecha: string };

const historialDemo: HistItem[] = [
  { id: "abc1", titulo: "Trabajo de investigación: Energías Renovables", tipo: "Trabajo", fecha: "2025-05-18" },
  { id: "abc2", titulo: "Sopa de Letras: Partes del Microscopio", tipo: "Actividad", fecha: "2025-05-17" },
  { id: "abc3", titulo: "Exposición oral: La célula", tipo: "Trabajo", fecha: "2025-05-15" },
];

/* ---------- page ---------- */
export default function PerfilPage() {
  const [historial] = useState<HistItem[]>(historialDemo);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-100 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Mi perfil</h1>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* ---------- panel lateral ----------- */}
        <aside className="rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/40 dark:border-slate-700/50 p-6 shadow-lg shadow-indigo-300/10 dark:shadow-black/30">
          {/* foto + nombre */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-32 h-32">
              <Image
                src="/avatar-placeholder.png" // reemplaza con la foto del usuario
                alt="Foto de perfil"
                fill
                className="rounded-full object-cover border-4 border-indigo-500/60"
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Nombre Apellido</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Docente de Tecnología</p>
          </div>

          {/* acciones rápidas */}
          <div className="mt-6 space-y-3">
            <Button asChild className="w-full">
              <Link href="/trabajos">Crear nuevo trabajo</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/actividades">Crear nueva actividad</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/configuracion">Configuración</Link>
            </Button>
          </div>
        </aside>

        {/* ---------- contenido principal ---------- */}
        <section className="space-y-8">
          {/* historial */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Últimas creaciones
            </h3>

            {historial.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Aún no has creado contenido.</p>
            ) : (
              <ul className="space-y-4">
                {historial.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-gray-300 dark:border-slate-700/60 bg-white dark:bg-slate-800 px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.titulo}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.tipo} · {item.fecha}
                      </p>
                    </div>

                    <Button asChild size="sm">
                      <Link href={`/${item.tipo.toLowerCase()}s/${item.id}`}>Ver</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* panel extra (placeholder) */}
          <div className="rounded-2xl border border-dashed border-indigo-400/50 p-8 text-center text-indigo-500 dark:text-indigo-300">
            <p className="font-medium mb-2">Próximamente</p>
            <p className="text-sm">Aquí podrás ver tu progreso, insignias y estadísticas.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
