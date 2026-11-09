"use client";

import { useState } from "react";
import { Bot, FileText, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { generarContenido, generarVariaciones, GeneracionIA } from "@/lib/ia-venezolana";

const TIPOS: { id: string; nombre: string }[] = [
  { id: "post", nombre: "Post para Instagram/Facebook" },
  { id: "historia", nombre: "Historia (Stories)" },
  { id: "reel", nombre: "Guion para Reel" },
  { id: "texto_publicitario", nombre: "Texto publicitario" },
];

export default function GeneradorIAPage() {
  const [tipo, setTipo] = useState<string>("post");
  const [negocio, setNegocio] = useState("");
  const [servicio, setServicio] = useState("");
  const [cantidad, setCantidad] = useState("3");
  const [resultados, setResultados] = useState<GeneracionIA[]>([]);

  const handleGenerar = () => {
    const variantes = generarVariaciones(tipo as any, negocio, servicio, parseInt(cantidad) || 3);
    setResultados(variantes);
  };

  const renderResultado = (r: GeneracionIA, i: number) => (
    <div key={i} className="border border-ink/20 bg-paper-3 p-4 rounded-sm">
      <div className="flex justify-between items-start mb-2">
        <span className="font-mono text-[10px] font-bold text-elec uppercase tracking-widest">
          {r.tipo}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(r.contenido);
          }}
          className="text-[9px] text-ink-mute hover:text-elec"
        >
          <Copy size={14} strokeWidth={2} /> Copiar
        </button>
      </div>
      <p className="font-syne text-sm text-ink leading-relaxed mb-3">{r.contenido}</p>
      <div className="flex gap-1">
        {r.hashtags.map((h) => (
          <span key={h} className="font-mono text-[9px] text-elec font-bold uppercase tracking-widest">
            #{h}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-paper text-ink font-grotesk antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-syne text-3xl font-bold text-ink mb-2 uppercase tracking-tight">
            Generador IA Venezolano
          </h1>
          <p className="font-mono text-[10px] text-ink-mute uppercase tracking-widest">
            Copy para redes con modismos locales
          </p>
        </div>

        <div className="glass p-6 rounded-sm border border-ink/20 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-mono mb-2 block" htmlFor="ia-tipo">Tipo de contenido</label>
              <select
                id="ia-tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="border border-ink/25 bg-paper-3 px-3 py-2 font-mono text-sm text-ink focus:border-elec outline-none"
              >
                {TIPOS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-mono mb-2 block" htmlFor="ia-negocio">Nombre del negocio</label>
              <Input id="ia-negocio" value={negocio} onChange={(e) => setNegocio(e.target.value)} placeholder="Ej: Panda Barber Estudio" required />
            </div>
            <div>
              <label className="label-mono mb-2 block" htmlFor="ia-servicio">Servicio o producto</label>
              <Input id="ia-servicio" value={servicio} onChange={(e) => setServicio(e.target.value)} placeholder="Ej: Corte de cabello" required />
            </div>
            <div>
              <label className="label-mono mb-2 block" htmlFor="ia-cantidad">Variaciones</label>
              <Input id="ia-cantidad" type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} min="1" max="10" required />
            </div>
          </div>
          <Button onClick={handleGenerar} variant="elec" className="w-full">
            <Bot size={18} strokeWidth={2} /> Generar contenido
          </Button>
        </div>

        {resultados.length > 0 && (
          <div className="mt-8">
            <h2 className="font-syne text-xl font-bold text-ink mb-2 uppercase tracking-tight">
              Variaciones generadas
            </h2>
            <div className="space-y-3">
              {resultados.map(renderResultado)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
