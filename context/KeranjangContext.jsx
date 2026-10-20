"use client";

import { createContext, useContext, useEffect, useState } from "react";

const KeranjangContext = createContext(null);
const STORAGE_KEY = "katalog_umkm_keranjang";

export function KeranjangProvider({ children }) {
  const [keranjang, setKeranjang] = useState([]);
  const [sudahMuat, setSudahMuat] = useState(false);

  // Ambil isi keranjang dari localStorage saat pertama kali dimuat di client
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          setKeranjang(data);
        }
      }
    } catch {
      /* abaikan error localStorage */
    } finally {
      setSudahMuat(true);
    }
  }, []);

  // Simpan setiap perubahan keranjang ke localStorage
  useEffect(() => {
    if (!sudahMuat) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keranjang));
    } catch {
      /* abaikan error localStorage */
    }
  }, [keranjang, sudahMuat]);

  function tambahItem(produk, jumlah = 1) {
    if (!produk || !produk.id) return;
    setKeranjang((prev) => {
      const index = prev.findIndex((item) => String(item.id) === String(produk.id));
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          jumlah: updated[index].jumlah + jumlah,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: produk.id,
          nama: produk.nama,
          harga: Number(produk.harga) || 0,
          foto_url: produk.foto_url || "",
          kategori: produk.kategori || "",
          jumlah: jumlah > 0 ? jumlah : 1,
        },
      ];
    });
  }

  function ubahJumlah(id, jumlahBaru) {
    const qty = parseInt(jumlahBaru, 10);
    if (isNaN(qty) || qty <= 0) {
      hapusItem(id);
      return;
    }
    setKeranjang((prev) =>
      prev.map((item) =>
        String(item.id) === String(id) ? { ...item, jumlah: qty } : item
      )
    );
  }

  function hapusItem(id) {
    setKeranjang((prev) => prev.filter((item) => String(item.id) !== String(id)));
  }

  function kosongkanKeranjang() {
    setKeranjang([]);
  }

  const totalItem = keranjang.reduce((acc, curr) => acc + (curr.jumlah || 0), 0);
  const totalHarga = keranjang.reduce(
    (acc, curr) => acc + (curr.harga || 0) * (curr.jumlah || 0),
    0
  );

  return (
    <KeranjangContext.Provider
      value={{
        keranjang,
        sudahMuat,
        tambahItem,
        ubahJumlah,
        hapusItem,
        kosongkanKeranjang,
        totalItem,
        totalHarga,
      }}
    >
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  const context = useContext(KeranjangContext);
  if (!context) {
    throw new Error("useKeranjang harus digunakan di dalam KeranjangProvider");
  }
  return context;
}
