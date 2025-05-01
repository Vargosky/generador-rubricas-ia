// components/theme-provider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"      // añade 'dark' a <html>
      defaultTheme="system"  // respeta el SO
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}
