import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { getJwtSecret } from "@/app/lib/jwt/getJwtSecret";
import { prisma } from "@/app/lib/db/prisma";

export async function GET(req) {
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

  if (payload.role !== "SPECIALIST") {
    return NextResponse.json(
      { message: "ONLY_SPECIALISTS_CAN_ACCESS_JOBS" },
      { status: 403 },
    );
  }

  const userId = payload.sub;

  const myJobs = await prisma.request.findMany({
    where: { specialistId: userId },

    select: {
      id: true,
      title: true,
      pricePerHour: true,
      status: true,
      createdAt: true,
      customerId: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(myJobs, { status: 200 });
}
