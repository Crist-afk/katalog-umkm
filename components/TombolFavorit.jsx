"use client";

import { useFavorit } from "@/context/FavoritContext";

// US-24: Tombol Favorit (Love)
export default function TombolFavorit({ produk, varian = "ikon" }) {
  const { apakahFavorit, toggleFavorit, sudahMuat } = useFavorit();
  const aktif = sudahMuat && apakahFavorit(produk.id);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorit(produk);
  }

  if (varian === "lebar") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
          aktif
            ? "border-red-500/30 bg-red-500/10 text-red-500"
            : "border-garis bg-permukaan text-teks hover:border-red-400 hover:text-red-500"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={aktif ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        {aktif ? "Tersimpan di favorit" : "Tambah ke favorit"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={aktif ? "Hapus dari favorit" : "Simpan ke favorit"}
      aria-label={aktif ? "Hapus dari favorit" : "Simpan ke favorit"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
        aktif
          ? "border-red-500/40 bg-latar text-red-500 shadow-sm"
          : "border-garis bg-latar/80 text-teks-lembut backdrop-blur-sm hover:border-red-400 hover:text-red-500"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={aktif ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}
