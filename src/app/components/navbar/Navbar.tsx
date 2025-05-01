"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    ["/planificacion", "Planificacion"],
    ["/planificacioninversa", "PlanInv"],
    ["/rubricas", "Rubricas"],
    ["#signin", "Ingresar"],
  ] as const;

  return (
    <header className="bg-white/70 backdrop-blur dark:bg-slate-900/70 fixed inset-x-0 top-0 z-50 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Logo / título */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white"
        >
          EduCommand
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden space-x-8 md:block">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-slate-700 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Botón “Ingresar” desktop */}
        <div className="hidden md:block">
          <Link
            href="#signin"
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
          >
            Ingresar
          </Link>
        </div>

        {/* Burger móvil */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-slate-900 dark:text-white"
            >
              <path
                fillRule="evenodd"
                d="M4.5 4.5a1.5 1.5 0 012.121 0L12 9.879l5.379-5.379a1.5 1.5 0 012.121 2.121L14.121 12l5.379 5.379a1.5 1.5 0 01-2.121 2.121L12 14.121l-5.379 5.379a1.5 1.5 0 01-2.121-2.121L9.879 12 4.5 6.621a1.5 1.5 0 010-2.121z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-slate-900 dark:text-white"
            >
              <path
                fillRule="evenodd"
                d="M3.75 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15A.75.75 0 013.75 6zm0 6a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm.75 5.25a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Menú móvil */}
      {open && (
        <nav className="space-y-6 bg-white px-6 py-6 shadow-md dark:bg-slate-800 md:hidden">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="block text-sm font-medium text-slate-700 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
