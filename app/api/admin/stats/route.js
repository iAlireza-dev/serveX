import { prisma } from "@/app/lib/db/prisma";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
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
      { error: "ONLY_ADMIN_CAN_ACCESS_STATS" },
      { status: 403 },
    );
  }

  const [totalUsers, totalSpecialists, totalRequests] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "SPECIALIST" } }),
    prisma.request.count(),
  ]);

  return NextResponse.json(
    {
      totalUsers,
      totalSpecialists,
      totalRequests,
    },
    { status: 200 },
  );
}
