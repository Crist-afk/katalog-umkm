"use client";

import Link from "next/link";
import { useBandingkan } from "@/context/BandingkanContext";

export default function NavBandingkan() {
  const { daftarBandingkan } = useBandingkan();
  const jumlah = daftarBandingkan.length;

  return (
    <Link
      href="/bandingkan"
      className="relative flex items-center gap-1.5 rounded-lg border border-garis bg-permukaan px-2.5 py-1.5 text-xs font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
      title="Bandingkan Produk"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
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
      <span className="hidden sm:inline">Bandingkan</span>
      {jumlah > 0 && (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-utama text-[10px] font-bold text-white">
          {jumlah}
        </span>
      )}
    </Link>
  );
}
