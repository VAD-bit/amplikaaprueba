"use server";

import { NextResponse } from "next/server";
import { verifyClientAccess } from "@/lib/access";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  const clientId = await verifyClientAccess(token);
  if (!clientId) {
    return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
  }

  return NextResponse.json({ clientId });
}
