"use client";

import { useState } from "react";
import { ArrowRight, Check, FileText, Film, Image, Palette, ScrollText, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { waLink } from "@/lib/config";
import { PagosPagoMovilUSDT } from "@/components/home/pagos";

const SERVICIOS: { id: string; nombre: string; icono: JSX.Element; descripcion: string }[] = [
  { id: "edicion", nombre: "Una edición", icono: <FileText size={24} strokeWidth={2} />, descripcion: "Maquetación y diseño editorial tipo periódico, columnas y tipografía serifa." },
  { id: "disenio", nombre: "Un diseño", icono: <Palette size={24} strokeWidth={2} />, descripcion: "Identidad visual, logotipo, sistema de marca y piezas gráficas." },
  { id: "grabacion", nombre: "Una grabación", icono: <Film size={24} strokeWidth={2} />, descripcion: "Producción audiovisual, reels, video corporativo y contenido para redes." },
  { id: "redes", nombre: "Manejo de redes", icono: <ScrollText size={24} strokeWidth={2} />, descripcion: "Gestión de comunidades, calendario de contenido y pauta en redes sociales." },
  { id: "estrategia", nombre: "Estrategia de marketing", icono: <Target size={24} strokeWidth={2} />, descripcion: "Plan de medios, embudos de venta, posicionamiento y análisis de mercado." },
  { id: "sistema", nombre: "Un sistema", icono: <Check size={24} strokeWidth={2} />, descripcion: "Web apps, portales, CRM y herramientas a medida para tu negocio." },
];

export default function CotizarPage() {
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [enviado, setEnviado] = useState(false);

  const servicio = SERVICIOS.find((s) => s.id === servicioSeleccionado);
  const montoNumerico = parseInt(presupuesto.replace(/[^0-9]/g, "")) || 0;

  const mensaje = encodeURIComponent(
    `Hola AMPLIKAA, quiero solicitar una cotización:\n\n` +
    `*Servicio:* ${servicio?.nombre || "Sin seleccionar"}\n` +
    `*Nombre:* ${nombre || "No indicado"}\n` +
    `*WhatsApp:* ${whatsapp || "No indicado"}\n` +
    `*Descripción:* ${descripcion || "Sin descripción"}\n` +
    `*Presupuesto buscado:* ${presupuesto || "No indicado"}`
  );

  return (
    <main className="min-h-screen bg-paper text-ink font-grotesk antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {!enviado ? (
          <>
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-ink/25 rounded-full text-[10px] font-mono uppercase tracking-widest text-ink-mute mb-4">
                Paso 1 de 3 · Elige tu servicio
              </div>
              <h1 className="font-syne text-4xl font-bold text-ink mb-4 uppercase tracking-tight leading-tight">
                Cotiza tu<br />
                <span className="text-gradient">servicio</span>
              </h1>
              <p className="font-mono text-[11px] text-ink-soft max-w-lg leading-relaxed">
                Dinos qué necesitas y cuánto buscas invertir. Te respondemos en menos de 24 horas con una propuesta clara y sin compromiso.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6 mb-10">
              {SERVICIOS.map((s) => (
                <button key={s.id} onClick={() => setServicioSeleccionado(s.id)} className={`flex flex-col items-center gap-3 p-5 rounded-sm border transition-all duration-300 ${servicioSeleccionado === s.id ? "border-ink bg-mark text-ink shadow-[3px_3px_0_rgba(11,10,8,0.85)]" : "border-ink/10 text-ink-soft hover:border-ink hover:bg-paper-3"}`}>
                  <div className="w-12 h-12 rounded bg-paper-3 flex items-center justify-center mb-2">
                    {s.icono}
                  </div>
                  <span className="font-syne font-bold text-sm uppercase tracking-tight leading-tight text-center">{s.nombre}</span>
                  <p className="font-mono text-[9px] text-ink-mute text-center leading-relaxed">{s.descripcion}</p>
                </button>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setEnviado(true); }} className="glass p-6 rounded-sm border border-ink/20 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-mono mb-2 block" htmlFor="cot-nombre">Tu nombre</label>
                  <Input id="cot-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" required />
                </div>
                <div>
                  <label className="label-mono mb-2 block" htmlFor="cot-whatsapp">WhatsApp</label>
                  <Input id="cot-whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+58 4XX XXX XXXX" required />
                </div>
              </div>
              <div>
                <label className="label-mono mb-2 block" htmlFor="cot-descripcion">¿Qué es lo que realmente quieres?</label>
                <Textarea id="cot-descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descríbelo en un párrafo pequeño: qué necesitas, para qué lo vas a usar y qué esperas lograr." rows={4} required />
              </div>
              <div>
                <label className="label-mono mb-2 block" htmlFor="cot-presupuesto">¿Qué presupuesto buscas?</label>
                <Input id="cot-presupuesto" type="text" value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)} placeholder="Ej: $300 – $600" required />
              </div>
              <div className="pt-2">
                <p className="font-mono text-[10px] text-ink-mute">Servicio seleccionado: <span className="font-bold text-ink">{servicio?.nombre || "—"}</span></p>
                <PagosPagoMovilUSDT monto={montoNumerico} moneda="USD" />
              </div>
              <button type="submit" variant="elec" className="w-full py-4">Solicitar cotización</button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-elec flex items-center justify-center mx-auto mb-6"><Check size={32} fill="black" stroke="black" /></div>
              <h2 className="font-syne text-3xl font-bold text-ink mb-4 uppercase tracking-tight">Cotización enviada</h2>
              <p className="font-mono text-[11px] text-ink-mute mb-8 max-w-md mx-auto leading-relaxed">Gracias por tu solicitud. Te contactaremos por WhatsApp en menos de 24 horas con tu propuesta personalizada.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`https://wa.me/${"584124633371"}?text=${mensaje}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border border-ink bg-paper px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:bg-elec hover:text-ink"><ArrowRight size={18} strokeWidth={2} /> Abrir WhatsApp</a>
                <button onClick={() => setEnviado(false)} variant="outline" className="flex items-center justify-center gap-2 border border-ink bg-paper px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:bg-mark hover:text-ink">Enviar otra cotización</button>
              </div>
              <PagosPagoMovilUSDT monto={montoNumerico} moneda="USD" />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
