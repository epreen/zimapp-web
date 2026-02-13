import { NextRequest, NextResponse } from "next/server";
import { verifySessionCookie } from "@/lib/firebase-admin";
import { getSanityUserByFirebaseId } from "@/lib/firebase-admin";
import { Roles } from "@/lib/tier-config";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/api/payment",
  "/admin",
];

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
}

function isAdminRoute(pathname: string) {
  return pathname.startsWith("/admin");
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    // 1. Verify Firebase session
    const decoded = await verifySessionCookie(sessionCookie);
    const firebaseUid = decoded.uid;

    // 2. Fetch Sanity user
    const sanityUser = await getSanityUserByFirebaseId(firebaseUid);

    if (!sanityUser) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const role = sanityUser.role as Roles | undefined;

    // 3. Admin gate
    if (isAdminRoute(pathname) && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/payment/:path*",
  ],
};