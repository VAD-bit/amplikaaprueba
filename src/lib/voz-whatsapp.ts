// Mejora 15: Soporte por voz en WhatsApp.
// Permite al cliente enviar un audio por WhatsApp que se transcribe y crea una tarea automática.

export interface MensajeVoz {
  id: string;
  cliente_id: string;
  audio_url: string;
  transcripcion: string | null;
  tarea_creada: boolean;
  creado_en: string;
}

export function procesarAudioWhatsApp(
  audioUrl: string,
  clienteId: string
): MensajeVoz {
  // En una implementación real, aquí se usaría un servicio de speech-to-text
  // (ej. Whisper de OpenAI o Google Speech-to-Text) para transcribir el audio.
  const id = `voz-${Date.now()}`;
  return {
    id,
    cliente_id: clienteId,
    audio_url: audioUrl,
    transcripcion: null, // Se llena tras el procesamiento de STT
    tarea_creada: false,
    creado_en: new Date().toISOString(),
  };
}

export function waEnviarAudio(
  whatsapp: string,
  nombreCliente: string,
  mensaje: string
): string {
  const texto = encodeURIComponent(
    `Hola ${nombreCliente}, recibí tu mensaje de voz. ${mensaje} ¿Necesitas algo más?`
  );
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${texto}`;
}
