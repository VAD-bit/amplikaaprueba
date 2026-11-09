import { requestClientAccess } from "@/lib/access";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { clientId, email } = body;

  if (!clientId || !email) {
    return NextResponse.json({ error: "clientId y email requeridos" }, { status: 400 });
  }

  const formData = new FormData();
  formData.append("clientId", clientId);
  formData.append("email", email);

  const result = await requestClientAccess(undefined as any, formData);

  if (result.status === "error") {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json({
    status: "success",
    token: result.token,
    accessUrl: result.accessUrl,
  });
}
