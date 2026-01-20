import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret } from "@/app/lib/jwt/getJwtSecret";
import { updateRequestByCustomer } from "@/app/lib/requests/updateRequestByCustomer.service";

export async function PATCH(req, { params }) {
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
      { error: "ONLY_CUSTOMERS_CAN_EDIT_REQUESTS" },
      { status: 403 },
    );
  }

  const { id: requestId } = await params;
  const customerId = payload.sub;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON_BODY" }, { status: 400 });
  }

  const { title, description, pricePerHour } = body;

  if (!title || !description || typeof pricePerHour !== "number") {
    return NextResponse.json(
      { error: "INVALID_REQUEST_DATA" },
      { status: 400 },
    );
  }

  try {
    const updatedRequest = await updateRequestByCustomer(
      requestId,
      customerId,
      { title, description, pricePerHour },
    );

    return NextResponse.json(updatedRequest, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "REQUEST_UPDATE_FAILED" },
      { status: 400 },
    );
  }
}