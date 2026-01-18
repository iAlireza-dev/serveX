import { loginUser } from "@/app/lib/auth/login.service";
import { SignupSchema } from "@/app/lib/validators/auth.schema";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return new TextEncoder().encode(secret);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const data = SignupSchema.parse(body);
    const user = await loginUser(data);

    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getJwtSecret());

    const res = NextResponse.json(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      { status: 200 },
    );

    res.cookies.set({
      name: "session",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json({ message: "INVALID_INPUT" }, { status: 400 });
    }

    if (error.code === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        { message: "INVALID_CREDENTIALS" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { message: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
