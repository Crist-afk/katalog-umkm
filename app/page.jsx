import KartuProduk from "@/components/KartuProduk";
import FilterKatalog from "@/components/FilterKatalog";
import { DaftarTerakhirDilihat } from "@/components/TerakhirDilihat";
import { toko } from "@/lib/toko";
import { buatKoneksiServer } from "@/lib/supabase/server";

// US-01 (Katalog), US-11 (Filter & Cari), US-15 (Urutkan)
export default async function HalamanKatalog({ searchParams }) {
  const { q = "", kategori = "", urutan = "terbaru" } = (await searchParams) || {};

  let daftarProduk = [];
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = buatKoneksiServer();

    // Ambil semua kategori unik dari database
    const { data: katData } = await supabase.from("produk").select("kategori");
    if (katData) {
      const kategoriSet = new Set(katData.map((p) => p.kategori).filter(Boolean));
      daftarKategori = Array.from(kategoriSet).sort();
    }

    // Bangun query sesuai filter dan urutan (US-11 & US-15)
    let query = supabase
      .from("produk")
      .select("id, nama, harga, deskripsi, foto_url, kategori, created_at");

    if (q) {
      query = query.ilike("nama", `%${q}%`);
    }

    if (kategori && kategori !== "semua") {
      query = query.eq("kategori", kategori);
    }

    if (urutan === "termurah") {
      query = query.order("harga", { ascending: true });
    } else if (urutan === "termahal") {
      query = query.order("harga", { ascending: false });
    } else {
      query = query.order("id", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      pesanError = `Gagal memuat produk: ${error.message}`;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan saat memuat data produk.";
  }

  const adaFilter = Boolean(q || (kategori && kategori !== "semua") || (urutan && urutan !== "terbaru"));

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>
          <FilterKatalog
            daftarKategori={daftarKategori}
            kategoriAktif={kategori}
            queryCari={q}
            urutanAktif={urutan}
          />
        </div>

        {pesanError ? (
          <div className="rounded-xl border border-bahaya/20 bg-permukaan p-4 text-bahaya">
            <p className="font-semibold">Terjadi kesalahan</p>
            <p className="mt-1 text-sm">{pesanError}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="py-8 text-center text-teks-lembut">
            {adaFilter ? "Tidak ada produk yang cocok dengan pencarian / filter ini." : "Belum ada produk."}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>

      <DaftarTerakhirDilihat />
    </>
  );
}

