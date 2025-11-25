import crypto from "crypto";
import { NextResponse } from "next/server";

const SECRET = process.env.LEELA_PASSWORD ?? "campus-secret";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };

  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  if (password !== SECRET) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  return NextResponse.json({ token: crypto.randomUUID() });
}

