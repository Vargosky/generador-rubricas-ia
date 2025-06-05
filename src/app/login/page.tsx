"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import router from 'next/router';

export default function LoginPage() {
  
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://api-para-sistema-git-estructura-modular-vargoskys-projects.vercel.app/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Credenciales inválidas");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    /* 👉 redirección automática si el usuario ya está logueado */
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        router.replace("/dashboard");  // replace evita que el usuario vuelva con «atrás»
      }
    }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E1525] px-4">
      <div className="w-full max-w-md bg-[#131C31] text-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Bienvenido a EduCommand</h1>
        <p className="text-center text-sm text-gray-400">Inicia sesión para acceder a tu dashboard</p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#1C2743] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#1C2743] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          ¿No tienes cuenta? <a href="#" className="text-blue-400 hover:underline">Solicita acceso</a>
        </p>
      </div>
    </div>
  );
}
