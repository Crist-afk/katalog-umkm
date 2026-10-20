import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Route protection proxy (pengganti middleware.js di Next.js 16).
 * Memproteksi seluruh rute /admin agar hanya bisa diakses setelah login.
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Izinkan akses ke halaman login admin tanpa autentikasi
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const rawUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!rawUrl || !publishableKey) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  let supabaseUrl = rawUrl.trim().replace(/\/+$/, "");
  if (supabaseUrl.endsWith("/rest/v1")) {
    supabaseUrl = supabaseUrl.slice(0, -"/rest/v1".length).replace(/\/+$/, "");
  }

  const supabase = createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Verifikasi apakah admin sudah login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const middleware = proxy;
export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};
