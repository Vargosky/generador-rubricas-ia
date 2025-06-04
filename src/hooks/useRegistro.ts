import { useState } from "react";

export default function useRegistro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    nombre,
    setNombre,
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    loading,
    exito,
    handleSubmit,
  };
}
