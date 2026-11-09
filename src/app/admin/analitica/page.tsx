"use client";

import React from "react";
import { useState } from "react";
import { Activity, Users, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ICONOS: Record<string, React.ReactElement> = {
  visitas: <Activity size={20} strokeWidth={2} fill="currentColor" />,
  clientes: <Users size={20} strokeWidth={2} fill="currentColor" />,
  whatsapp: <TrendingUp size={20} strokeWidth={2} fill="currentColor" />,
  conversiones: <BarChart3 size={20} strokeWidth={2} fill="currentColor" />,
};

export default function AnaliticaPage() {
  const [periodo, setPeriodo] = useState<"7d" | "30d" | "90d">("30d");

  const metricas = [
    { label: "Visitas totales", valor: "12,450", iconoKey: "visitas" },
    { label: "Clientes únicos", valor: "340", iconoKey: "clientes" },
    { label: "Clics en WhatsApp", valor: "890", iconoKey: "whatsapp" },
    { label: "Conversiones", valor: "23", iconoKey: "conversiones" },
  ];

  const periodos: ("7d" | "30d" | "90d")[] = ["7d", "30d", "90d"];

  return (
    <main className="min-h-screen bg-paper text-ink font-grotesk antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-syne text-3xl font-bold text-ink mb-2 uppercase tracking-tight">
              Analítica
            </h1>
            <p className="font-mono text-[10px] text-ink-mute uppercase tracking-widest">
              Métricas de la plataforma (sin cookies de terceros)
            </p>
          </div>
          <div className="flex gap-2">
            {periodos.map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={cn(
                  "px-3 py-1 border rounded-sm text-xs font-mono transition-colors",
                  periodo === p ? "bg-mark border-ink" : "border-ink/25 text-ink-mute"
                )}
              >
                Últimos {p === "7d" ? "7 días" : p === "30d" ? "30 días" : "90 días"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricas.map((m) => (
            <article key={m.label} className="glass p-5 border border-ink/20 rounded-sm">
              <div className="flex justify-between items-start mb-3">
                <div>{ICONOS[m.iconoKey]}</div>
              </div>
              <h3 className="font-syne text-2xl font-bold text-ink">{m.valor}</h3>
              <p className="font-mono text-[10px] text-ink-mute">{m.label}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 glass p-6 border border-ink/20 rounded-sm">
          <h3 className="font-syne text-lg font-bold text-ink mb-4">Eventos recientes</h3>
          <div className="space-y-3">
            {[
              { evento: "Visita a /pandabarberestudio", cliente: "Panda Barber Estudio", hora: "hace 2 min" },
              { evento: "Clic en WhatsApp", cliente: "Cacao Real", hora: "hace 15 min" },
              { evento: "Descarga de factura", cliente: "Finora", hora: "hace 1 hora" },
              { evento: "Registro de nuevo cliente", cliente: "Hotel Ávila", hora: "hace 3 horas" },
            ].map((e, i) => (
              <div key={i} className="flex justify-between items-center border-b border-ink/10 pb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-ink-mute">{e.hora}</span>
                  <span className="font-syne text-sm text-ink">{e.evento}</span>
                </div>
                <span className="font-mono text-[10px] text-ink-mute">{e.cliente}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
