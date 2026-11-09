import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/home/section-head";
import { daysFromToday } from "@/lib/crm/format";

function inicioDeSemana() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dia = hoy.getDay();
  const diff = dia === 0 ? -6 : 1 - dia;
  hoy.setDate(hoy.getDate() + diff);
  return hoy.toISOString().slice(0, 10);
}

function renderEntregas(entregas: any[]) {
  if (entregas.length === 0) {
    return (
      <div className="col-span-full glass-dark rounded-xl p-10 text-center font-mono text-[11px] uppercase tracking-widest text-ink-mute">
        Sin entregas registradas esta semana todavía.
      </div>
    );
  }

  return (
    <>
      {entregas.map((e: any, i: number) => (
        <article key={e.id} className="border border-ink/20 bg-paper-3 p-5 rounded-sm">
          <div className="flex items-start justify-between mb-2">
            <span className="font-mono text-[9px] font-bold text-elec uppercase tracking-widest">
              {e.tipo}
            </span>
            <span className="font-mono text-[9px] text-ink-mute">
              {e.completed_at?.slice(0, 10).replaceAll("-", "/")}
            </span>
          </div>
          <h4 className="headline text-base uppercase mt-1 mb-2">{e.titulo}</h4>
          <p className="text-sm text-ink-soft leading-relaxed">
            {e.prioridad ? `Prioridad: ${e.prioridad}` : "Sin prioridad asignada"}
          </p>
        </article>
      ))}
    </>
  );
}

export default async function ClienteDashboard({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await getSupabaseServer();
  const slugL = String(slug).toLowerCase();

  if (!supabase) {
    return (
      <main className="min-h-screen bg-paper text-ink font-grotesk antialiased flex flex-col items-center justify-center p-6">
        <h1 className="font-syne text-3xl font-bold text-ink mb-2 uppercase tracking-tight">
          Supabase no está configurado
        </h1>
        <p className="font-mono text-[10px] text-ink-mute">
          Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
        </p>
      </main>
    );
  }

  const { data: client, error } = await supabase
    .from("clients")
    .select("*")
    .eq("slug", slugL)
    .single();

  if (error || !client) {
    notFound();
  }

  const c = client as any;
  const inicio = inicioDeSemana();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("client_id", c.id)
    .eq("tipo", "entrega")
    .not("completed_at", "is", null)
    .gte("completed_at", `${inicio}T00:00:00.000Z`)
    .order("completed_at", { ascending: false });

  const entregas = tasks ?? [];
  const cobroDias = daysFromToday(c.proxima_cobro);
  const cobroLabel = cobroDias == null ? "Sin fecha" : cobroDias <= 3 ? "Próximo vencimiento" : "Fecha de referencia";

  return (
    <main className="min-h-screen bg-paper text-ink font-grotesk antialiased">
      <header className="border-b border-ink/25 bg-paper py-8 px-5 sm:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-ink uppercase tracking-wider">
              <span className="border-r border-ink/25 pr-2">EDICIÓN DIGITAL</span>
              <span>PANEL DEL CLIENTE</span>
              <span className="border-l border-ink/25 pl-2">VOL. 2026</span>
            </div>
            <a href="/" className="flex items-center gap-2 text-ink font-syne font-bold text-xl">
              AMPLIK<span className="text-gradient">AA</span>
            </a>
          </div>
          <h1 className="font-syne text-3xl sm:text-4xl font-bold text-ink mb-2 leading-tight uppercase tracking-tight">
            {c.nombre}
          </h1>
          <p className="font-mono text-[10px] text-ink-mute uppercase tracking-widest">
            @{c.slug} · {c.empresa || "Sin empresa"}
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <section aria-label="Plan y cobro">
          <div className="grid gap-6 sm:grid-cols-3">
            <article className="glass p-6 border border-ink/20 rounded-sm">
              <p className="label-mono mb-1">Plan de redes</p>
              <h3 className="headline text-xl uppercase text-ink">{c.plan}</h3>
              <p className="mt-1 font-mono text-[10px] text-ink-mute">
                {c.ciclo === "semanal" ? "Cobro semanal" : c.ciclo === "mensual" ? "Cobro mensual" : "Proyecto único"}
              </p>
            </article>
            <article className="glass p-6 border border-ink/20 rounded-sm">
              <p className="label-mono mb-1">Precio</p>
              <h3 className="headline text-xl uppercase text-ink">{c.precio}</h3>
              <p className="mt-1 font-mono text-[10px] text-ink-mute">
                {c.ciclo === "semanal" ? "/semana" : c.ciclo === "mensual" ? "/mes" : " único"}
              </p>
            </article>
            <article className="glass p-6 border border-ink/20 rounded-sm">
              <p className="label-mono mb-1">Próximo cobro</p>
              <h3 className="headline text-xl uppercase text-ink">
                {c.proxima_cobro ? c.proxima_cobro.slice(0, 10).replaceAll("-", "/") : "—"}
              </h3>
              <p className="mt-1 font-mono text-[10px] text-ink-mute">{cobroLabel}</p>
              </article>
            </div>
          </section>

        <section id="contenido-semana" className="mt-16" aria-label="Contenido de la semana">
          <SectionHead
            id="tit-contenido"
            no="01"
            kicker="Contenido entregado"
            title={
              <>
                Esta semana<br />
                <span className="text-gradient italic">({inicio} a hoy)</span>
              </>
            }
            deck="Piezas de contenido que se han entregado en los últimos 7 días."
            meta={`${entregas.length} entrega${entregas.length !== 1 ? "s" : ""}`}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {renderEntregas(entregas)}
          </div>
        </section>
      </div>

      <footer className="border-t border-ink/25 bg-paper py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-ink">
            Amplikaa · Panel del cliente · {c.nombre} · Vol. 2026
          </p>
          <a href="/" className="text-xs font-mono text-ink-soft hover:text-ink transition-colors cursor-pointer">
            Volver a la portada
          </a>
        </div>
      </footer>
    </main>
  );
}
