// Mejora 1: Conversor de tipo de cambio en tiempo real (BCV y paralelo).
// Fuente de datos: https://ve.dolarapi.com (mismo proveedor que usa Panda Barber Studio / DientesSanos)
// Consulta la API oficial de Venezuela para obtener el tipo de cambio del dólar y euro.

export interface TipoCambio {
  usd_ves: number;
  ves_usd: number;
  euro_ves: number;
  ves_euro: number;
  fecha: string;
  fuente: "bcv" | "paralelo" | "estimado";
}

let cache: { valor: TipoCambio; expira: number } | null = null;

const CACHE_MS = 10 * 60 * 1000; // 10 minutos

function valorPorDefecto(): TipoCambio {
  return {
    usd_ves: 36,
    ves_usd: 1 / 36,
    euro_ves: 42,
    ves_euro: 1 / 42,
    fecha: new Date().toISOString(),
    fuente: "estimado",
  };
}

/**
 * Obtiene el tipo de cambio real desde la API de ve.dolarapi.com
 * Fuente oficial del BCV (Banco Central de Venezuela)
 */
export async function obtenerTipoCambio(): Promise<TipoCambio> {
  const ahora = Date.now();
  if (cache && ahora < cache.expira) return cache.valor;

  try {
    const [usdRes, eurRes] = await Promise.all([
      fetch("https://ve.dolarapi.com/v1/dolares", { next: { revalidate: 600 } }),
      fetch("https://ve.dolarapi.com/v1/euros", { next: { revalidate: 600 } }),
    ]);
    if (!usdRes.ok || !eurRes.ok) throw new Error("Rates not available");
    const usdData = await usdRes.json();
    const eurData = await eurRes.json();

    const bcvRate = usdData.find((r: any) => r.fuente === "oficial");
    const euroRate = eurData.find((r: any) => r.fuente === "oficial");

    const usdVes = bcvRate?.promedio ?? 36;
    const euroVes = euroRate?.promedio ?? 42;

    const siguiente: TipoCambio = {
      usd_ves: usdVes,
      ves_usd: 1 / usdVes,
      euro_ves: euroVes,
      ves_euro: 1 / euroVes,
      fecha: bcvRate?.fechaActualizacion || new Date().toISOString(),
      fuente: "bcv",
    };

    cache = { valor: siguiente, expira: ahora + CACHE_MS };
    return siguiente;
  } catch {
    const estimado = valorPorDefecto();
    cache = { valor: estimado, expira: ahora + CACHE_MS };
    return estimado;
  }
}

export function usdAVes(usd: number, tipoCambio: TipoCambio): number {
  return Math.round(usd * tipoCambio.usd_ves * 100) / 100;
}

export function vesAUsd(ves: number, tipoCambio: TipoCambio): number {
  return Math.round(ves * tipoCambio.ves_usd * 100) / 100;
}

export function formatearVes(monto: number): string {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(monto);
}

export function formatearUsd(monto: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(monto);
}
