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
      { error: "ONLY_ADMIN_CAN_ACCESS_REQUESTS" },
      { status: 403 },
    );
  }

  const requests = await prisma.request.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      pricePerHour: true,
      status: true,
      createdAt: true,
      customer: {
        select: {
          email: true,
        },
      },
      specialist: {
        select: {
          email: true,
        },
      },
    },
  });

  return NextResponse.json(requests, { status: 200 });
}
