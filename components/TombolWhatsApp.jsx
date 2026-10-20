"use client";

import { toko as tokoDefault } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

/**
 * US-03: Pesan via WhatsApp
 * US-19: Status stok – nonaktifkan tombol jika stok habis
 * US-40: Catat klik pesan WhatsApp ke database via route handler
 * US-48: Dukungan nama varian dan harga terpilih
 */
export default function TombolWhatsApp({
  produk,
  nomorWhatsApp,
  varianTerpilih = null,
  jumlah = 1,
  className = "",
}) {
  if (!produk) return null;

  const stokHabis = produk.stok === 0;

  // Catat klik ke server tanpa menghambat navigasi (US-40)
  const tanganiKlik = () => {
    if (stokHabis) return;
    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/klik-wa",
          JSON.stringify({ produk_id: produk.id })
        );
      } else {
        fetch("/api/klik-wa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ produk_id: produk.id }),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // ignore
    }
  };

  if (stokHabis) {
    return (
      <button
        disabled
        className={`inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-garis px-5 py-3 font-semibold text-teks-lembut sm:w-auto ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        Stok Habis
      </button>
    );
  }

  const nomor = (nomorWhatsApp || tokoDefault.nomorWhatsApp || "").replace(
    /[^0-9]/g,
    ""
  );

  const hargaDipakai = varianTerpilih?.harga ?? produk.harga;
  const teksVarian = varianTerpilih ? ` (Varian: ${varianTerpilih.nama})` : "";
  const teksJumlah = jumlah > 1 ? ` sebanyak ${jumlah} buah` : "";

  const pesan = `Halo, saya ingin memesan ${produk.nama}${teksVarian}${teksJumlah} seharga ${formatRupiah(
    hargaDipakai * jumlah
  )}.`;

  const linkWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(
    pesan
  )}`;

  return (
    <a
      href={linkWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      onClick={tanganiKlik}
      className={`inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap sm:w-auto ${className}`}
    >
      <svg
        className="mr-2 h-5 w-5 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.778.978-.954 1.179-.176.2-.351.226-.652.075s-1.272-.469-2.424-1.496c-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.101-.2.05-.376-.025-.527-.075-.15-.678-1.631-.929-2.233-.244-.587-.492-.507-.678-.517-.176-.01-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.508 1.079 2.909 1.229 3.109c.15.2 2.124 3.243 5.145 4.549.719.311 1.28.497 1.718.636.722.23 1.378.197 1.897.12.578-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.126-.276-.201-.577-.352z" />
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.819.487 3.525 1.338 4.99L2 22l5.176-1.309A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.574 0-3.048-.445-4.309-1.218l-.309-.188-3.076.778.82-2.997-.206-.328A8.204 8.204 0 013.75 12c0-4.549 3.701-8.25 8.25-8.25s8.25 3.701 8.25 8.25-3.701 8.25-8.25 8.25z" />
      </svg>
      Pesan via WhatsApp
    </a>
  );
}
