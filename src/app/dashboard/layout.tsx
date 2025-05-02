// app/dashboard/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { Home, Calendar, Book, LayoutDashboard, Bot, TowerControl } from "lucide-react";
import { cn } from "@/lib/utils"; // asegúrate de tener este helper para classNames
import "@/app/globals.css";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <LayoutDashboard size={24} />
          EduCommand
        </h1>
        <nav className="space-y-2">
          <NavLink href="/dashboard" icon={<Home size={18} />}>Inicio</NavLink>
          <NavLink href="/dashboard" icon={<Book size={18} />}>Mis Cursos</NavLink>
          <NavLink href="/dashboard" icon={<Bot size={18} />}>Mis Rubricas</NavLink>
          <NavLink href="/dashboard/planificacion" icon={<Calendar size={18} />}>Crear Planificacion</NavLink>
          <NavLink href="/dashboard/planificacioninversa" icon={<Calendar size={18} />}> Crear Planificacion inversa</NavLink>
          <NavLink href="/dashboard" icon={<TowerControl size={18} />}>Reportes para UTP</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/70 backdrop-blur">
          <span className="text-sm font-medium">Panel del Profesor</span>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-200/40 dark:hover:bg-slate-700/40 transition-colors"
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
