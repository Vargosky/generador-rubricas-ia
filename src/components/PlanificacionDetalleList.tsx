"use client";

import React from "react";
import { PlanificacionDetalle } from "@/types/Planificacion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";

type Props = {
  detalle: PlanificacionDetalle[];
  /** Callback opcional: se llama al pulsar «Generar guion» */
  onGenerarGuion?: (clase: PlanificacionDetalle) => void;
};

/**
 * Lista cada clase con su información y un botón para
 * disparar la generación del guion (futura funcionalidad).
 */
export default function PlanificacionDetalleList({
  detalle,
  onGenerarGuion,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {detalle.map((clase) => (
        <Card key={clase.numero}>
          <CardHeader>
            <CardTitle>Clase {clase.numero}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
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

            <Button
              variant="default"
              className="mt-2"
              onClick={() => onGenerarGuion?.(clase)}
            >
              Generar guion
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
