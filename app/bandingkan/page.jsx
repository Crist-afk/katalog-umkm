"use client";

import Link from "next/link";
import { useBandingkan } from "@/context/BandingkanContext";
import { formatRupiah } from "@/lib/format";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolTambahKeranjang from "@/components/TombolTambahKeranjang";

export default function HalamanBandingkan() {
  const { daftarBandingkan, toggleBandingkan, hapusSemua } = useBandingkan();

  if (daftarBandingkan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-permukaan text-teks-lembut">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Bandingkan Produk</h1>
        <p className="mt-2 max-w-md text-teks-lembut">
          Belum ada produk yang dipilih untuk dibandingkan. Pilih 2 produk di katalog dengan tombol bandingkan.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-utama px-5 py-2.5 text-sm font-semibold text-white hover:bg-utama-gelap"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Bandingkan 2 Produk</h1>
          <p className="mt-1 text-sm text-teks-lembut">
            Menampilkan perbandingan spesifikasi dan harga secara berdampingan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={hapusSemua}
            className="rounded-lg border border-garis bg-permukaan px-3.5 py-2 text-xs font-semibold text-bahaya hover:border-bahaya"
          >
            Hapus Semua
          </button>
          <Link
            href="/"
            className="rounded-lg border border-garis bg-latar px-3.5 py-2 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
          >
            + Pilih Produk Lain
          </Link>
        </div>
      </div>

      {daftarBandingkan.length === 1 && (
        <div className="mb-6 rounded-xl border border-garis bg-permukaan p-4 text-sm text-teks-lembut">
          Pilih 1 produk lagi di katalog untuk melihat perbandingan berdampingan.
        </div>
      )}

      {/* Tabel Perbandingan Berdampingan (US-37) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {daftarBandingkan.map((p, idx) => (
          <div
            key={p.id}
            className="flex flex-col rounded-2xl border border-garis bg-latar p-5 shadow-xs"
          >
            <div className="relative mb-4">
              <img
                src={p.foto_url}
                alt={p.nama}
                className="aspect-square w-full rounded-xl bg-permukaan object-cover"
              />
              <button
                onClick={() => toggleBandingkan(p)}
                className="absolute top-2 right-2 rounded-full bg-latar/80 p-1.5 text-xs text-bahaya shadow-xs backdrop-blur-xs hover:bg-latar"
                title="Hapus dari perbandingan"
              >
                ✕ Hapus
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <div>
                <span className="inline-block rounded-md bg-permukaan px-2 py-0.5 text-xs font-medium text-teks-lembut">
                  {p.kategori}
                </span>
                <h2 className="mt-1 text-xl font-bold leading-snug">
                  <Link href={`/produk/${p.id}`} className="hover:text-utama">
                    {p.nama}
                  </Link>
                </h2>
              </div>

              <div className="rounded-lg bg-harga-latar p-3">
                <span className="text-xs text-teks-lembut">Harga:</span>
                <p className="text-2xl font-extrabold text-harga">
                  {formatRupiah(p.harga)}
                </p>
                {p.harga_coret && p.harga_coret > p.harga && (
                  <p className="text-xs text-teks-lembut line-through">
                    {formatRupiah(p.harga_coret)}
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-garis bg-permukaan p-3">
                <p className="text-xs font-semibold text-teks-lembut">Deskripsi:</p>
                <p className="mt-1 text-sm leading-relaxed text-teks">
                  {p.deskripsi || "Tidak ada deskripsi."}
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-2 pt-4">
                <TombolWhatsApp produk={p} />
                <TombolTambahKeranjang produk={p} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
