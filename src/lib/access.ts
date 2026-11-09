import { getSupabaseServer } from "@/lib/supabase/server";
import { z } from "zod";

const requestAccessSchema = z.object({
  clientId: z.string().uuid(),
  email: z.string().email("Email inválido."),
});

export async function requestClientAccess(_prev: unknown, formData: FormData) {
  const parsed = requestAccessSchema.safeParse({
    clientId: formData.get("clientId"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Email inválido." };
  }

  const supabase = await getSupabaseServer();
  if (!supabase) {
    return { status: "error", message: "Supabase no está configurado." };
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("client_access_tokens").insert({
    client_id: parsed.data.clientId,
    email: parsed.data.email,
    token,
    expires_at: expiresAt,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "success",
    message: "Token generado.",
    token,
    accessUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://amplikaa.com"}/access/verify/${token}`,
  };
}

export async function verifyClientAccess(token: string) {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("client_access_tokens")
    .select("client_id, expires_at, used_at")
    .eq("token", token)
    .single();

  if (error || !data) return null;

  const now = new Date();
  const expires = new Date(data.expires_at);
  if (now > expires) return null;
  if (data.used_at) return null;

  await supabase
    .from("client_access_tokens")
    .update({ used_at: now.toISOString() })
    .eq("token", token);

  return data.client_id;
}
