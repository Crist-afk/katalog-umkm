"use client";

import { createContext, useContext, useState, useEffect } from "react";

const BandingkanContext = createContext(null);
const STORAGE_KEY = "katalog_umkm_bandingkan";

export function BandingkanProvider({ children }) {
  const [daftarBandingkan, setDaftarBandingkan] = useState([]);
  const [pesanNotif, setPesanNotif] = useState("");

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) setDaftarBandingkan(JSON.parse(data));
    } catch {
      // ignore
    }
  }, []);

  const simpan = (baru) => {
    setDaftarBandingkan(baru);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(baru));
    } catch {
      // ignore
    }
  };

  const toggleBandingkan = (produk) => {
    if (!produk || !produk.id) return;
    const sudahAda = daftarBandingkan.some((p) => p.id === produk.id);

    if (sudahAda) {
      simpan(daftarBandingkan.filter((p) => p.id !== produk.id));
      setPesanNotif(`Dihapus dari perbandingan`);
    } else {
      if (daftarBandingkan.length >= 2) {
        // Gantikan pilihan lama dengan yang baru (US-37 kriteria 3)
        const update = [daftarBandingkan[1], produk];
        simpan(update);
        setPesanNotif(`Maksimal 2 produk. Mengganti pilihan pertama.`);
      } else {
        simpan([...daftarBandingkan, produk]);
        setPesanNotif(`Ditambahkan ke perbandingan`);
      }
    }
    setTimeout(() => setPesanNotif(""), 3000);
  };

  const hapusSemua = () => {
    simpan([]);
  };

  return (
    <BandingkanContext.Provider
      value={{
        daftarBandingkan,
        toggleBandingkan,
        hapusSemua,
        pesanNotif,
        isBandingkan: (id) => daftarBandingkan.some((p) => p.id === id),
      }}
    >
      {children}
    </BandingkanContext.Provider>
  );
}

export function useBandingkan() {
  const ctx = useContext(BandingkanContext);
  if (!ctx) {
    return {
      daftarBandingkan: [],
      toggleBandingkan: () => {},
      hapusSemua: () => {},
      pesanNotif: "",
      isBandingkan: () => false,
    };
  }
  return ctx;
}
