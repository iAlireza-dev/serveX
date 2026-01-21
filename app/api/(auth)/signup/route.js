import { signupUser } from "@/app/lib/auth/signup.service";
import { signupLimiter } from "@/app/lib/rate-limit/auth.limiter";
import { SignupSchema } from "@/app/lib/validators/auth.schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";

  try {
    await signupLimiter.consume(ip);

    const body = await req.json();
    const data = SignupSchema.parse(body);
    const user = await signupUser(data);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error?.msBeforeNext) {
      return NextResponse.json({ error: "TOO_MANY_REQUESTS" }, { status: 429 });
    }

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }

    if (error.code === "EMAIL_ALREADY_EXISTS") {
      return NextResponse.json(
        { error: "EMAIL_ALREADY_EXISTS" },
        { status: 409 },
      );
    }

    console.error("SIGNUP ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
