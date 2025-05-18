// app/dashboard/layout.tsx
'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import {
  Home,
  Calendar,
  Book,
  LayoutDashboard,
  Bot,
  TowerControl,
  ChevronLeft,
  ChevronRight,
  LucideProps,
  CheckCheck,
  FileCog,
  BookA,
  CalendarArrowDownIcon,
  CalendarArrowUpIcon,
  Apple
} from 'lucide-react';
import { cn } from '@/lib/utils';
import '@/app/globals.css';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);
  const [pinned, setPinned] = useState(false);
  const isCollapsed = pinned ? false : collapsed;

  const iconSize = isCollapsed ? 24 : 18;

  return (
    <div className="flex min-h-screen bg-gray-100 text-slate-900 dark:bg-slate-900 dark:text-white">
      {/* ---------- Sidebar ---------- */}
      <aside
        className={cn(
          'flex flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 transition-all duration-200 items-center',
          isCollapsed ? 'w-20' : 'w-64'
        )}
        onMouseEnter={() => !pinned && setCollapsed(false)}
        onMouseLeave={() => !pinned && setCollapsed(true)}
      >
        {/* Pin / unpin */}
        <button
          onClick={() => setPinned(!pinned)}
          className="mb-6 flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-200/40 dark:hover:bg-slate-700/40"
          aria-label={pinned ? 'Desanclar menú' : 'Anclar menú'}
        >
          {pinned
            ? <ChevronLeft size={24} />   /* cuando está fijado */
            : <ChevronRight size={18} />}  

        </button>

        {/* Logo */}
        <div className="mb-6 flex items-center gap-2 overflow-hidden">
          <LayoutDashboard size={iconSize} />
          {/* {!isCollapsed && <span className="truncate text-2xl font-bold">EduCommand</span>} */}
        </div>

        {/* Enlaces */}
        <nav className="space-y-2">
          <NavLink href="/dashboard" icon={Home} iconSize={iconSize} collapsed={isCollapsed}>Inicio</NavLink>
          <NavLink href="/dashboard" icon={Apple} iconSize={iconSize} collapsed={isCollapsed}>Mis Cursos</NavLink>
          <NavLink href="/dashboard" icon={Bot} iconSize={iconSize} collapsed={isCollapsed}>Mis Rúbricas</NavLink>
          <NavLink href="/dashboard/planificacion" icon={CalendarArrowDownIcon} iconSize={iconSize} collapsed={isCollapsed}>Crear Planificación</NavLink>
          <NavLink href="/dashboard/planificacioninversa" icon={CalendarArrowUpIcon} iconSize={iconSize} collapsed={isCollapsed}>Planificación Inversa</NavLink>
          <NavLink href="/dashboard/oa" icon={BookA} iconSize={iconSize} collapsed={isCollapsed}>Objetivos Aprendizaje</NavLink>

    {/*Seccion de Trabajos */} 
          <NavLink href="/dashboard/crear_trabajos" icon={FileCog} iconSize={iconSize} collapsed={isCollapsed}>Crear Trabajos</NavLink>
          <NavLink href="/dashboard/revisar_trabajos" icon={CheckCheck} iconSize={iconSize} collapsed={isCollapsed}>Revisar Trabajos</NavLink>
          
        </nav>
      </aside>

      {/* ---------- Contenido principal ---------- */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/60 px-6 backdrop-blur dark:border-slate-700 dark:bg-slate-800/70">
          {/* <span className="text-sm font-medium">Panel del Profesor</span> */}   {/* Esto se ve difuminado en el fondo y es tapado por el menu superior */} 
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

/* --------------- NavLink --------------- */
type IconComponent = React.ComponentType<LucideProps>;

type NavLinkProps = {
  href: string;
  icon: IconComponent;   // 👈 recibe el componente
  iconSize: number;
  children: ReactNode;
  collapsed: boolean;
};

function NavLink({ href, icon: Icon, iconSize, children, collapsed }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-200/40 dark:hover:bg-slate-700/40',
        collapsed && 'justify-center'
      )}
      title={typeof children === 'string' ? children : undefined}
    >
      <Icon size={iconSize} />
      {!collapsed && <span className="truncate">{children}</span>}
    </Link>
  );
}
