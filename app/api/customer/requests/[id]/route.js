import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
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

  if (payload.role !== "CUSTOMER") {
    return NextResponse.json(
      { error: "ONLY_CUSTOMERS_ALLOWED" },
      { status: 403 },
    );
  }

  const { id: requestId } = await params;

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      title: true,
      description: true,
      pricePerHour: true,
      status: true,
      specialistId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!request) {
    return NextResponse.json({ error: "REQUEST_NOT_FOUND" }, { status: 404 });
  }

  if (request.customerId && request.customerId !== payload.sub) {
    return NextResponse.json({ error: "NOT_REQUEST_OWNER" }, { status: 403 });
  }

  return NextResponse.json(request, { status: 200 });
}
