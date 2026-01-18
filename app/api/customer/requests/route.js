import { jwtVerify } from "jose";
import { getJwtSecret } from "../../(auth)/me/route";
import { createRequestSchema } from "@/app/lib/validators/requests.schema";
import { createRequest } from "@/app/lib/requests/create-request.service";
import { NextResponse } from "next/server";
import { id } from "zod/locales";

////////////////////////////////////////////POST METHOD

export async function POST(req) {
  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  }

  let payload;

  try {
    const result = await jwtVerify(token, getJwtSecret());
    payload = result.payload;
  } catch {
    return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  }

  if (payload.role !== "CUSTOMER") {
    return NextResponse.json(
      { message: "ONLY_CUSTOMERS_CAN_CREATE_REQUESTS" },
      { status: 403 },
    );
  }

  let data;
  try {
    const body = await req.json();
    data = createRequestSchema.parse(body);
  } catch {
    return NextResponse.json({ message: "INVALID_INPUT" }, { status: 400 });
  }

  const request = await createRequest({
    userId: payload.sub,
    title: data.title,
    description: data.description,
    pricePerHour: data.pricePerHour,
  });

  return NextResponse.json(request, { status: 201 });
}

////////////////////////////////////////////GET METHOD

export async function GET(req) {
  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  }

  let payload;

  try {
    const result = await jwtVerify(token, getJwtSecret());
    payload = result.payload;
  } catch {
    return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
  }

  if (payload.role !== "CUSTOMER") {
    return NextResponse.json(
      { message: "ONLY_CUSTOMERS_CAN_ACCESS_REQUESTS" },
      { status: 403 },
    );
  }

  const requests = await prisma.request.findMany({
    where: { customerId: payload.sub },

    select: {
      id: true,
      title: true,
      pricePerHour: true,
      status: true,
      createdAt: true,
    },

    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(requests, { status: 200 });
}
