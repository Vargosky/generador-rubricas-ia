// app/dashboard/Sidebar.tsx
'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import {
  Home, Calendar, Book, LayoutDashboard, Bot, TowerControl,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 transition-all duration-200',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-6 flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-200/40 dark:hover:bg-slate-700/40"
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <div className="mb-6 flex items-center gap-2 overflow-hidden">
        <LayoutDashboard size={24} />
        {!collapsed && <span className="text-2xl font-bold">EduCommand</span>}
      </div>

      <nav className="space-y-2">
        <NavLink href="/dashboard" icon={<Home size={18} />} collapsed={collapsed}>Inicio</NavLink>
        <NavLink href="/dashboard" icon={<Book size={18} />} collapsed={collapsed}>Mis Cursos</NavLink>
        <NavLink href="/dashboard" icon={<Bot size={18} />} collapsed={collapsed}>Mis Rúbricas</NavLink>
        <NavLink href="/dashboard/planificacion" icon={<Calendar size={18} />} collapsed={collapsed}>Crear Planificación</NavLink>
        <NavLink href="/dashboard/planificacioninversa" icon={<Calendar size={18} />} collapsed={collapsed}>Planificación Inversa</NavLink>
        <NavLink href="/dashboard" icon={<TowerControl size={18} />} collapsed={collapsed}>Reportes UTP</NavLink>
      </nav>
    </aside>
  );
}

type NavLinkProps = { href: string; icon: ReactNode; children: ReactNode; collapsed: boolean };
function NavLink({ href, icon, children, collapsed }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-200/40 dark:hover:bg-slate-700/40',
        collapsed && 'justify-center'
      )}
      title={typeof children === 'string' ? children : undefined}
    >
      {icon}
      {!collapsed && <span className="truncate">{children}</span>}
    </Link>
  );
}
