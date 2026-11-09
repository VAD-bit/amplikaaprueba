"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ClienteInstagram {
  nombre: string;
  handle: string;
  categoria: string;
  descripcion: string;
  url: string;
}

const CLIENTES: ClienteInstagram[] = [
  {
    nombre: "Panda Barber Estudio",
    handle: "@pandabarberestudio",
    categoria: "Barbería",
    descripcion: "Barbería clásica, fades y diseños de barba en Caracas.",
    url: "https://www.instagram.com/pandabarberestudio/",
  },
];

export default function InstagramClientesPage() {
  return (
    <main className="min-h-screen bg-paper text-ink font-grotesk antialiased">
      <header className="border-b border-ink/25 bg-paper py-8 px-5 sm:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-ink uppercase tracking-wider">
              <span className="border-r border-ink/25 pr-2">EDICIÓN DIGITAL</span>
              <span>CLIENTES DE INSTAGRAM</span>
              <span className="border-l border-ink/25 pl-2">VOL. 2026</span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-ink font-syne font-bold text-xl"
            >
              AMPLIK<span className="text-gradient">AA</span>
            </Link>
          </div>
          <h1 className="font-syne text-3xl sm:text-4xl font-bold text-ink mb-2 leading-tight uppercase tracking-tight">
            Nuestros clientes en Instagram
          </h1>
          <p className="font-mono text-[10px] text-ink-mute max-w-2xl leading-relaxed">
            Sigue a nuestros clientes y descubre sus reels más vistos. Haz clic en cualquier perfil para abrir su página de Instagram.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="mb-12 border-b border-ink/25 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-syne text-2xl font-bold text-ink uppercase tracking-tight">
              Perfiles disponibles
            </h2>
            <p className="font-mono text-sm text-ink-mute mt-1">
              Todos los links de Instagram de nuestros clientes en una sola gaceta digital.
            </p>
          </div>
          <div className="font-mono text-xs text-ink uppercase tracking-widest">
            {CLIENTES.length} perfil{CLIENTES.length !== 1 ? "es" : ""}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CLIENTES.map((c) => (
            <motion.div
              key={c.handle}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: Math.random() * 0.2, type: "spring", stiffness: 100, damping: 14 }}
              className="border border-ink/20 bg-paper-3/80 backdrop-blur-sm p-6 hover:border-ink/50 hover:bg-paper-2/90 transition-colors duration-300 rounded-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-[10px] font-bold text-elec uppercase tracking-widest block mb-1">
                    {c.categoria}
                  </span>
                  <h3 className="font-syne text-xl font-bold text-ink leading-tight uppercase tracking-tight">
                    {c.nombre}
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-ink border border-ink/25 px-2 py-1 rounded">
                  {c.handle}
                </span>
              </div>
              <p className="font-mono text-sm text-ink-soft leading-relaxed mb-6">
                {c.descripcion}
              </p>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 border border-ink bg-paper px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-elec hover:text-ink",
                  "group"
                )}
              >
                Abrir Instagram <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-5 7-5"/></svg>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <footer className="border-t border-ink/25 bg-paper py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-ink">
            Amplikaa · Edición Digital · Clientes de Instagram · Vol. 2026
          </p>
          <Link
            href="/"
            className="text-xs font-mono text-ink-soft hover:text-ink transition-colors cursor-pointer"
          >
            Volver a la portada
          </Link>
        </div>
      </footer>
    </main>
  );
}
