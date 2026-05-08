import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function getSessionOrThrow() {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, error: errorResponse("Unauthorized", "UNAUTHORIZED", 401) };
  }
  return { session, error: null };
}

export function errorResponse(message, code, status = 400) {
  return NextResponse.json({ error: message, code }, { status });
}

export function successResponse(data, status = 200) {
  return NextResponse.json(data, { status });
}
