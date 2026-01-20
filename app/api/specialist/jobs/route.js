import { getOpenJobs } from "@/app/lib/specialist/get-open-jobs.service";
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

  const jobs = await getOpenJobs();

  return NextResponse.json(jobs, { status: 200 });
}
