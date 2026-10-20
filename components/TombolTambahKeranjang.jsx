"use client";

import { useState } from "react";
import { useKeranjang } from "@/context/KeranjangContext";

// US-21: Tombol Tambah ke Keranjang dengan feedback
export default function TombolTambahKeranjang({ produk, varian = "lebar" }) {
  const { tambahItem } = useKeranjang();
  const [ditambahkan, setDitambahkan] = useState(false);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    tambahItem(produk, 1);
    setDitambahkan(true);
    setTimeout(() => setDitambahkan(false), 2000);
  }

  if (varian === "kompak") {
    return (
      <button
        type="button"
        onClick={handleClick}
        title="Tambah ke keranjang"
        className={`inline-flex items-center justify-center rounded-xl p-2 text-xs font-semibold transition-all ${
          ditambahkan
            ? "bg-utama text-white scale-105"
            : "border border-garis bg-permukaan text-teks hover:border-utama hover:text-utama"
        }`}
      >
        {ditambahkan ? (
          <span className="flex items-center gap-1">✓ Ditambahkan</span>
        ) : (
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
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
            + Keranjang
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
        ditambahkan
          ? "bg-utama-gelap text-white scale-[1.01]"
          : "border-2 border-utama bg-latar text-utama hover:bg-permukaan"
      }`}
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
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      {ditambahkan ? "✓ Berhasil ditambahkan ke keranjang!" : "Tambah ke keranjang"}
    </button>
  );
}
