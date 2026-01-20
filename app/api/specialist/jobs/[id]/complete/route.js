import { getJwtSecret } from "@/app/lib/jwt/getJwtSecret";
import { completeJob } from "@/app/lib/specialist/complete-job.service";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
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

  const result = await completeJob({ jobId, specialistId });

  if (result.count === 0) {
    return NextResponse.json(
      { error: "JOB_NOT_FOUND_OR_ALREADY_COMPLETED" },
      { status: 409 },
    );
  }

  return NextResponse.json({ code: "JOB_COMPLETED" }, { status: 200 });
}
