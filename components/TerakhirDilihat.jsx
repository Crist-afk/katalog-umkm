"use client";

import { useEffect, useState } from "react";
import KartuProduk from "@/components/KartuProduk";

const STORAGE_KEY = "katalog_umkm_terakhir_dilihat";
const MAX_ITEM = 4;

// US-36: Simpan produk yang sedang dilihat ke localStorage
export function CatatTerakhirDilihat({ produk }) {
  useEffect(() => {
    if (!produk || !produk.id) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let list = raw ? JSON.parse(raw) : [];

      // Hapus produk lama dengan id sama jika ada
      list = list.filter((item) => String(item.id) !== String(produk.id));

      // Taruh di urutan paling depan
      list.unshift({
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        foto_url: produk.foto_url,
        kategori: produk.kategori,
      });

      // Batasi maksimal jumlah item
      if (list.length > MAX_ITEM) {
        list = list.slice(0, MAX_ITEM);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Abaikan jika localStorage tidak tersedia (private browsing / disabled)
    }
  }, [produk]);

  return null;
}

// US-36: Tampilkan daftar produk terakhir dilihat di beranda
export function DaftarTerakhirDilihat() {
  const [produkList, setProdukList] = useState([]);
  const [sudahMuat, setSudahMuat] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProdukList(parsed);
        }
      }
    } catch {
      /* empty */
    } finally {
      setSudahMuat(true);
    }
  }, []);

  // Tidak muncul bila masih kosong atau belum dimuat di client
  if (!sudahMuat || produkList.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="judul-terakhir-dilihat" className="mt-8 border-t border-garis pt-8">
      <div className="flex items-center justify-between pb-4">
        <h2 id="judul-terakhir-dilihat" className="text-lg font-bold">
          Terakhir dilihat
        </h2>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.removeItem(STORAGE_KEY);
              setProdukList([]);
            } catch {
              /* empty */
            }
          }}
          className="text-xs text-teks-lembut hover:text-bahaya"
        >
          Hapus riwayat
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {produkList.map((p) => (
          <KartuProduk key={p.id} produk={p} />
        ))}
      </div>
    </section>
  );
}
