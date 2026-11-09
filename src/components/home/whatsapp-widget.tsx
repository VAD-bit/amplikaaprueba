"use client";

import { useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANTILLAS_WHATSAPP, waLinkConPlantilla } from "@/lib/whatsapp";

export function WhatsAppWidget({ whatsapp }: { whatsapp: string }) {
  const [abierto, setAbierto] = useState(false);
  const [plantillaId, setPlantillaId] = useState<string | null>(null);
  const [vars, setVars] = useState<Record<string, string>>({});

  const link = plantillaId ? waLinkConPlantilla(whatsapp, plantillaId, vars) : null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!abierto && (
        <button
          onClick={() => setAbierto(true)}
          className="w-14 h-14 rounded-full bg-elec flex items-center justify-center shadow-[4px_4px_0_rgba(11,10,8,0.85)] hover:shadow-[6px_6px_0_rgba(11,10,8,0.9)] transition-all"
          aria-label="Abrir WhatsApp"
        >
          <Phone className="h-5 w-5 text-ink" />
        </button>
      )}
      {abierto && (
        <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
          <div className="glass p-4 rounded-sm border border-ink/20 w-72">
            <h3 className="font-syne text-lg font-bold text-ink mb-3 uppercase tracking-tight">
              WhatsApp
            </h3>
            <div className="space-y-2">
              {PLANTILLAS_WHATSAPP.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPlantillaId(p.id);
                    setVars({ nombre: "Cliente", servicio: "", monto: "", fecha: "", cantidad: "", enlace: "" });
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left border border-ink/10 rounded-sm hover:bg-mark text-xs font-mono text-ink transition-colors"
                >
                  <MessageCircle className="h-4 w-4 fill-current" />
                  {p.nombre}
                </button>
              ))}
              {plantillaId && (
                <div className="mt-4 pt-4 border-t border-ink/10 space-y-2">
                  <label className="font-mono text-[10px] text-ink-mute uppercase">Enviar a: {whatsapp}</label>
                  <Button
                    onClick={() => {
                      if (link) window.open(link, "_blank");
                      setAbierto(false);
                    }}
                    className="w-full"
                  >
                    Enviar por WhatsApp
                  </Button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setAbierto(false)}
            className="w-8 h-8 rounded-full border border-ink/25 bg-paper flex items-center justify-center text-ink hover:bg-elec"
            aria-label="Cerrar"
          >
            <span className="text-[10px] font-bold">✕</span>
          </button>
        </div>
      )}
    </div>
  );
}
