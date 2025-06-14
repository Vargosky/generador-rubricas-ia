/* ResumenBox – contenedor simple con título  */
"use client";

export function ResumenBox({
  titulo,
  children,
  full = false,
}: {
  titulo: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div
      className={`rounded bg-slate-800 p-4 ${
        full ? "md:col-span-2" : ""
      }`}
    >
      <h3 className="mb-2 text-lg font-semibold">{titulo}</h3>
      {children}
    </div>
  );
}
