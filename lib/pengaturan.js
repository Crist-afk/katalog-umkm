/**
 * US-43: Pengaturan Toko dari Database dengan fallback ke lib/toko.js.
 * Digunakan di Server Component & Server Action.
 */
import { toko as tokoDefault } from "@/lib/toko";
import { buatKoneksiServer } from "@/lib/supabase/server";

export async function ambilPengaturanToko() {
  try {
    const supabase = buatKoneksiServer();
    const { data, error } = await supabase
      .from("pengaturan_toko")
      .select("nama, tagline, nomor_wa, alamat, jam_buka")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!error && data && data.nama) {
      return {
        nama: data.nama || tokoDefault.nama,
        tagline: data.tagline || tokoDefault.tagline,
        nomorWhatsApp: data.nomor_wa || tokoDefault.nomorWhatsApp,
        alamat: data.alamat || tokoDefault.alamat,
        jamBuka: data.jam_buka || tokoDefault.jamBuka,
      };
    }
  } catch {
    // Fallback ke lib/toko.js jika tabel belum ada atau koneksi gagal
  }

  return { ...tokoDefault };
}
