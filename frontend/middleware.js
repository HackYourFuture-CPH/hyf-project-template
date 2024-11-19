import { NextResponse } from "next/server";
import cookie from "cookie";
import { checkURLMatchUserRole, getUserPathByRole } from "./app/utils/userUtil";

export async function middleware(req) {
  const getFieldFromCookie = field => {
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    return cookies[field];
  };

  const pathname = req.nextUrl.pathname;
  const userRole = getFieldFromCookie("userRole");

  if (pathname === "/") {
    return NextResponse.next();
  }

  if (!userRole) {
    if (pathname !== "/login" && pathname !== "/signup") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (userRole) {
    if (pathname === "/login" || pathname === "/signup") {
      const correctPath = getUserPathByRole(userRole);
      return NextResponse.redirect(new URL(correctPath, req.url));
    }

    try {
      checkURLMatchUserRole(pathname, userRole);
    } catch (error) {
      console.error("Access mismatch: ", error);
      const correctPath = getUserPathByRole(userRole);
      return NextResponse.redirect(new URL(correctPath, req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dev-dashboard/:path*", "/client-dashboard/:path*", "/login", "/signup", "/"],
};
