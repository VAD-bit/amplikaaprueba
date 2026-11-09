import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("ceo", { ascending: false })
    .order("nombre", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ members: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 500 });
  }

  const body = await req.json();
  const { slug, nombre, role, ceo, years_experience, contact_whatsapp, contact_email, services, portfolio } = body;

  if (!slug || !nombre || !role) {
    return NextResponse.json({ error: "slug, nombre y role son requeridos" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("team_members")
    .insert({
      slug,
      nombre,
      role,
      ceo: ceo || false,
      years_experience: years_experience || 0,
      contact_whatsapp: contact_whatsapp || null,
      contact_email: contact_email || null,
      services: services || [],
      portfolio: portfolio || [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ member: data }, { status: 201 });
}
