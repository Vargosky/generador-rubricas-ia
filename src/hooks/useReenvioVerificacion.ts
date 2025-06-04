import { useState } from "react";

type EstadoReenvio = "enviando" | "exito" | "error" | "";

export default function useReenvioVerificacion() {
  const [modalOpen, setModalOpen] = useState(false);
  const [emailReenvio, setEmailReenvio] = useState("");
  const [reenviarStatus, setReenviarStatus] = useState<EstadoReenvio>("");

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

  const cerrarModal = () => {
    setModalOpen(false);
    setEmailReenvio("");
    setReenviarStatus("");
  };

  return {
    modalOpen,
    setModalOpen,
    emailReenvio,
    setEmailReenvio,
    reenviarStatus,
    handleReenviar,
    cerrarModal,
    setReenviarStatus,
  };
}
