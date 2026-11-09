"use client";

// Mejora 1: Conversor de tipo de cambio en tiempo real para la portada.
import { useEffect, useState } from "react";
import { obtenerTipoCambio, usdAVes, formatearVes, type TipoCambio } from "@/lib/cambio";

export function CambioMoneda({ usd }: { usd: number }) {
  const [tc, setTc] = useState<TipoCambio | null>(null);

  useEffect(() => {
    obtenerTipoCambio().then((cambio) => {
      setTc(cambio);
    });
  }, []);

  const ves = tc ? usdAVes(usd, tc) : 0;

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-ink-mute">
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-elec" aria-hidden="true" />
        BCV / Paralelo
      </span>
      <span>
        ${usd} USD ≈ {tc ? formatearVes(ves) : "…"} VES
      </span>
      {tc && (
        <span className="text-[9px] uppercase tracking-widest">
          {tc.fuente === "bcv" ? "BCV" : tc.fuente === "paralelo" ? "Paralelo" : "Estimado"}
        </span>
      )}
    </div>
  );
}
