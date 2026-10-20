import { createClient } from "@supabase/supabase-js";

/**
 * Membuat client Supabase sisi server dengan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca data publik (seperti katalog & detail produk)
 * yang melewati RLS tanpa mengekspos kunci ke browser.
 */
export function buatKoneksiServer() {
  const rawUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!rawUrl || !secretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  // Normalisasi URL jika pengguna tidak sengaja menyalin URL lengkap REST API atau ada trailing slash
  let supabaseUrl = rawUrl.trim().replace(/\/+$/, "");
  if (supabaseUrl.endsWith("/rest/v1")) {
    supabaseUrl = supabaseUrl.slice(0, -"/rest/v1".length).replace(/\/+$/, "");
  }

  return createClient(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
