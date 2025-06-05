/* app/dashboard/page.tsx */
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button"; // tu botón genérico
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/* ---------- lista de características ---------- */
const features = [
  {
    title: "Generación de instrumentos",
    desc: "Crea rúbricas, listas de cotejo y matrices de niveles impulsadas por IA en segundos.",
    icon: "📝",
  },
  {
    title: "Planificación inversa",
    desc: "Diseña clases completas basadas en el instrumento y obtén guiones listos para usar.",
    icon: "📚",
  },
  {
    title: "Corrección automática",
    desc: "Sube múltiples documentos y obtén retroalimentación alineada a tu rúbrica.",
    icon: "⚙️",
  },
  {
    title: "Repositorio de actividades",
    desc: "Genera sopas de letras, crucigramas, actividades de lectura, problemas matemáticos y más.",
    icon: "🎮",
  },
  {
    title: "Historial y analíticas",
    desc: "Consulta tus últimas creaciones y métricas de uso en un solo lugar.",
    icon: "📊",
  },
  {
    title: "Exportación inteligente",
    desc: "Descarga resultados en DOCX, PDF o integra con Google Drive y Classroom*.",
    icon: "⬇️",
  },
];

export default function DashboardHome() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-fuchsia-100 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-gray-900 dark:text-white">
      {/* hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl"
        >
          Bienvenido a tu&nbsp;
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
            asistente pedagógico
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-300"
        >
          Planifica, crea, corrige y comparte recursos educativos con la
          potencia de la inteligencia artificial — todo en un mismo lugar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-8 flex gap-4"
        >
          <Button asChild size="lg">
            <Link href="/trabajos">Crear un trabajo</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/actividades">Generar actividad</Link>
          </Button>
        </motion.div>
      </section>

      {/* features grid */}
      <section className="relative z-10 -mt-12 rounded-t-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg py-20 px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          ¿Qué puedes hacer con el sistema?
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col items-start rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-6 shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mt-16 text-center text-xs text-gray-500 dark:text-gray-500">
          * Integraciones avanzadas en desarrollo.
        </p>
      </section>
    </main>
  );
}
