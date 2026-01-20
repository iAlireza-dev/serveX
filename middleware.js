import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret } from "@/app/lib/jwt/getJwtSecret";

const PUBLIC_PAGES = ["/login", "/signup"];
const ONBOARDING_PATH = "/onboarding";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1️⃣ Allow all API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  // 2️⃣ Public pages without auth
  if (!token) {
    if (PUBLIC_PAGES.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3️⃣ Verify JWT
  let payload;
  try {
    const { payload: verified } = await jwtVerify(token, getJwtSecret());
    payload = verified;
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = payload.role;

  // 4️⃣ No role → onboarding only
  if (!role) {
    if (pathname.startsWith(ONBOARDING_PATH)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(ONBOARDING_PATH, req.url));
  }

  // 5️⃣ Role-based access
  if (role === "CUSTOMER") {
    if (pathname.startsWith("/specialist")) {
      return NextResponse.redirect(new URL("/customer", req.url));
    }
  }

  if (role === "SPECIALIST") {
    if (pathname.startsWith("/customer")) {
      return NextResponse.redirect(new URL("/specialist", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
