import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DEPLOY_BASE_HOSTNAME } from "@/lib/config/deployment";

function getHostWithoutPort(host?: string | null) {
  if (!host) return "";
  return host.split(":")[0].toLowerCase();
}

export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host");
  const host = getHostWithoutPort(hostHeader);
  if (!host || host === DEPLOY_BASE_HOSTNAME) {
    return NextResponse.next();
  }

  if (host.endsWith(`.${DEPLOY_BASE_HOSTNAME}`)) {
    const subdomain = host.slice(0, -(DEPLOY_BASE_HOSTNAME.length + 1));
    if (subdomain) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = `/_sites/${subdomain}${request.nextUrl.pathname}`;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_static|_vercel|favicon.ico).*)"],
};
