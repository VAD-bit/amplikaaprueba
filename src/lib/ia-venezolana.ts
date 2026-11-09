// Mejora 9: Generador de contenido con IA en español venezolano.
// Produce copy para redes sociales usando modismos y refranes locales.

export interface GeneracionIA {
  tipo: "post" | "historia" | "reel" | "texto_publicitario";
  contenido: string;
  hashtags: string[];
}

const MODISMOS = [
  "chévere",
  "arrecho",
  "estar loco",
  "echar los perros",
  "dar la vara",
  "está peludo",
  "saco",
  "tipo",
  "chamo",
  "pana",
  "labia",
  "jevo",
  "jeva",
  "bareto",
  "ñoño",
];

const PLANTILLAS_POR_TIPO: Record<string, string[]> = {
  post: [
    "¡Descubre {servicio} en {negocio}! Es súper chévere y te va a encantar. 😎",
    "En {negocio} tenemos lo mejor en {servicio}. No te lo pierdas, ¡está arrecho! 🔥",
    "¡Ya llegó lo nuevo a {negocio}! Ven y echa los perros a {servicio}. ✨",
  ],
  historia: [
    "¡Hoy en {negocio}! {servicio} para que te veas súper chévere. 📸",
    "¿Aún no pruebas {servicio}? En {negocio} te esperamos con la mejor labia. 💬",
  ],
  reel: [
    "Mirá este reel de {servicio} en {negocio}. ¡Está peludo, chamo! 🎬",
    "{servicio} en {negocio}: calidad y buen precio. Dale pana, no te lo pierdas. 🎥",
  ],
  texto_publicitario: [
    "{servicio} en {negocio}: calidad, buen precio y la mejor atención de la ciudad. ¡Visítanos hoy!",
    "{servicio} en {negocio}: calidad, buen precio y la mejor atención de la ciudad. ¡Visítanos hoy!",
  ],
};

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomModismo(): string {
  return getRandom(MODISMOS);
}

export function generarContenido(
  tipo: "post" | "historia" | "reel" | "texto_publicitario",
  negocio: string,
  servicio: string
): GeneracionIA {
  const plantillas = PLANTILLAS_POR_TIPO[tipo];
  const plantilla = getRandom(plantillas);
  let contenido = plantilla.replace("{negocio}", negocio).replace("{servicio}", servicio);
  contenido += ` ${getRandomModismo()}.`;

  const hashtags = ["#Venezuela", "#Maracay", `#${servicio.replace(/\s/g, "")}`, "#NegociosLocales", "#Amplikaa"];

  return {
    tipo,
    contenido,
    hashtags,
  };
}

export function generarVariaciones(
  tipo: "post" | "historia" | "reel" | "texto_publicitario",
  negocio: string,
  servicio: string,
  cantidad: number = 3
): GeneracionIA[] {
  return Array.from({ length: cantidad }, () => generarContenido(tipo, negocio, servicio));
}
