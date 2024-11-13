import { NextResponse } from 'next/server';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export function middleware(req) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');

  const token = cookies.token;
  const pathname = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const decodedToken = jwt.decode(token);

    const userRole = decodedToken.role;

    if (pathname.startsWith('/dev-dashboard') && userRole !== 'Developer') {
      return NextResponse.redirect(new URL('/client-dashboard', req.url));
    }

    if (pathname.startsWith('/client-dashboard') && userRole !== 'Client') {
      return NextResponse.redirect(new URL('/dev-dashboard', req.url));
    }
  } catch (error) {
    console.error('JWT decoding failed:', error);
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dev-dashboard/:path*', '/client-dashboard/:path*'],
};
