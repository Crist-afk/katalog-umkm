import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat client Supabase sisi server dengan sesi admin memakai @supabase/ssr.
 * Menggunakan SUPABASE_PUBLISHABLE_KEY dan cookie browser untuk autentikasi.
 */
export async function buatKoneksiAdmin() {
  const cookieStore = await cookies();

  const rawUrl = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!rawUrl || !publishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  // Normalisasi URL jika ada trailing slash atau akhiran /rest/v1
  let supabaseUrl = rawUrl.trim().replace(/\/+$/, "");
  if (supabaseUrl.endsWith("/rest/v1")) {
    supabaseUrl = supabaseUrl.slice(0, -"/rest/v1".length).replace(/\/+$/, "");
  }

  return createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Abaikan jika dipanggil dari Server Component
        }
      },
    },
  });
}
