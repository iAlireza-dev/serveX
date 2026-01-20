import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret } from "@/app/lib/jwt/getJwtSecret";
import { cancelRequestByCustomer } from "@/app/lib/requests/cancel-by-customer.service";

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

  if (payload.role !== "CUSTOMER") {
    return NextResponse.json(
      { error: "ONLY_CUSTOMERS_CAN_CANCEL_REQUESTS" },
      { status: 403 },
    );
  }

  const { id: requestId } = await params;
  const customerId = payload.sub;

  try {
    const result = await cancelRequestByCustomer(requestId, customerId);

    return NextResponse.json(
      {
        id: result.id,
        status: result.status,
        updatedAt: result.updatedAt,
      },
      { status: 200 },
    );
  } catch (err) {
    if (err.message === "REQUEST_NOT_FOUND") {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }

    if (err.message === "UNAUTHORIZED_ACTION") {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }

    if (
      err.message === "CANNOT_CANCEL_COMPLETED_REQUEST" ||
      err.message === "INVALID_REQUEST_STATE"
    ) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
