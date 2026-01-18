import { NextResponse } from "next/server";
import { SignupSchema } from "../../../lib/validators/auth.schema.js";
import { signupUser } from "../../../lib/auth/signup.service.js";

export async function POST(req) {
  try {
    const body = await req.json();
    const data = SignupSchema.parse(body);
    const user = await signupUser(data);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }

    if (error.code === "EMAIL_ALREADY_EXISTS") {
      return NextResponse.json(
        { error: "EMAIL_ALREADY_EXISTS" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
