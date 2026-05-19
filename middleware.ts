import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { validateEnv, getSupabaseUrl, getSupabaseAnonKey } from "@/lib/env";

export async function middleware(request: NextRequest) {
  // ── Env-var health check ─────────────────────────────────────────
  // If required vars are missing, return a clear error page instead
  // of crashing the entire app with an opaque 500.
  const envCheck = validateEnv();
  if (!envCheck.ok) {
    const message =
      `Missing environment variable(s): ${envCheck.missing.join(", ")}. ` +
      `Set them in .env.local (local dev) or Vercel project settings (production).`;
    console.error(`[LegalEagle] ${message}`);

    return new NextResponse(
      `<!DOCTYPE html>
<html><head><title>Configuration Error</title></head>
<body style="font-family:system-ui;padding:3rem;max-width:640px;margin:auto">
  <h1 style="color:#dc2626">⚠ Environment Configuration Error</h1>
  <p>${message}</p>
  <p>See <a href="https://supabase.com/dashboard/project/_/settings/api">Supabase API Settings</a>.</p>
</body></html>`,
      {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      },
    );
  }

  // Create a response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          // Rebuild the response so it carries the updated request cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Re-apply every cookie to the *new* response so the browser
          // actually receives the refreshed auth tokens.
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh session if needed - this is important for auth state
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected and auth routes
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isCompareRoute = request.nextUrl.pathname.startsWith("/compare");
  const isLoginRoute = request.nextUrl.pathname.startsWith("/login");
  const isPublicRoute =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/public");

  // Protect dashboard and compare routes
  if (!user && (isDashboardRoute || isCompareRoute)) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from login
  if (user && isLoginRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
