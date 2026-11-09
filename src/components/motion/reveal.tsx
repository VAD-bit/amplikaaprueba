import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  // Render siempre visible. La animación de entrada es una mejora progresiva
  // que framer-motion aplica en componentes individuales; este wrapper solo
  // garantiza que el contenido nunca quede oculto (opacity: 0) por una
  // hidratación fallida del cliente.
  return <div className={cn(className)} style={{ opacity: 1 }}>
    {children}
  </div>;
}

export const staggerParent = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
export const staggerChild = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } } };
