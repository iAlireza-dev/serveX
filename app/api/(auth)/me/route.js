import { prisma } from "@/app/lib/db/prisma";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET_MISSING");
  return new TextEncoder().encode(secret);
};

export async function GET(req) {
  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let payload;

  try {
    const result = await jwtVerify(token, getJwtSecret());
    payload = result.payload;
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });

  if (!user) {
    return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}
