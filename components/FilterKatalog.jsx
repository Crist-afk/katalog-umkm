"use client";

import { useRouter, usePathname } from "next/navigation";

// US-11 (Filter kategori & pencarian) & US-15 (Urutkan produk)
export default function FilterKatalog({
  daftarKategori = [],
  kategoriAktif = "",
  queryCari = "",
  urutanAktif = "terbaru",
}) {
  const router = useRouter();
  const pathname = usePathname();

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(window.location.search);
    const q = formData.get("q")?.toString().trim();

    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }

    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  function handleKategoriKlik(kat) {
    const params = new URLSearchParams(window.location.search);
    if (!kat || kat === "semua") {
      params.delete("kategori");
    } else {
      params.set("kategori", kat);
    }
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  function handleUrutanChange(e) {
    const params = new URLSearchParams(window.location.search);
    const val = e.target.value;
    if (val === "terbaru") {
      params.delete("urutan");
    } else {
      params.set("urutan", val);
    }
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  const adaFilter = Boolean(
    queryCari ||
      (kategoriAktif && kategoriAktif !== "semua") ||
      (urutanAktif && urutanAktif !== "terbaru")
  );

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <input
            type="search"
            name="q"
            defaultValue={queryCari}
            placeholder="Cari nama produk..."
            className="w-full rounded-xl border border-garis bg-permukaan px-4 py-2.5 text-sm text-teks placeholder-teks-lembut outline-none focus:border-utama focus:bg-latar"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            name="urutan"
            value={urutanAktif}
            onChange={handleUrutanChange}
            aria-label="Urutkan produk"
            className="rounded-xl border border-garis bg-permukaan px-3 py-2.5 text-sm text-teks outline-none focus:border-utama focus:bg-latar"
          >
            <option value="terbaru">Terbaru</option>
            <option value="termurah">Harga termurah</option>
            <option value="termahal">Harga termahal</option>
          </select>
          <button
            type="submit"
            className="rounded-xl bg-utama px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-utama-gelap"
          >
            Cari
          </button>
          {adaFilter && (
            <button
              type="button"
              onClick={() => router.push(pathname)}
              className="rounded-xl border border-garis bg-latar px-3 py-2.5 text-sm font-semibold text-teks-lembut hover:text-teks"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {daftarKategori.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleKategoriKlik("semua")}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
              !kategoriAktif || kategoriAktif === "semua"
                ? "bg-utama text-white"
                : "border border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
            }`}
          >
            Semua
          </button>
          {daftarKategori.map((kat) => (
            <button
              key={kat}
              type="button"
              onClick={() => handleKategoriKlik(kat)}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                kategoriAktif === kat
                  ? "bg-utama text-white"
                  : "border border-garis bg-permukaan text-teks-lembut hover:border-utama hover:text-utama"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
