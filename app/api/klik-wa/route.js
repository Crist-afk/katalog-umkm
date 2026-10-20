/**
 * US-40: Route handler untuk mencatat klik tombol WhatsApp ke tabel klik_wa.
 * Tidak menyimpan data pribadi pengunjung, hanya ID produk dan waktu.
 */
import { NextResponse } from "next/server";
import { buatKoneksiServer } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      // jika pakai sendBeacon atau plain text
    }

    const produk_id = body?.produk_id;
    if (!produk_id) {
      return NextResponse.json({ error: "produk_id dibutuhkan" }, { status: 400 });
    }

    const supabase = buatKoneksiServer();
    const { error } = await supabase.from("klik_wa").insert([
      {
        produk_id: Number(produk_id),
      },
    ]);

    if (error) {
      // Jika tabel belum dibuat, jangan crash
      console.warn("Peringatan catat klik wa:", error.message);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error klik wa:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
