"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type Props = {
  id: string;
  nombre: string;
  descripcion: string;
  link: string;        // 👈 nuevo
};

export default function TipoTrabajoCard({ nombre, descripcion, link }: Props) {
  return (
    <div className="rounded-xl border border-gray-700 p-5 flex flex-col justify-between bg-gray-800 px-10 py-5">
      <div>
        <h3 className="text-lg font-semibold mb-2">{nombre}</h3>
        <p className="text-sm text-gray-300">{descripcion}</p>
      </div>

      <Button asChild className="mt-4 self-end w-full">
        <Link href={link}>Crear</Link>
      </Button>
    </div>
  );
}
