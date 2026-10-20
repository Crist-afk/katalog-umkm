"use client";

/**
 * US-50: Komponen kotak tanya jawab AI di halaman detail produk.
 *
 * - Mengirim pertanyaan ke /api/tanya-produk (Route Handler di server).
 * - Panjang pertanyaan dibatasi 300 karakter di UI.
 * - Menampilkan pesan error yang jelas jika gagal.
 * - Tidak menyimpan state lintas halaman (cukup per kunjungan).
 */

import { useState, useRef, useEffect } from "react";

const MAKS_KARAKTER = 300;

export default function AsistenAI({ produk }) {
  const [terbuka, setTerbuka] = useState(false);
  const [pertanyaan, setPertanyaan] = useState("");
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [riwayat, loading]);

  async function handleKirim(e) {
    e.preventDefault();
    const teks = pertanyaan.trim();
    if (!teks || loading) return;

    setError("");
    setPertanyaan("");
    setRiwayat((prev) => [...prev, { peran: "user", teks }]);
    setLoading(true);

    try {
      const res = await fetch("/api/tanya-produk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pertanyaan: teks,
          produk: {
            nama: produk.nama,
            harga: produk.harga,
            kategori: produk.kategori,
            deskripsi: produk.deskripsi,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mendapatkan jawaban.");
        setRiwayat((prev) => [
          ...prev,
          {
            peran: "ai",
            teks: data.error || "Maaf, terjadi kesalahan.",
            isError: true,
          },
        ]);
      } else {
        setRiwayat((prev) => [...prev, { peran: "ai", teks: data.jawaban }]);
      }
    } catch {
      const pesanError =
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      setError(pesanError);
      setRiwayat((prev) => [
        ...prev,
        { peran: "ai", teks: pesanError, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!terbuka) {
    return (
      <button
        onClick={() => setTerbuka(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-garis bg-permukaan px-4 py-3 text-sm font-semibold text-teks transition-all duration-200 hover:border-utama hover:bg-utama/5 hover:text-utama"
        id="btn-asisten-ai"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a8 8 0 0 0-8 8c0 3.4 2.1 6.3 5 7.5V20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2.5c2.9-1.2 5-4.1 5-7.5a8 8 0 0 0-8-8Z" />
          <path d="M10 22h4" />
          <path d="M9 10h.01" />
          <path d="M15 10h.01" />
          <path d="M9.5 14a5 5 0 0 0 5 0" />
        </svg>
        Tanya AI tentang produk ini
      </button>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-garis bg-permukaan">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-garis bg-utama/5 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-utama text-xs text-white">
            AI
          </span>
          <span className="text-sm font-semibold text-teks">
            Asisten Produk
          </span>
        </div>
        <button
          onClick={() => setTerbuka(false)}
          className="rounded-md p-1 text-teks-lembut transition-colors hover:bg-garis hover:text-teks"
          aria-label="Tutup asisten AI"
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Riwayat chat */}
      <div
        ref={scrollRef}
        className="flex max-h-64 flex-col gap-2.5 overflow-y-auto p-4"
      >
        {/* Pesan pembuka */}
        {riwayat.length === 0 && !loading && (
          <p className="text-center text-xs text-teks-lembut">
            Tanyakan apa saja tentang{" "}
            <strong className="text-teks">{produk.nama}</strong> — harga, bahan,
            cara pesan, dan lainnya.
          </p>
        )}

        {riwayat.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
              msg.peran === "user"
                ? "ml-auto bg-utama text-white"
                : msg.isError
                  ? "mr-auto border border-bahaya/20 bg-bahaya/5 text-bahaya"
                  : "mr-auto bg-latar text-teks"
            }`}
          >
            {msg.teks}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="mr-auto flex items-center gap-1.5 rounded-xl bg-latar px-3.5 py-2.5 text-sm text-teks-lembut">
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-utama [animation-delay:0ms]" />
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-utama [animation-delay:150ms]" />
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-utama [animation-delay:300ms]" />
            <span className="ml-1">Sedang berpikir…</span>
          </div>
        )}
      </div>

      {/* Form input */}
      <form
        onSubmit={handleKirim}
        className="flex items-end gap-2 border-t border-garis p-3"
      >
        <div className="relative flex-1">
          <textarea
            value={pertanyaan}
            onChange={(e) => {
              if (e.target.value.length <= MAKS_KARAKTER) {
                setPertanyaan(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleKirim(e);
              }
            }}
            placeholder="Tulis pertanyaan..."
            rows={1}
            maxLength={MAKS_KARAKTER}
            disabled={loading}
            className="w-full resize-none rounded-lg border border-garis bg-latar px-3 py-2.5 text-sm text-teks placeholder:text-teks-lembut/60 focus:border-utama focus:outline-none disabled:opacity-50"
            id="input-tanya-ai"
          />
          <span className="absolute right-2 bottom-1 text-[10px] text-teks-lembut/50">
            {pertanyaan.length}/{MAKS_KARAKTER}
          </span>
        </div>
        <button
          type="submit"
          disabled={loading || !pertanyaan.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-utama text-white transition-colors hover:bg-utama-gelap disabled:opacity-40"
          aria-label="Kirim pertanyaan"
          id="btn-kirim-tanya-ai"
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
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        </button>
      </form>

      {/* Counter rate-limit hint */}
      {error && error.includes("Terlalu banyak") && (
        <p className="px-4 pb-2 text-xs text-bahaya">{error}</p>
      )}
    </div>
  );
}
