"use client";

import React, { useState } from "react";
import { PlanificacionDetalle } from "@/types/Planificacion";
import { Instrumento } from "@/types/Instrumento";
import { promptGuionClase } from "@/util/promptGuionClase";
import { Button } from "@/components/ui/Button";
import { FiFileText, FiEye, FiEyeOff, FiDownload } from "react-icons/fi";

type Props = {
  detalle: PlanificacionDetalle[];
  /** Instrumento completo → necesario para crear el prompt */
  instrumento: Instrumento;
};

interface EstadoGuion {
  loading: boolean;
  texto: string;   // guion generado
  visible: boolean;
}

export default function PlanificacionDetalleList({
  detalle,
  instrumento,
}: Props) {
  // un estado por clase usando el número como clave
  const [guiones, setGuiones] = useState<Record<number, EstadoGuion>>({});

  /* -------- helpers -------- */
  const toggleVisible = (numero: number) =>
    setGuiones((prev) => ({
      ...prev,
      [numero]: { ...prev[numero], visible: !prev[numero]?.visible },
    }));

  const saveDocx = async (numero: number) => {
    const texto = guiones[numero]?.texto;
    if (!texto) return;

    const { Document, Packer, Paragraph } = await import("docx");
    const doc = new Document({
      sections: [
        {
          children: texto.split("\n").map((line) => new Paragraph(line)),
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Guion_clase_${numero}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generarGuion = async (clase: PlanificacionDetalle) => {
    setGuiones((prev) => ({
      ...prev,
      [clase.numero]: { loading: true, texto: "", visible: true },
    }));

    const prompt = promptGuionClase(instrumento, clase);
    const { reply } = await fetch("/api/enviarPromptDeepSeek", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    }).then((r) => r.json());

    setGuiones((prev) => ({
      ...prev,
      [clase.numero]: { loading: false, texto: reply, visible: true },
    }));
  };

  /* -------- render -------- */
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {detalle.map((clase) => {
        const estado = guiones[clase.numero];
        return (
          <div
            key={clase.numero}
            className="rounded-lg border border-gray-700 p-4 space-y-2"
          >
            {/* ---------- cabecera ---------- */}
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">Clase {clase.numero}</h3>

              {/* Botón principal */}
              <Button
                size="sm"
                onClick={() =>
                  estado?.texto
                    ? toggleVisible(clase.numero)
                    : generarGuion(clase)
                }
              >
                {estado?.loading ? (
                  "Generando…"
                ) : estado?.texto ? (
                  estado.visible ? (
                    <>
                      <FiEyeOff className="mr-1" /> Ocultar guion
                    </>
                  ) : (
                    <>
                      <FiEye className="mr-1" /> Ver guion
                    </>
                  )
                ) : (
                  <>
                    <FiFileText className="mr-1" /> Guion
                  </>
                )}
              </Button>
            </div>

            {/* ---------- contenido breve de la clase ---------- */}
            <section>
              <h4 className="font-medium">Inicio (preguntas detonantes)</h4>
              <ul className="list-disc list-inside">
                {clase.inicio.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="font-medium">Desarrollo</h4>
              <ul className="list-disc list-inside">
                {clase.desarrollo.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="font-medium">Cierre / Metacognición</h4>
              <p className="italic">Pregunta de reflexión:</p>
              <p>• {clase.cierre.preguntaReflexion}</p>
              <p className="italic mt-1">Conexión OA:</p>
              <p>• {clase.cierre.conexionOA}</p>
            </section>

            {clase.tarea && (
              <section>
                <h4 className="font-medium">Tarea / Trabajo progresivo</h4>
                <p>{clase.tarea}</p>
              </section>
            )}

            {/* ---------- panel guion + guardar ---------- */}
            {estado?.visible && estado.texto && (
              <div className="mt-2 space-y-2">
                <pre className="bg-black/60 p-3 rounded max-h-60 overflow-auto text-xs">
                  {estado.texto}
                </pre>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => saveDocx(clase.numero)}
                >
                  <FiDownload className="mr-1" /> Guardar
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
