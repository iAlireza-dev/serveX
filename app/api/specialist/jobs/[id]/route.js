import { getJwtSecret } from "@/app/lib/jwt/getJwtSecret";
import { prisma } from "@/app/lib/db/prisma";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

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

  const job = await prisma.request.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      description: true,
      pricePerHour: true,
      status: true,
      specialistId: true,
      createdAt: true,
    },
  });

  if (!job) {
    return NextResponse.json({ error: "JOB_NOT_FOUND" }, { status: 404 });
  }

  if (job.specialistId && job.specialistId !== payload.sub) {
    return NextResponse.json(
      { error: "JOB_ALREADY_ASSIGNED" },
      { status: 409 },
    );
  }

  return NextResponse.json(job, { status: 200 });
}
