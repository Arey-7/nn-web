// app/providers.jsx

"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
