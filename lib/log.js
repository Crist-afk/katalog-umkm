/**
 * US-45: Helper pencatatan log aktivitas admin.
 * Mencatat siapa, aksi apa, dan detail apa ke tabel log_aktivitas.
 */
import { buatKoneksiServer } from "@/lib/supabase/server";

export async function catatLogAktivitas(adminEmail, aksi, detail = "") {
  try {
    const supabase = buatKoneksiServer();
    await supabase.from("log_aktivitas").insert([
      {
        admin_email: adminEmail || "admin",
        aksi: String(aksi),
        detail: String(detail),
      },
    ]);
  } catch (err) {
    console.error("Gagal mencatat log aktivitas:", err);
  }
}
