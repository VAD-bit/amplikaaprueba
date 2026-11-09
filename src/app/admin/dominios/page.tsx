"use client";

// Mejora 13: Gestión de dominios y SSL automática.
// Ruta: /admin/dominios (solo panel de admin)

import { useState } from "react";
import { Globe, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DOMINIOS_EJEMPLO = [
  { nombre: "pandabarberestudio.com", estado: "activo", ssl: "activo", expira: "2027-01-15" },
  { nombre: "cacaoreal.com.ve", estado: "activo", ssl: "activo", expira: "2026-11-30" },
  { nombre: "finora.ve", estado: "pendiente", ssl: "pendiente", expira: "—" },
];

export default function DominiosPage() {
  const [nuevoDominio, setNuevoDominio] = useState("");

  return (
    <main className="min-h-screen bg-paper text-ink font-grotesk antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-syne text-3xl font-bold text-ink mb-2 uppercase tracking-tight">
              Gestión de dominios
            </h1>
            <p className="font-mono text-[10px] text-ink-mute uppercase tracking-widest">
              Dominios y SSL para clientes
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              value={nuevoDominio}
              onChange={(e) => setNuevoDominio(e.target.value)}
              placeholder="ejemplo.com.ve"
              className="flex-1"
            />
            <Button variant="elec">Agregar dominio</Button>
          </div>
        </div>

        <div className="grid gap-4">
          {DOMINIOS_EJEMPLO.map((d) => (
            <article
              key={d.nombre}
              className="glass p-5 border border-ink/20 rounded-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Globe size={20} strokeWidth={2} fill="currentColor" />
                <div>
                  <h4 className="font-syne font-bold text-ink">{d.nombre}</h4>
                  <p className="font-mono text-[10px] text-ink-mute">
                    Estado: {d.estado} · SSL: {d.ssl}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-[10px] ${
                  d.ssl === "activo" ? "text-mint" : "text-naranja"
                }`}>
                  {d.ssl === "activo" ? <CheckCircle size={14} strokeWidth={2} fill="currentColor" /> : "Pendiente"}
                </span>
                <span className="font-mono text-[10px] text-ink-mute">
                  Vence: {d.expira}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
