import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db/prisma";
import { getJwtSecret } from "@/app/lib/jwt/getJwtSecret";

export async function GET(req, { params }) {
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

  if (payload.role !== "SPECIALIST") {
    return NextResponse.json(
      { error: "ONLY_SPECIALISTS_CAN_ACCESS_JOBS" },
      { status: 403 },
    );
  }

  const { id: jobId } = await params;
  const specialistId = payload.sub;

  const job = await prisma.request.findFirst({
    where: {
      id: jobId,
      specialistId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      pricePerHour: true,
      status: true,
      createdAt: true,
    },
  });

  if (!job) {
    return NextResponse.json({ error: "JOB_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(job, { status: 200 });
}
