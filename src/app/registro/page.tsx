"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const router = useRouter();

  // --- estados del registro ---
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  // --- estados del modal de reenvío ---
  const [modalOpen, setModalOpen] = useState(false);
  const [emailReenvio, setEmailReenvio] = useState("");
  const [reenviarStatus, setReenviarStatus] = useState<"enviando" | "exito" | "error" | "">("");

  /* ---- Registro ---- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://api-para-sistema-git-estructura-modular-vargoskys-projects.vercel.app/api/usuarios/registro",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al registrar usuario");

      setExito(true);
      // Si quieres redirigir tras unos segundos:
      // setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---- Reenvío ---- */
  const handleReenviar = async () => {
    if (!emailReenvio) return;

    setReenviarStatus("enviando");
    try {
      const res = await fetch(
        "https://api-para-sistema.vercel.app/api/usuarios/reenviar-verificacion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailReenvio }),
        }
      );

      if (!res.ok) throw new Error("Error al reenviar verificación");
      setReenviarStatus("exito");
    } catch {
      setReenviarStatus("error");
    }
  };
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
              onClick={() => {
                setModalOpen(false);
                setEmailReenvio("");
                setReenviarStatus("");
              }}
              className="w-full text-gray-300 text-sm hover:underline mt-2"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
