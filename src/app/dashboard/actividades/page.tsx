import { Metadata } from "next";
import TipoTrabajoCard from "@/components/TipoTrabajoCard";
import tipos from "@/data/tiposActividades.json";

export const metadata: Metadata = {
  title: "Crear trabajo",
};

export default function TrabajosPage() {
  return (
    <main className="p-8 space-y-8 text-white">
      <h1 className="text-3xl font-bold">Elige un tipo de trabajo</h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tipos.map((t) => (
          <TipoTrabajoCard
            key={t.id}
            id={t.id}
            nombre={t.nombre}
            descripcion={t.descripcion}
            link={t.link}
          />
        ))}
      </div>
    </main>
  );
}