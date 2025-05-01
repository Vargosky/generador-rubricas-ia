"use client";
import { useState } from "react";
import Image from "next/image";


export default function LandingPage() {
  // simple mobile‑menu toggle
  const [open, setOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <>
      {/* ───────────────────── Navbar ───────────────────── */}
      <header className="bg-white/70 backdrop-blur dark:bg-slate-900/70 fixed inset-x-0 top-0 z-50 shadow-sm">

      </header>

      <main className="pt-24">
        {/* ───────────────────── Hero ───────────────────── */}
        <section className="bg-slate-50 dark:bg-slate-800">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 md:grid-cols-2 md:px-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                Planifica sin estrés.
                <br className="hidden sm:inline" /> Enseña con impacto.
              </h1>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
                La suite docente que te ayuda a planificar, evaluar y retroalimentar de forma automática.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#signup"
                  className="rounded-2xl bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700"
                >
                  Comienza gratis
                </a>
                <a
                  href="#demo"
                  className="rounded-2xl border border-blue-600 px-8 py-3 text-base font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-slate-700"
                >
                  Solicita una demo
                </a>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md">
              {/* Replace /hero-mockup.png with your exported mockup */}
              <Image
                src="/hero-mockup.png"
                width={640}
                height={480}
                alt="Vista previa de EduSuite"
                className="w-full rounded-2xl shadow-xl ring-1 ring-slate-200 dark:ring-slate-700"
              />
            </div>
          </div>
        </section>

        {/* ───────────────────── Beneficios ───────────────────── */}
        <section id="features" className="bg-white py-24 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white">Beneficios clave</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  emoji: "🗓️",
                  title: "Planifica",
                  desc: "Organiza tus clases y establece objetivos en minutos.",
                },
                {
                  emoji: "✅",
                  title: "Evalúa",
                  desc: "Genera rúbricas eficaces y justas para tus estudiantes.",
                },
                {
                  emoji: "⚡",
                  title: "Retroalimenta",
                  desc: "Ahorra tiempo con correcciones automáticas y feedback instantáneo.",
                },
              ].map(({ emoji, title, desc }) => (
                <div
                  key={title}
                  className="rounded-2xl bg-slate-50 p-8 text-center shadow-sm dark:bg-slate-800"
                >
                  <div className="text-4xl">{emoji}</div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────── Cómo funciona ───────────────────── */}
        <section className="bg-gradient-to-b from-green-50 to-transparent py-24 dark:from-slate-800 dark:to-slate-900">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Cómo funciona
              </h2>
              <ul className="mt-6 space-y-4 text-slate-600 dark:text-slate-300">
                {[
                  "Planea tus unidades y sesiones con IA contextualizada.",
                  "Genera rúbricas y pruebas alineadas a tus objetivos.",
                  "Corrige automáticamente y entrega feedback personalizado.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto w-full max-w-md">
              <Image
                src="/workflow-mockup.png"
                width={640}
                height={480}
                alt="Flujo de trabajo de EduSuite"
                className="w-full rounded-2xl shadow-xl ring-1 ring-slate-200 dark:ring-slate-700"
              />
            </div>
          </div>
        </section>

        {/* ───────────────────── Testimonios ───────────────────── */}
        <section className="bg-orange-50 py-24 dark:bg-slate-800" id="testimonials">
          <div className="mx-auto max-w-5xl px-4 md:px-8">
            <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
              Testimonios
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {[
                {
                  name: "Alejandra Rodríguez",
                  role: "Profesora de Matemáticas",
                  quote:
                    "¡Esta herramienta ha transformado la forma en que planifico mis clases! Es intuitiva y eficiente.",
                },
                {
                  name: "Carlos Méndez",
                  role: "Jefe UTP",
                  quote:
                    "Ahora nuestros docentes dedican más tiempo a enseñar y menos a papeleo. ¡Un cambio radical!",
                },
              ].map(({ name, role, quote }) => (
                <div key={name} className="rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-900/60">
                  <p className="text-lg font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                    “{quote}”
                  </p>
                  <div className="mt-6 text-sm text-slate-600 dark:text-slate-400">
                    — {name}, {role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────── CTA Final ───────────────────── */}
        <section
          id="cta"
          className="bg-blue-600 py-24 text-center text-white shadow-inner"
        >
          <div className="mx-auto max-w-3xl px-4 md:px-0">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Listo para revolucionar tu enseñanza?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg">
              Descubre cómo EduSuite puede ayudarte a planificar, evaluar y
              retroalimentar con facilidad.
            </p>
            <a
              href="#signup"
              className="mt-8 inline-block rounded-2xl bg-white px-10 py-4 text-base font-semibold text-blue-600 shadow-lg transition hover:bg-blue-50"
            >
              Crear mi cuenta gratis
            </a>
          </div>
        </section>
      </main>

      {/* ───────────────────── Footer ───────────────────── */}
      <footer className="bg-slate-100 py-8 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          © {year} EduSuite. Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
}
