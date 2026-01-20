import { getJwtSecret } from "@/app/lib/jwt/getJwtSecret";
import { cancelJobBySpecialist } from "@/app/lib/specialist/cancel-job.service";
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

  try {
    const result = await cancelJobBySpecialist(jobId, specialistId);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const code = err.message;

    if (code === "JOB_NOT_FOUND") {
      return NextResponse.json({ error: code }, { status: 404 });
    }

    if (
      code === "CANNOT_CANCEL_COMPLETED_JOB" ||
      code === "JOB_NOT_ASSIGNED" ||
      code === "NOT_JOB_OWNER"
    ) {
      return NextResponse.json({ error: code }, { status: 409 });
    }

    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
