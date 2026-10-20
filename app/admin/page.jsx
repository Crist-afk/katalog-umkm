import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatKoneksiServer } from "@/lib/supabase/server";

// US-07: daftar produk dari database
// US-30: ringkasan admin (total produk & produk per kategori)
// US-35: tombol ekspor CSV
export default async function HalamanAdmin() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = buatKoneksiServer();
    const { data, error } = await supabase
      .from("produk")
      .select("id, nama, harga, foto_url, kategori")
      .order("id", { ascending: true });
    if (error) pesanError = error.message;
    else daftarProduk = data || [];
  } catch (err) {
    pesanError = err.message;
  }

  // Hitung ringkasan kategori (US-30)
  const totalProduk = daftarProduk.length;
  const perKategori = {};
  for (const p of daftarProduk) {
    const kat = p.kategori || "Tanpa Kategori";
    perKategori[kat] = (perKategori[kat] || 0) + 1;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      {/* Ringkasan Dashboard (US-30) */}
      <section aria-labelledby="judul-ringkasan" className="flex flex-col gap-3">
        <h2 id="judul-ringkasan" className="text-xs font-bold uppercase tracking-wider text-teks-lembut">
          Ringkasan Toko
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-garis bg-permukaan p-4">
            <p className="text-xs font-semibold text-teks-lembut">Total Produk</p>
            <p className="mt-1 text-2xl font-extrabold text-utama">{totalProduk}</p>
          </div>
          {Object.entries(perKategori).map(([kat, jml]) => (
            <div key={kat} className="rounded-2xl border border-garis bg-permukaan p-4">
              <p className="truncate text-xs font-semibold text-teks-lembut">{kat}</p>
              <p className="mt-1 text-2xl font-extrabold text-teks">
                {jml} <span className="text-xs font-normal text-teks-lembut">produk</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Daftar Produk</h1>
        <div className="flex items-center gap-2">
          <a
            href="/admin/produk/ekspor"
            className="inline-flex items-center justify-center rounded-xl border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
          >
            Ekspor CSV
          </a>
          <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
        </div>
      </div>
      {pesanError && (
        <div className="rounded-xl border border-bahaya/20 bg-permukaan p-4 text-sm text-bahaya">
          Gagal memuat produk: {pesanError}
        </div>
      )}
      <TabelProduk daftarProduk={daftarProduk} />
    </div>
  );
}


