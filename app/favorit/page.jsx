"use client";

import Link from "next/link";
import { useFavorit } from "@/context/FavoritContext";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";

// US-24: Tampilan yang hanya berisi produk favorit
export default function HalamanFavorit() {
  const { daftarFavorit, sudahMuat } = useFavorit();

  if (!sudahMuat) {
    return (
      <div className="flex flex-col gap-6 py-12">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-permukaan" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-2xl bg-permukaan" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-8 sm:py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Produk Favorit</h1>
        <p className="text-sm text-teks-lembut">
          {daftarFavorit.length > 0
            ? `Kamu memiliki ${daftarFavorit.length} produk tersimpan di daftar favorit.`
            : "Tandai produk dengan ikon hati untuk menyimpannya di sini."}
        </p>
      </div>

      {daftarFavorit.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-garis bg-permukaan p-8">
          <p className="text-teks-lembut">Belum ada produk yang kamu tandai sebagai favorit.</p>
          <Tombol href="/">Jelajahi produk di katalog</Tombol>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {daftarFavorit.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}

      <Link
        href="/"
        className="self-start text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
      >
        ← Kembali ke katalog utama
      </Link>
    </div>
  );
}
