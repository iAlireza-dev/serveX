import { jwtVerify, SignJWT } from "jose";
import { prisma } from "@/app/lib/db/prisma";
import { NextResponse } from "next/server";
import { getJwtSecret } from "../(auth)/me/route";

export async function POST(req) {
  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let payload;
  try {
    const result = await jwtVerify(token, getJwtSecret());
    payload = result.payload;
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (user.role !== null) {
    return NextResponse.json({ error: "ROLE_ALREADY_SET" }, { status: 409 });
  }

  const body = await req.json();
  const { role } = body;

  if (role !== "CUSTOMER" && role !== "SPECIALIST") {
    return NextResponse.json({ error: "INVALID_ROLE" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role },
  });

  const newToken = await new SignJWT({
    sub: user.id,
    email: user.email,
    role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());

  const res = NextResponse.json({ success: true }, { status: 200 });

  res.cookies.set({
    name: "session",
    value: newToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return res;
}
