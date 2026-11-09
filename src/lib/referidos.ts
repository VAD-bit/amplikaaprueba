// Mejora 10: Programa de referidos y billetera interna.
// Permite a los clientes acumular créditos por traer nuevos negocios.

export interface Referido {
  id: string;
  cliente_id: string;
  cliente_referido_id: string | null;
  codigo_referido: string;
  creditos_acumulados: number;
  creditos_usados: number;
  estado: "activo" | "canjeado";
  creado_en: string;
}

export interface Billetera {
  cliente_id: string;
  saldo: number;
  movimientos: Movimiento[];
}

export interface Movimiento {
  id: string;
  tipo: "credito" | "debito";
  monto: number;
  motivo: string;
  fecha: string;
}

export function generarCodigoReferido(nombre: string): string {
  const base = nombre.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  const aleatorio = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${base}${aleatorio}`.toUpperCase();
}

export function calcularCreditos(montoClienteReferido: number): number {
  // 10% del monto del cliente referido se convierte en créditos
  return Math.round(montoClienteReferido * 0.1 * 100) / 100;
}

export function formatearCreditos(creditos: number): string {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(creditos);
}
