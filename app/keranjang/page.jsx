"use client";

import Link from "next/link";
import { useKeranjang } from "@/context/KeranjangContext";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";
import Tombol from "@/components/Tombol";

// US-21: Keranjang belanja & pesan semua via WhatsApp
export default function HalamanKeranjang() {
  const {
    keranjang,
    sudahMuat,
    ubahJumlah,
    hapusItem,
    kosongkanKeranjang,
    totalItem,
    totalHarga,
  } = useKeranjang();

  if (!sudahMuat) {
    return (
      <div className="flex flex-col gap-6 py-12">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-permukaan" />
        <div className="h-40 w-full animate-pulse rounded-2xl bg-permukaan" />
      </div>
    );
  }

  if (keranjang.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight">Keranjang Belanja</h1>
        <p className="text-teks-lembut">Keranjang belanja kamu masih kosong.</p>
        <Tombol href="/">Mulai belanja di katalog</Tombol>
      </div>
    );
  }

  // Buat isi pesan otomatis WhatsApp untuk seluruh item keranjang (US-21)
  const daftarItemTeks = keranjang
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.nama} (${item.jumlah}x @ ${formatRupiah(item.harga)}) = ${formatRupiah(
          item.harga * item.jumlah
        )}`
    )
    .join("\n");

  const pesanWhatsApp = `Halo ${toko.nama}, saya ingin memesan produk berikut:\n\n${daftarItemTeks}\n\nTotal Pembayaran: ${formatRupiah(
    totalHarga
  )}\n\nMohon info ketersediaan dan proses pembayarannya. Terima kasih!`;

  const linkWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(
    pesanWhatsApp
  )}`;

  return (
    <div className="flex flex-col gap-8 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Keranjang Belanja</h1>
          <p className="text-sm text-teks-lembut">
            Total {totalItem} barang siap dipesan
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Kosongkan semua isi keranjang?")) {
              kosongkanKeranjang();
            }
          }}
          className="text-xs font-semibold text-teks-lembut hover:text-bahaya"
        >
          Kosongkan keranjang
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Daftar item */}
        <div className="flex flex-col divide-y divide-garis rounded-2xl border border-garis bg-latar lg:col-span-2">
          {keranjang.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.foto_url}
                  alt={item.nama}
                  className="h-16 w-16 rounded-xl border border-garis bg-permukaan object-cover"
                />
                <div className="flex flex-col">
                  <Link
                    href={`/produk/${item.id}`}
                    className="font-bold text-teks hover:text-utama"
                  >
                    {item.nama}
                  </Link>
                  <p className="text-xs text-teks-lembut">{item.kategori}</p>
                  <p className="mt-1 text-sm font-semibold text-harga">
                    {formatRupiah(item.harga)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                {/* Kontrol jumlah (- / input / +) */}
                <div className="flex items-center rounded-lg border border-garis bg-permukaan">
                  <button
                    type="button"
                    onClick={() => ubahJumlah(item.id, item.jumlah - 1)}
                    aria-label="Kurangi jumlah"
                    className="flex h-8 w-8 items-center justify-center font-bold text-teks hover:bg-garis"
                  >
                    −
                  </button>
                  <span className="flex h-8 w-10 items-center justify-center text-sm font-bold">
                    {item.jumlah}
                  </span>
                  <button
                    type="button"
                    onClick={() => ubahJumlah(item.id, item.jumlah + 1)}
                    aria-label="Tambah jumlah"
                    className="flex h-8 w-8 items-center justify-center font-bold text-teks hover:bg-garis"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <span className="min-w-24 text-right text-sm font-bold">
                  {formatRupiah(item.harga * item.jumlah)}
                </span>

                {/* Tombol Hapus */}
                <button
                  type="button"
                  onClick={() => hapusItem(item.id)}
                  title="Hapus item"
                  className="text-xs text-bahaya hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Ringkasan & Tombol Pesan WA */}
        <div className="flex flex-col gap-5 rounded-2xl border border-garis bg-permukaan p-6 h-fit">
          <h2 className="text-lg font-bold">Ringkasan Pesanan</h2>

          <div className="flex flex-col gap-2 border-b border-garis pb-4 text-sm text-teks-lembut">
            <div className="flex justify-between">
              <span>Total item</span>
              <span className="font-semibold text-teks">{totalItem} pcs</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold">Total Harga</span>
            <span className="text-2xl font-extrabold text-harga">
              {formatRupiah(totalHarga)}
            </span>
          </div>

          <a
            href={linkWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-utama px-4 py-3.5 text-center font-bold text-white shadow-sm transition-colors hover:bg-utama-gelap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            Pesan Semua via WhatsApp
          </a>

          <Link
            href="/"
            className="text-center text-xs text-teks-lembut underline underline-offset-4 hover:text-utama"
          >
            ← Lanjut belanja produk lain
          </Link>
        </div>
      </div>
    </div>
  );
}
