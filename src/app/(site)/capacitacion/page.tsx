"use client";

// Mejora 14: Área de capacitación en video para clientes.
// Ruta: /capacitacion (embebible en el dashboard del cliente)

import { useState } from "react";
import { Play, BookOpen, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

const VIDEOS = [
  {
    id: "editar-web",
    titulo: "Cómo editar tu propia web",
    descripcion: "Aprende a cambiar textos, imágenes y colores sin saber código.",
    duracion: "8:30",
  },
  {
    id: "publicar-instagram",
    titulo: "Publicar en Instagram desde tu móvil",
    descripcion: "Guía rápida para subir reels y historias que vendan.",
    duracion: "5:45",
  },
  {
    id: "leer-reportes",
    titulo: "Leer tus reportes semanales",
    descripcion: "Entiende qué contenido está funcionando y qué mejorar.",
    duracion: "6:15",
  },
];

export default function CapacitacionPage() {
  const [videoSeleccionado, setVideoSeleccionado] = useState<typeof VIDEOS[number] | null>(null);

  return (
    <main className="min-h-screen bg-paper text-ink font-grotesk antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-syne text-3xl font-bold text-ink mb-2 uppercase tracking-tight">
            Área de capacitación
          </h1>
          <p className="font-mono text-[10px] text-ink-mute uppercase tracking-widest">
            Tutoriales para clientes de AMPLIKAA
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            {VIDEOS.map((v) => (
              <button
                key={v.id}
                onClick={() => setVideoSeleccionado(v)}
                className={`flex items-center gap-3 p-4 border rounded-sm transition-colors ${
                  videoSeleccionado?.id === v.id
                    ? "bg-mark border-ink text-ink"
                    : "border-ink/10 bg-paper-3 text-ink-mute hover:border-ink/50"
                }`}
              >
                <div className="w-10 h-10 rounded bg-ink flex items-center justify-center shrink-0">
                  <Play size={18} fill={videoSeleccionado?.id === v.id ? "black" : "currentColor"} stroke={videoSeleccionado?.id === v.id ? "black" : "currentColor"} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-syne font-bold text-ink">{v.titulo}</h4>
                  <p className="font-mono text-[10px] text-ink-mute">{v.duracion}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-paper-3 border border-ink/20 rounded-sm p-6">
            {videoSeleccionado ? (
              <>
                <div className="aspect-video bg-ink mb-4 rounded-sm flex items-center justify-center">
                  <Film size={48} fill="currentColor" stroke="currentColor" />
                  <span className="font-syne text-xl font-bold text-ink">
                    {videoSeleccionado.titulo}
                  </span>
                </div>
                <p className="font-mono text-sm text-ink-soft leading-relaxed mb-4">
                  {videoSeleccionado.descripcion}
                </p>
                <Button variant="elec" className="w-full">
                  Reproducir video
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen size={48} fill="currentColor" stroke="currentColor" className="mx-auto mb-4 text-ink-mute" />
                <h3 className="font-syne font-bold text-ink">Selecciona un video</h3>
                <p className="font-mono text-[10px] text-ink-mute">
                  Haz clic en cualquier tutorial de la izquierda para comenzar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
