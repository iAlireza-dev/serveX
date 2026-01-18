import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret } from "./app/api/(auth)/me/route";

const PUBLIC_ROUTES = ["/login", "/signup"];
const CUSTOMER_ROUTES = ["/dashboard", "/requests"];
const SPECIALIST_ROUTES = ["/jobs"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("session")?.value;

  if (!token) {
    if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  let payload;
  try {
    const result = await jwtVerify(token, getJwtSecret());
    payload = result.payload;
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = payload.role;

  if (!role) {
    if (pathname.startsWith("/onboarding")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (role === "CUSTOMER") {
    if (SPECIALIST_ROUTES.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (role === "SPECIALIST") {
    if (CUSTOMER_ROUTES.some((r) => pathname.startsWith(r))) {
      return NextResponse.redirect(new URL("/jobs", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
