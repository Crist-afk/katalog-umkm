"use client";

import { hapusProduk } from "@/app/admin/actions";

// Tombol hapus dengan konfirmasi — US-10
export default function TombolHapus({ idProduk, namaProduk }) {
  async function handleHapus() {
    const konfirmasi = window.confirm(
      `Hapus produk "${namaProduk}"? Tindakan ini tidak bisa dibatalkan.`
    );
    if (!konfirmasi) return;
    await hapusProduk(idProduk);
  }

  return (
    <button
      type="button"
      onClick={handleHapus}
      className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-bahaya transition-colors hover:border-bahaya"
    >
      Hapus
    </button>
  );
}
