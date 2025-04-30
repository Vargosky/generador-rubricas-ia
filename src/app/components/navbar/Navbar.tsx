"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 dark:text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + texto  -------------------------------------------------- */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              {/* Cambia /logo.svg por tu imagen/logo */}
              <Image
                src="/logo.svg"
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
            </Link>
            <span className="font-semibold text-lg select-none">Mi Sistema</span>
          </div>

          {/* Menú desktop --------------------------------------------------- */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/rubricas" className="hover:text-blue-600">
              Rúbricas
            </Link>
            <Link href="/planificacion" className="hover:text-blue-600">
              Planificaciones
            </Link>
            <Link href="/planificacioninversa" className="hover:text-blue-600">
              Instrumentos
            </Link>
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </Link>
          </div>

          {/* Botón burger --------------------------------------------------- */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Abrir menú"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil --------------------------------------------------------- */}
      {open && (
        <div className="md:hidden border-t dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/rubricas"
              className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              Rúbricas
            </Link>
            <Link
              href="/planificaciones"
              className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              Planificaciones
            </Link>
            <Link
              href="/instrumentos"
              className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setOpen(false)}
            >
              Instrumentos
            </Link>
            <Link
              href="/login"
              className="block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
