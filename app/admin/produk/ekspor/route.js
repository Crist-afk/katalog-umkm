import { buatKoneksiAdmin } from "@/lib/supabase/admin";

// US-35: Ekspor produk ke CSV dengan proteksi login di server
export async function GET() {
  try {
    const supabase = await buatKoneksiAdmin();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response("Unauthorized: Anda harus login sebagai admin.", {
        status: 401,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const { data: produk, error: dbError } = await supabase
      .from("produk")
      .select("id, nama, harga, kategori, deskripsi, foto_url, created_at")
      .order("id", { ascending: true });

    if (dbError) {
      return new Response(`Error: ${dbError.message}`, { status: 500 });
    }

    // Fungsi bantu untuk escape karakter khusus CSV (koma, kutip dua, baris baru)
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return "";
      const val = String(str);
      if (val.includes(",") || val.includes('"') || val.includes("\n") || val.includes("\r")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const header = ["ID", "Nama Produk", "Harga", "Kategori", "Deskripsi", "Link Foto", "Waktu Dibuat"];
    const rows = (produk || []).map((p) => [
      escapeCsv(p.id),
      escapeCsv(p.nama),
      escapeCsv(p.harga),
      escapeCsv(p.kategori),
      escapeCsv(p.deskripsi),
      escapeCsv(p.foto_url),
      escapeCsv(p.created_at),
    ]);

    const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="daftar-produk.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
