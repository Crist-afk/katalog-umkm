"use client";

import { createContext, useContext, useEffect, useState } from "react";

const FavoritContext = createContext(null);
const STORAGE_KEY = "katalog_umkm_favorit";

// US-24: Penyimpanan produk favorit di browser (localStorage)
export function FavoritProvider({ children }) {
  const [daftarFavorit, setDaftarFavorit] = useState([]);
  const [sudahMuat, setSudahMuat] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setDaftarFavorit(parsed);
        }
      }
    } catch {
      /* abaikan error parsing */
    } finally {
      setSudahMuat(true);
    }
  }, []);

  useEffect(() => {
    if (!sudahMuat) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarFavorit));
    } catch {
      /* abaikan error localStorage */
    }
  }, [daftarFavorit, sudahMuat]);

  function apakahFavorit(id) {
    return daftarFavorit.some((item) => String(item.id) === String(id));
  }

  function toggleFavorit(produk) {
    if (!produk || !produk.id) return;

    setDaftarFavorit((prev) => {
      const ada = prev.some((item) => String(item.id) === String(produk.id));
      if (ada) {
        return prev.filter((item) => String(item.id) !== String(produk.id));
      }
      return [
        ...prev,
        {
          id: produk.id,
          nama: produk.nama,
          harga: produk.harga,
          foto_url: produk.foto_url,
          kategori: produk.kategori,
        },
      ];
    });
  }

  return (
    <FavoritContext.Provider
      value={{
        daftarFavorit,
        sudahMuat,
        apakahFavorit,
        toggleFavorit,
        totalFavorit: daftarFavorit.length,
      }}
    >
      {children}
    </FavoritContext.Provider>
  );
}

export function useFavorit() {
  const context = useContext(FavoritContext);
  if (!context) {
    throw new Error("useFavorit harus digunakan di dalam FavoritProvider");
  }
  return context;
}
