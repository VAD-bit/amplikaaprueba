"use client";

import { useState } from "react";
import { Phone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PagoProps {
  monto: number;
  moneda: "USD" | "VEF";
  referencia?: string;
}

export function PagosPagoMovilUSDT({ monto, moneda = "USD", referencia }: PagoProps) {
  const [metodo, setMetodo] = useState<"pagomovil" | "usdt">("pagomovil");

  const metodos = [
    {
      id: "pagomovil",
      nombre: "Pago Móvil",
      icono: <Phone size={24} strokeWidth={2} fill="currentColor" />,
      descripcion: "Pago Móvil - Venezuela",
      instrucciones: "Envía el monto al número: 0412-4633371",
    },
    {
      id: "usdt",
      nombre: "USDT (TRC20)",
      icono: <Wallet size={24} strokeWidth={2} fill="currentColor" />,
      descripcion: "Criptomoneda USDT",
      instrucciones: "Envía a la dirección: TAbCdEfGhIjKlMnOpQrStUvWxYz",
    },
  ];

  const metodoSeleccionado = metodos.find((m) => m.id === metodo);
  const montoMostrado = moneda === "USD" ? monto : monto * 36;

  return (
    <div className="bg-paper-3 border border-ink/20 rounded-lg p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="font-syne text-2xl font-bold text-ink mb-2 uppercase tracking-tight">
          Pagar con
        </h2>
        <p className="font-mono text-[10px] text-ink-mute uppercase tracking-widest">
          Selecciona tu método de pago
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {metodos.map((m) => (
          <button
            key={m.id}
            onClick={() => setMetodo(m.id as "pagomovil" | "usdt")}
            className={`flex items-center gap-3 p-4 rounded-sm border transition-colors ${metodo === m.id ? "bg-accentRed/10 border-accentRed text-accentRed" : "border-ink/10 text-ink-soft hover:border-ink"}`}
          >
            <div className="w-10 h-10 rounded bg-paper-3 flex items-center justify-center">
              {m.icono}
            </div>
            <div className="flex-1">
              <h4 className="font-mono text-sm font-bold text-ink">{m.nombre}</h4>
              <p className="font-mono text-xs text-ink-mute">{m.descripcion}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-sm border border-ink/20 bg-paper-3">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-ink-mute uppercase">
            Método de pago
          </span>
          <span className="font-syne text-sm font-bold text-ink">{metodoSeleccionado?.nombre}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs text-ink-mute">
            Monto a pagar
          </span>
          <span className="font-syne text-lg font-bold text-ink">
            ${moneda === "USD" ? monto.toFixed(2) : monto.toFixed(0)} {moneda}
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs text-ink-mute uppercase">
            Referencia
          </span>
          <span className="font-mono text-sm text-ink-mute truncate max-w-[200px]">
            {referencia || "Generando..."}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-ink-mute uppercase">
            Instrucciones
          </span>
          <span className="font-mono text-sm text-ink-soft">
            {metodoSeleccionado?.instrucciones}
          </span>
        </div>
      </div>

      <Button
        onClick={() => {
          alert(`Pago enviado por ${metodoSeleccionado?.nombre}. Monto: ${montoMostrado} ${moneda}`);
        }}
        variant="elec"
        className="w-full py-3 font-mono text-xs font-bold uppercase tracking-wider"
        disabled={!metodoSeleccionado}
      >
        Solicitar Pago
      </Button>
    </div>
  );
}
