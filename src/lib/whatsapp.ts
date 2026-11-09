// Mejora 7: WhatsApp embebido con plantillas y reportes automáticos.
// Plantillas predefinidas para atención al cliente y reportes semanales.

export interface PlantillaWhatsApp {
  id: string;
  nombre: string;
  texto: (vars: Record<string, string>) => string;
}

export const PLANTILLAS_WHATSAPP: PlantillaWhatsApp[] = [
  {
    id: "bienvenida",
    nombre: "Bienvenida",
    texto: ({ nombre, servicio }) => `Hola ${nombre}, bienvenido a AMPLIKAA. Tu servicio de ${servicio} está activo. ¿En qué te ayudamos hoy?`,
  },
  {
    id: "recordatorio_cobro",
    nombre: "Recordatorio de cobro",
    texto: ({ nombre, monto, fecha }) => `Hola ${nombre}, te recordamos que tu próximo cobro es de ${monto} con fecha ${fecha}. ¿Deseas pagar por Pago Móvil o USDT?`,
  },
  {
    id: "entrega_semanal",
    nombre: "Entrega semanal",
    texto: ({ nombre, cantidad, enlace }) => `Hola ${nombre}, esta semana entregamos ${cantidad} pieza(s) de contenido. Revisa tu panel: ${enlace}`,
  },
  {
    id: "cita_confirmada",
    nombre: "Cita confirmada",
    texto: ({ nombre, servicio, fecha, hora }) => `Hola ${nombre}, tu cita de ${servicio} está confirmada para el ${fecha} a las ${hora}. ¡Te esperamos!`,
  },
];

export function renderPlantilla(id: string, vars: Record<string, string>): string | null {
  const plantilla = PLANTILLAS_WHATSAPP.find((p) => p.id === id);
  if (!plantilla) return null;
  return plantilla.texto(vars);
}

export function waLinkConPlantilla(whatsapp: string, plantillaId: string, vars: Record<string, string>): string | null {
  const texto = renderPlantilla(plantillaId, vars);
  if (!texto) return null;
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(texto)}`;
}
