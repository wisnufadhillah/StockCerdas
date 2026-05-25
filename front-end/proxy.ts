import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("stockcerdas_session")?.value;
  const loginUrl = new URL("/login", request.url);

  if (!sessionCookie) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie)) as { role?: string };
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith("/dashboard/superadmin") && session.role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard/useradmin", request.url));
    }

    if (pathname.startsWith("/dashboard/useradmin") && session.role !== "useradmin") {
      return NextResponse.redirect(new URL("/dashboard/superadmin", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
