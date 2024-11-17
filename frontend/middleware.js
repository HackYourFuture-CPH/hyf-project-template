import { NextResponse } from 'next/server';
import cookie from 'cookie';
import { checkURLMatchUserRole } from './app/utils/userUtil';

export async function middleware(req) {
  const getFieldFromCookie = field => {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    return cookies[field];
  };
  const pathname = req.nextUrl.pathname;

  try {
    checkURLMatchUserRole(pathname, getFieldFromCookie('userRole'));
  } catch (error) {
    console.error('match URL failed ', error);
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dev-dashboard/:path*', '/client-dashboard/:path*'],
};
