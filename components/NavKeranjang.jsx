"use client";

import Link from "next/link";
import { useKeranjang } from "@/context/KeranjangContext";

// US-21: Indikator keranjang di navigasi atas
export default function NavKeranjang() {
  const { totalItem, sudahMuat } = useKeranjang();

  return (
    <Link
      href="/keranjang"
      className="relative inline-flex items-center gap-1.5 rounded-full border border-garis bg-permukaan px-3 py-1.5 text-xs font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      <span>Keranjang</span>
      {sudahMuat && totalItem > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-utama px-1 text-[11px] font-bold text-white">
          {totalItem}
        </span>
      )}
    </Link>
  );
}
