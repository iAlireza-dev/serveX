import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/app/lib/db/prisma";
import { getJwtSecret } from "@/app/lib/jwt/getJwtSecret";

export async function GET(req) {
  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let payload;
  try {
    const { payload: verified } = await jwtVerify(token, getJwtSecret());
    payload = verified;
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (payload.role !== "ADMIN") {
    return NextResponse.json(
      { error: "ONLY_ADMIN_CAN_ACCESS_USERS" },
      { status: 403 },
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          customerRequests: true,
          assignedRequests: true,
        },
      },
    },
  });

  return NextResponse.json(users, { status: 200 });
}
