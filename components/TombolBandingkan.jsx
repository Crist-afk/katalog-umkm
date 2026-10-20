"use client";

import { useBandingkan } from "@/context/BandingkanContext";

export default function TombolBandingkan({ produk, varian = "ikon" }) {
  const { isBandingkan, toggleBandingkan } = useBandingkan();
  const aktif = isBandingkan(produk?.id);

  if (varian === "teks") {
    return (
      <button
        onClick={() => toggleBandingkan(produk)}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
          aktif
            ? "border-utama bg-utama/10 text-utama"
            : "border-garis bg-permukaan text-teks hover:border-utama hover:text-utama"
        }`}
        title={aktif ? "Hapus dari perbandingan" : "Bandingkan produk ini"}
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
        {aktif ? "Dibandingkan" : "Bandingkan"}
      </button>
    );
  }

  return (
    <button
      onClick={() => toggleBandingkan(produk)}
      aria-label={aktif ? "Hapus dari perbandingan" : "Bandingkan produk ini"}
      title={aktif ? "Hapus dari perbandingan" : "Bandingkan produk"}
      className={`flex h-8 w-8 items-center justify-center rounded-full border shadow-xs transition-transform active:scale-95 ${
        aktif
          ? "border-utama bg-utama text-white"
          : "border-garis bg-latar/90 text-teks-lembut hover:border-utama hover:text-utama backdrop-blur-xs"
      }`}
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
    </button>
  );
}
