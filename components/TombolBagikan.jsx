"use client";

import { useState } from "react";

// US-23: Bagikan atau salin link produk dengan umpan balik
export default function TombolBagikan({ judul, teks }) {
  const [pesan, setPesan] = useState("");

  async function handleBagikan() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: judul,
          text: teks,
          url: url,
        });
        setPesan("Berhasil dibagikan!");
        setTimeout(() => setPesan(""), 2500);
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setPesan("Link tersalin!");
        setTimeout(() => setPesan(""), 2500);
      }
    } catch {
      setPesan("Gagal menyalin link");
      setTimeout(() => setPesan(""), 2500);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleBagikan}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-garis bg-permukaan px-4 py-3 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        Bagikan produk
      </button>
      {pesan && (
        <span className="text-center text-xs font-semibold text-utama animate-pulse">
          ✓ {pesan}
        </span>
      )}
    </div>
  );
}
