import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/home/section-head";

export default async function MiembroPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await getSupabaseServer();
  const slugL = String(slug).toLowerCase();

  if (!supabase) {
    return (
      <main className="min-h-screen bg-paper text-ink font-grotesk antialiased py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="font-syne text-3xl font-bold text-ink mb-2 uppercase tracking-tight">
          Supabase no está configurado
        </h1>
        <p className="font-mono text-[10px] text-ink-mute">
          Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
        </p>
      </main>
    );
  }

  const { data: member } = await supabase
    .from("team_members")
    .select("*")
    .eq("slug", slugL)
    .single();

  if (!member) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-paper text-ink font-grotesk antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-2">
          <a
            href="/"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-mute hover:text-elec transition-colors"
          >
            ← Volver al equipo
          </a>
        </div>

        <section className="grid gap-8 sm:grid-cols-12">
          <div className="sm:col-span-6 lg:col-span-5">
            <Reveal>
              <div className="relative group">
                <div className="aspect-[4/5] overflow-hidden rounded-sm border border-ink/25 bg-paper-3 shadow-[6px_6px_0_rgba(11,10,8,0.85)]">
                  <img
                    src={member.photo || ""}
                    alt={`${member.name}, ${member.role}`}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {member.ceo && (
                  <div className="absolute -top-3 left-3 bg-elec px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
                    Redacción fundadora
                  </div>
                )}
              </div>
            </Reveal>

            <div className="mt-6 flex gap-2 sm:flex-col">
              {member.contact_whatsapp && (
                <a
                  href={`https://wa.me/${member.contact_whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${member.name}, me interesa solicitar tus servicios de ${member.role}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-ink bg-paper px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-ink hover:bg-elec hover:text-ink transition-colors"
                >
                  Solicitar servicio por WhatsApp
                </a>
              )}
              {member.contact_email && (
                <a
                  href={`mailto:${member.contact_email}?subject=Solicitud de servicio - ${member.name}`}
                  className="flex items-center justify-center gap-2 border border-ink/25 bg-paper-3 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-ink-mute hover:bg-mark hover:text-ink transition-colors"
                >
                  Escríbeme por correo
                </a>
              )}
            </div>
          </div>

          <div className="sm:col-span-6 lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <span className="font-mono text-[10px] font-bold text-elec uppercase tracking-widest block mb-1">
                    {member.role}
                  </span>
                  <h1 className="font-syne text-3xl sm:text-4xl font-bold text-ink mb-2 uppercase tracking-tight leading-tight">
                    {member.name}
                  </h1>
                  {member.years_experience && (
                    <span className="font-mono text-[10px] font-bold text-ink-mute uppercase tracking-widest">
                      {member.years_experience} años de experiencia
                    </span>
                  )}
                </div>
              </div>

              {member.note && (
                <div className="mb-8">
                  <p className="font-syne text-lg italic leading-relaxed text-ink-soft">
                    {member.note}
                  </p>
                </div>
              )}

              {member.services && member.services.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-syne text-xl font-bold text-ink mb-4 uppercase tracking-tight">
                    Servicios
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(member.services as string[]).map((s: string) => (
                      <span
                        key={s}
                        className="border border-ink/25 bg-paper-3/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-soft"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {member.portfolio && member.portfolio.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-syne text-xl font-bold text-ink mb-4 uppercase tracking-tight">
                    Portafolio
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(member.portfolio as Array<{ title: string; image: string; url?: string }>).map((p: { title: string; image: string; url?: string }, i: number) => (
                      <article
                        key={i}
                        className="relative aspect-square overflow-hidden rounded-sm border border-ink/15 group"
                      >
                        <img
                          src={p.image}
                          alt={p.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="font-mono text-[9px] font-bold text-white uppercase tracking-widest">
                            Ver proyecto
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-2 z-10">
                          <span className="font-mono text-[9px] font-bold text-white uppercase tracking-widest drop-shadow">
                            {p.title}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </Reveal>
          </div>
        </section>

        <footer className="mt-16 border-t border-ink/25 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs font-mono text-ink">
              Amplikaa · Equipo · {member.name} · Vol. 2026
            </p>
            <a
              href="/"
              className="text-xs font-mono text-ink-soft hover:text-ink transition-colors cursor-pointer"
            >
              Volver a la portada
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
