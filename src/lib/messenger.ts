// Mejora 12: Bot de Instagram y Facebook Messenger.
// Responde automáticamente preguntas frecuentes y deriva a WhatsApp para cierre.

export interface RespuestaBot {
  texto: string;
  opciones: { texto: string; accion: "web" | "whatsapp" | "ninguna" }[];
}

export const PREGUNTAS_FRECUENTES: Record<string, RespuestaBot> = {
  precio: {
    texto: "Nuestros planes comienzan en $65 USD semanales. ¿Quieres ver el detalle?",
    opciones: [
      { texto: "Ver planes", accion: "web" },
      { texto: "Hablar por WhatsApp", accion: "whatsapp" },
      { texto: "Nada por ahora", accion: "ninguna" },
    ],
  },
  ubicacion: {
    texto: "Estamos en Maracay, Estado Aragua, Venezuela. ¿Necesitas la dirección exacta?",
    opciones: [
      { texto: "Ver en mapa", accion: "web" },
      { texto: "Hablar por WhatsApp", accion: "whatsapp" },
      { texto: "Nada por ahora", accion: "ninguna" },
    ],
  },
  horario: {
    texto: "Atendemos de lunes a viernes de 9:00 a.m. a 5:00 p.m. ¿Quieres agendar una cita?",
    opciones: [
      { texto: "Agendar cita", accion: "web" },
      { texto: "Hablar por WhatsApp", accion: "whatsapp" },
      { texto: "Nada por ahora", accion: "ninguna" },
    ],
  },
};

export function procesarMensajeBot(mensaje: string): RespuestaBot | null {
  const m = mensaje.toLowerCase();
  if (m.includes("precio") || m.includes("cuesta") || m.includes("plan")) {
    return PREGUNTAS_FRECUENTES.precio;
  }
  if (m.includes("dónde") || m.includes("ubicacion") || m.includes("dirección")) {
    return PREGUNTAS_FRECUENTES.ubicacion;
  }
  if (m.includes("horario") || m.includes("abren") || m.includes("cerran")) {
    return PREGUNTAS_FRECUENTES.horario;
  }
  return null;
}

export function waDesdeBot(opcion: string, telefonoNegocio: string): string {
  const textos: Record<string, string> = {
    "Ver planes": "Hola AMPLIKAA, quiero ver los planes de marketing y sitios web.",
    "Hablar por WhatsApp": "Hola AMPLIKAA, me interesa hablar por WhatsApp.",
    "Ver en mapa": "Hola AMPLIKAA, necesito la dirección de su local.",
    "Agendar cita": "Hola AMPLIKAA, quiero agendar una cita.",
  };
  const texto = encodeURIComponent(textos[opcion] || "Hola");
  return `https://wa.me/${telefonoNegocio.replace(/\D/g, "")}?text=${texto}`;
}
