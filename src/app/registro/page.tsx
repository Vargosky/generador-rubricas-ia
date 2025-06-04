"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// hooks
import useRegistro from "@/hooks/useRegistro";
import useReenvioVerificacion from "@/hooks/useReenvioVerificacion";
import ReenvioModal from "./ReenvioModal";


export default function RegistroPage() {

  // hooks
  const {
    nombre, setNombre,
    email, setEmail,
    password, setPassword,
    error, loading, exito,
    handleSubmit
  } = useRegistro();
  
  const {
    modalOpen, setModalOpen,
    emailReenvio, setEmailReenvio,
    reenviarStatus, handleReenviar, cerrarModal, setReenviarStatus
  } = useReenvioVerificacion();
  const router = useRouter();


  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E1525] px-4">
      <div className="w-full max-w-md bg-[#131C31] text-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Crear cuenta en EduCommand</h1>
        <p className="text-center text-sm text-gray-400">Completa el formulario para comenzar</p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {exito && (
          <p className="text-green-500 text-sm text-center">
            Registro exitoso. Revisa tu correo para confirmar tu cuenta.
          </p>
        )}

        {/* ---------- Formulario ---------- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full p-3 bg-[#1C2743] text-white border border-gray-600 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-[#1C2743] text-white border border-gray-600 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 bg-[#1C2743] text-white border border-gray-600 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Inicia sesión
          </a>
        </p>

        {/* ---------- Botón para abrir modal ---------- */}
        <p className="text-center text-xs mt-4">
          ¿No recibiste el correo?{" "}
          <button onClick={() => setModalOpen(true)} className="text-blue-400 hover:underline">
            Reenviar verificación
          </button>
        </p>
      </div>

      {/* ---------- MODAL ---------- */}
      {modalOpen && (
        <ReenvioModal
          emailReenvio={emailReenvio}
          setEmailReenvio={setEmailReenvio}
          reenviarStatus={reenviarStatus}
          handleReenviar={handleReenviar}
          cerrarModal={cerrarModal}
        />
      )}
    </div>
  );
}
