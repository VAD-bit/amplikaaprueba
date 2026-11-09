"use client";

import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { calcularRemesa, generarReferenciaRemesa, waRemesa } from "@/lib/remesas";
import { obtenerTipoCambio } from "@/lib/cambio";

export default function CitasPage() {
  return (
    <main className="min-h-screen bg-paper text-ink font-grotesk antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-syne text-3xl font-bold text-ink mb-2 uppercase tracking-tight">
            Reserva de citas
          </h1>
          <p className="font-mono text-[10px] text-ink-mute uppercase tracking-widest">
            Reserva tu cita con Amplikaa
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="glass p-6 rounded-sm border border-ink/20 space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <Calendar size={20} strokeWidth={2} fill="currentColor" />
              <span className="font-mono text-xs font-bold text-ink">Selecciona fecha</span>
            </div>
            <Input type="date" className="border border-ink/25 bg-paper-3 px-3 py-2 font-mono text-sm text-ink focus:border-elec outline-none" />
          </div>
        </div>
      </div>
    </main>
  );
}
