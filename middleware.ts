import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');

  if (!host) {
    // This should not happen in a real-world scenario
    return new Response('Bad request: host header is missing', { status: 400 });
  }

  // Use a configurable app domain, fallback to 'localhost' for local dev
  const appDomain = (process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost').toLowerCase();

  // Exclude specific paths from rewriting
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const strippedHost = host.toLowerCase().replace(/:\d+$/, '').replace(/^www\./, '');

  // Handle root domain (marketing)
  if (strippedHost === appDomain) {
    return NextResponse.next();
  }

  // Handle subdomains
  if (strippedHost.endsWith(`.${appDomain}`)) {
    const subdomain = strippedHost.substring(0, strippedHost.length - appDomain.length - 1);
    
    // Handle admin subdomain (platform)
    if (subdomain === 'admin') {
      return NextResponse.next();
    }
    
    // Rewrite for all other subdomains (tenants)
    url.pathname = `/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - static (public files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|static|favicon.ico).*)',
    ],
};

