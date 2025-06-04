"use client";

import React from "react";

interface Props {
  emailReenvio: string;
  setEmailReenvio: (value: string) => void;
  reenviarStatus: "enviando" | "exito" | "error" | "";
  handleReenviar: () => void;
  cerrarModal: () => void;
}

export default function ReenvioModal({
  emailReenvio,
  setEmailReenvio,
  reenviarStatus,
  handleReenviar,
  cerrarModal,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#131C31] p-6 rounded-lg w-full max-w-md space-y-4 text-white shadow-xl">
        <h2 className="text-xl font-semibold text-center">Reenviar correo de verificación</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={emailReenvio}
          onChange={(e) => setEmailReenvio(e.target.value)}
          className="w-full p-3 bg-[#1C2743] text-white border border-gray-600 rounded-lg"
        />

        <button
          onClick={handleReenviar}
          disabled={reenviarStatus === "enviando"}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
        >
          {reenviarStatus === "enviando" ? "Enviando..." : "Reenviar correo"}
        </button>

        {reenviarStatus === "exito" && (
          <p className="text-green-400 text-sm text-center">
            📧 Correo enviado con éxito. Revisa tu bandeja.
          </p>
        )}
        {reenviarStatus === "error" && (
          <p className="text-red-400 text-sm text-center">
            ❌ Hubo un problema. Intenta nuevamente.
          </p>
        )}

        <button
          onClick={cerrarModal}
          className="w-full text-gray-300 text-sm hover:underline mt-2"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
