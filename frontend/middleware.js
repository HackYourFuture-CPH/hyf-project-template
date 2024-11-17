import { NextResponse } from "next/server";
import { parseCookies } from "nookies";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const protectedRoutes = [
    "/dev-dashboard",
    "/client-dashboard",
  ];

  if (
    protectedRoutes.some((route) =>
      pathname.startsWith(route)
    )
  ) {
    // Get the cookies
    const cookies = parseCookies(req);
    const userToken = cookies.userToken;
    const userRole = cookies.userRole;

    if (!userToken) {
      return NextResponse.redirect("/login");
    }

    // redirect based on role to the correct dashboard if the role doesn't match
    if (
      pathname.startsWith("/dev-dashboard") &&
      userRole !== "developer"
    ) {
      return NextResponse.redirect("/client-dashboard");
    }

    if (
      pathname.startsWith("/client-dashboard") &&
      userRole !== "client"
    ) {
      return NextResponse.redirect("/dev-dashboard");
    }
  }

  return NextResponse.next();
}

// paths to be protected
export const config = {
  matcher: [
    "/dev-dashboard/:path*",
    "/client-dashboard/:path*",
  ],
};
