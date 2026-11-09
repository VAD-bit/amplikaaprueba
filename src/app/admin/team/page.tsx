"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

function generarSlug(nombre: string): string {
  return String(nombre)
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

interface Miembro {
  id: string;
  slug: string;
  nombre: string;
  role: string;
  ceo: boolean;
  years_experience: number;
  contact_whatsapp: string | null;
  contact_email: string | null;
  services: string[];
  portfolio: Array<{ title: string; image: string; url?: string }>;
}

export default function EquipoAdminPage() {
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [nombre, setNombre] = useState("");
  const [role, setRole] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEditando, setSlugEditando] = useState(false);
  const [yearsExperience, setYearsExperience] = useState("0");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [ceo, setCeo] = useState(false);
  const [services, setServices] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  useEffect(() => {
    cargarMiembros();
  }, []);

  async function cargarMiembros() {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setMiembros((data.members ?? []).map((m: any) => ({
        ...m,
        services: Array.isArray(m.services) ? m.services : [],
        portfolio: Array.isArray(m.portfolio) ? m.portfolio : [],
      })));
    } catch {
      setMensaje({ tipo: "error", texto: "No se pudo cargar el equipo" });
    }
  }

  function handleNombreChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNombre(e.target.value);
    if (!slugEditando) {
      setSlug(generarSlug(e.target.value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setMensaje(null);

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug || generarSlug(nombre),
          nombre,
          role,
          ceo,
          years_experience: parseInt(yearsExperience) || 0,
          contact_whatsapp: whatsapp || null,
          contact_email: email || null,
          services: services.split(",").map((s) => s.trim()).filter(Boolean),
          portfolio: [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: data.error || "Error al crear miembro" });
        return;
      }

      setMensaje({ tipo: "exito", texto: `Miembro "${nombre}" creado con slug /equipo/${slug || generarSlug(nombre)}` });
      setNombre("");
      setRole("");
      setSlug("");
      setSlugEditando(false);
      setYearsExperience("0");
      setWhatsapp("");
      setEmail("");
      setCeo(false);
      setServices("");
      await cargarMiembros();
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexión" });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper text-ink font-grotesk antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest underline-offset-4 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Panel
            </Link>
            <h1 className="font-syne text-3xl font-bold text-ink mb-2 uppercase tracking-tight">
              Equipo
            </h1>
            <p className="font-mono text-[10px] text-ink-mute">
              Gestiona los miembros del equipo y sus URLs públicas
            </p>
          </div>
          <Link
            href="/equipo"
            className="text-xs font-mono text-ink-soft hover:text-elec transition-colors"
          >
            Ver equipo público
          </Link>
        </div>

        {mensaje && (
          <div className={`mb-6 p-4 rounded-sm border ${
            mensaje.tipo === "exito" ? "border-mint bg-mint/20 text-ink" : "border-red-400/40 bg-red-500/10 text-red-300"
          }`}>
            <p className="font-mono text-[10px]">{mensaje.texto}</p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass p-6 rounded-sm border border-ink/20 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-mono mb-2 block" htmlFor="tm-nombre">Nombre *</label>
                  <Input
                    id="tm-nombre"
                    value={nombre}
                    onChange={handleNombreChange}
                    placeholder="Nombre completo"
                    required
                  />
                </div>
                <div>
                  <label className="label-mono mb-2 block" htmlFor="tm-slug">Slug URL *</label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="tm-slug"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setSlugEditando(true);
                      }}
                      placeholder="victor-diaz"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSlug(generarSlug(nombre));
                        setSlugEditando(false);
                      }}
                      className="text-[10px] text-ink-mute hover:text-elec underline"
                    >
                      Auto
                    </button>
                  </div>
                  <p className="font-mono text-[9px] text-ink-mute mt-1">
                    Se usa en la URL: /equipo/tu-slug
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="label-mono mb-2 block" htmlFor="tm-role">Rol / Cargo</label>
                  <Input id="tm-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ej: Diseñadora Senior" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-mono mb-2 block" htmlFor="tm-years">Años de experiencia</label>
                  <Input id="tm-years" type="number" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} placeholder="0" />
                </div>
                <div>
                  <label className="label-mono mb-2 block" htmlFor="tm-whatsapp">WhatsApp</label>
                  <Input id="tm-whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+58 4XX XXX XXXX" />
                </div>
                <div>
                  <label className="label-mono mb-2 block" htmlFor="tm-email">Correo</label>
                  <Input id="tm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@amplikaa.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-mono mb-2 block" htmlFor="tm-services">Servicios (separados por coma)</label>
                  <Input
                    id="tm-services"
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    placeholder="Identidad, Diseño editorial, Video"
                  />
                  <p className="font-mono text-[9px] text-ink-mute mt-1">
                    Ej: Identidad de marca, Diseño editorial, Packaging
                  </p>
                </div>
                <div className="sm:col-span-2 flex items-end">
                  <label className="label-mono mb-2 block mr-2">CEO / Fundador</label>
                  <input
                    type="checkbox"
                    checked={ceo}
                    onChange={(e) => setCeo(e.target.checked)}
                    className="w-4 h-4 border border-ink rounded text-ink focus:ring-elec"
                  />
                </div>
              </div>
              <Button type="submit" variant="elec" className="w-full py-3" disabled={enviando}>
                {enviando ? "Creando…" : "Crear miembro del equipo"}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="glass p-5 rounded-sm border border-ink/20">
              <h3 className="font-syne text-xl font-bold text-ink mb-4">Miembros existentes</h3>
              <div className="space-y-3">
                {miembros.length === 0 ? (
                  <p className="font-mono text-[10px] text-ink-mute text-center py-4">
                    Sin miembros todavía
                  </p>
                ) : (
                  <>
                    {miembros.map((m) => (
                      <div key={m.id} className="border border-ink/10 bg-paper-3 p-3 rounded-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-syne font-bold text-ink text-sm">{m.nombre}</span>
                          {m.ceo && (
                            <span className="font-mono text-[9px] text-elec uppercase tracking-widest">
                              CEO
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[9px] text-ink-mute mb-2">
                          {m.role} · {m.years_experience} años
                        </p>
                        <div className="flex gap-2">
                          <a
                            href={`/equipo/${m.slug}`}
                            className="text-[10px] text-ink hover:text-elec underline"
                          >
                            Ver perfil
                          </a>
                          <span className="font-mono text-[10px] text-ink-mute">
                            /equipo/{m.slug}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
