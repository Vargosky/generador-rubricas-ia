"use client";
import { motion } from "framer-motion";
import SelectOA from "@/app/components/forms/SelectOA";

export default function ObjetivosPage() {
  return (
    <main className="
      relative min-h-64 mt-20 overflow-hidden
      flex items-center justify-center px-4 py-12
      bg-gradient-to-br
      from-indigo-200 via-fuchsia-300 to-pink-200        /* 💡 light mode suave */
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-700
    ">
      {/* burbujas */}
      <motion.span
        className="pointer-events-none z-0 absolute w-60 h-60 bg-white/10 dark:bg-white/5 rounded-full -left-16 -top-16 blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="pointer-events-none z-0 absolute w-40 h-40 bg-white/10 dark:bg-white/5 rounded-full right-10 top-24 blur-3xl"
        animate={{ y: [0, -25, 0], x: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* card */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          relative z-10 w-full max-w-3xl mx-auto
          backdrop-blur-lg
          bg-white/70 dark:bg-slate-800/80
          border border-white/30 dark:border-slate-700/40
          shadow-2xl shadow-black/10 dark:shadow-black/40
          rounded-3xl p-8
        "
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-white"
        >
          Visualizador de&nbsp;Objetivos&nbsp;de&nbsp;Aprendizaje
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <SelectOA />
        </motion.div>
      </motion.section>
    </main>
  );
}
