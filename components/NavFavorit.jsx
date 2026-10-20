"use client";

import Link from "next/link";
import { useFavorit } from "@/context/FavoritContext";

// US-24: Navigasi ke halaman Favorit dengan badge jumlah
export default function NavFavorit() {
  const { totalFavorit, sudahMuat } = useFavorit();

  return (
    <Link
      href="/favorit"
      className="relative inline-flex items-center gap-1.5 rounded-full border border-garis bg-permukaan px-3 py-1.5 text-xs font-semibold text-teks transition-colors hover:border-red-400 hover:text-red-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-red-500"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span>Favorit</span>
      {sudahMuat && totalFavorit > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
          {totalFavorit}
        </span>
      )}
    </Link>
  );
}
