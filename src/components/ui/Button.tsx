"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Si `asChild` es true, el botón actuará como “slot” y adoptará
   * el componente hijo (útil para <Link> de Next.js).
   */
  asChild?: boolean;
  /**
   * Variante de estilo:
   * - default  (azul sólido)
   * - outline  (borde gris)
   * - ghost    (sin borde ni fondo, solo hover)
   */
  variant?: "default" | "outline" | "ghost";
  /** Tamaño del botón */
  size?: "sm" | "md" | "lg";
}

const base =
  "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
  outline:
    "border border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:hover:bg-gray-800",
  ghost:
    "bg-transparent hover:bg-gray-100 focus-visible:ring-gray-400 dark:hover:bg-gray-800",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        className={clsx(base, sizes[size], variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
