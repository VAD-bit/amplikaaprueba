"use client";

// Mapa 12: Bot de Instagram y Facebook Messenger embedido.
// Ruta: /messenger (widget para sitios de clientes)

import { useState } from "react";
import { Send, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { procesarMensajeBot, waDesdeBot } from "@/lib/messenger";

export default function MessengerWidget({
  telefonoNegocio = "584124633371",
}: {
  telefonoNegocio?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<{ texto: string; tipo: "bot" | "usuario" }[]>([
    {
      texto: "¡Hola! Soy el asistente virtual de AMPLIKAA. ¿En qué puedo ayudarte hoy?",
      tipo: "bot",
    },
  ]);
  const [texto, setTexto] = useState("");

  const enviar = () => {
    if (!texto.trim()) return;
    const nuevo = [...mensajes, { texto, tipo: "usuario" as "bot" | "usuario" }];
    setMensajes(nuevo);
    setTexto("");

    const respuesta = procesarMensajeBot(texto);
    if (respuesta) {
      setTimeout(() => {
        setMensajes((prev) => [...prev, { texto: respuesta.texto, tipo: "bot" }]);
      }, 800);
    } else {
      setTimeout(() => {
        setMensajes((prev) => [
          ...prev,
          {
            texto: "No entendí tu mensaje. ¿Puedes escribir 'precio', 'ubicación' o 'horario'?",
            tipo: "bot",
          },
        ]);
      }, 800);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!abierto && (
        <button
          onClick={() => setAbierto(true)}
          className="w-14 h-14 rounded-full bg-elec flex items-center justify-center shadow-[4px_4px_0_rgba(11,10,8,0.85)] hover:shadow-[6px_6px_0_rgba(11,10,8,0.9)] transition-all"
          aria-label="Abrir chat"
        >
          <MessageCircle size={28} fill="black" stroke="black" />
        </button>
      )}
      {abierto && (
        <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
          <div className="glass p-4 rounded-sm border border-ink/20 w-80 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-syne text-lg font-bold text-ink uppercase tracking-tight">
                Asistente virtual
              </h3>
              <button
                onClick={() => setAbierto(false)}
                className="text-[10px] font-bold hover:text-elec"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2">
              {mensajes.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.tipo === "usuario" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-sm ${
                      m.tipo === "usuario"
                        ? "bg-elec text-ink self-end"
                        : "bg-mark text-ink self-start"
                    }`}
                  >
                    {m.texto}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 border border-ink/25 bg-paper-3 px-3 py-2 font-mono text-xs text-ink focus:border-elec outline-none"
              />
              <Button
                onClick={enviar}
                className="px-4 py-2 bg-elec text-ink hover:bg-mark"
              >
                <Send size={16} strokeWidth={2} />
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              {[
                { texto: "precio", accion: "web" },
                { texto: "ubicación", accion: "web" },
                { texto: "horario", accion: "web" },
              ].map((p) => (
                <button
                  key={p.texto}
                  onClick={() => {
                    setTexto(p.texto);
                    enviar();
                  }}
                  className="w-full text-left text-[10px] font-mono text-ink-mute hover:text-elec py-1"
                >
                  ¿{p.texto}?
                </button>
              ))}
              <a
                href={waDesdeBot("Hablar por WhatsApp", telefonoNegocio)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-ink bg-paper px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:bg-elec hover:text-ink transition-colors"
              >
                <Phone size={14} strokeWidth={2} /> Hablar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
