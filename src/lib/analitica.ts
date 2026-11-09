// Mejora 11: Analítica simple sin cookies de terceros.
// Registra vistas, clics y conversiones en una tabla propia de Supabase.

export interface EventoAnalitica {
  evento: string;
  slug?: string;
  pagina?: string;
  referer?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
}

export async function registrarEvento(
  supabase: any,
  evento: EventoAnalitica
): Promise<void> {
  try {
    await supabase.from("analitica_eventos").insert({
      evento: evento.evento,
      slug: evento.slug ?? null,
      pagina: evento.pagina ?? null,
      referer: evento.referer ?? null,
      user_agent: evento.user_agent ?? null,
      metadata: evento.metadata ?? {},
      creado_en: new Date().toISOString(),
    });
  } catch {
    // No bloquear la navegación si falla la analítica
  }
}

export function obtenerMetadatosNavegador(): {
  user_agent: string;
  referer: string;
} {
  if (typeof navigator === "undefined" || typeof document === "undefined") {
    return { user_agent: "", referer: "" };
  }
  return {
    user_agent: navigator.userAgent,
    referer: document.referrer,
  };
}
