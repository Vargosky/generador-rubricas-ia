"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
// ⬇️ descomenta si quieres usar FramerMotion
// import { motion } from "framer-motion";

type Props = {
  id: string;
  nombre: string;
  descripcion: string;
  link: string;
};

export default function TipoTrabajoCard({
  nombre,
  descripcion,
  link,
}: Props) {
  // ---------- Variante A: solo Tailwind ----------
  return (
    <div
      className="
        group relative flex flex-col justify-between
        rounded-2xl border border-gray-700/70
        bg-gray-800 px-8 py-6
        transition-transform duration-300
        hover:scale-[1.04] hover:border-indigo-400/60
        hover:shadow-xl hover:shadow-indigo-400/20
        focus-within:scale-[1.04]
      "
    >
      <div>
        <h3 className="text-2xl font-semibold mb-2 text-white">{nombre}</h3>
        <p className="text-sm text-gray-300">{descripcion}</p>
      </div>

      <Button
        asChild
        className="
          mt-5 w-full
          transition-colors duration-200
          group-hover:bg-indigo-600
        "
      >
        <Link href={link}><span className="text-xl">Crear</span></Link>
      </Button>

      {/* Brillo sutil */}
      <span
        className="
          pointer-events-none absolute inset-0 rounded-2xl
          bg-indigo-400/10 opacity-0 blur-md
          transition-opacity duration-500
          group-hover:opacity-100
        "
      />
    </div>
  );

  /* ---------- Variante B: con FramerMotion ----------
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="
        relative flex flex-col justify-between
        rounded-2xl border border-gray-700/70
        bg-gray-800 px-8 py-6
      "
    >
      ...
    </motion.div>
  );
  ---------------------------------------------------*/
}
