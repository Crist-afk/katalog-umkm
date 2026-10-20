"use client";

import { useEffect, useState } from "react";

// US-25: Tombol ganti mode terang / gelap
export default function TombolModeGelap() {
  const [apakahGelap, setApakahGelap] = useState(false);
  const [sudahMuat, setSudahMuat] = useState(false);

  useEffect(() => {
    try {
      const temaTersimpan = localStorage.getItem("katalog_umkm_tema");
      const preferensiSistem = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const aktifGelap = temaTersimpan === "dark" || (!temaTersimpan && preferensiSistem);

      if (aktifGelap) {
        document.documentElement.classList.add("dark");
        setApakahGelap(true);
      } else {
        document.documentElement.classList.remove("dark");
        setApakahGelap(false);
      }
    } catch {
      /* abaikan error localStorage */
    } finally {
      setSudahMuat(true);
    }
  }, []);

  function toggleTema() {
    const nilaiBaru = !apakahGelap;
    setApakahGelap(nilaiBaru);

    if (nilaiBaru) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("katalog_umkm_tema", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("katalog_umkm_tema", "light");
    }
  }

  if (!sudahMuat) {
    return <div className="h-8 w-8" />;
  }

  return (
    <button
      type="button"
      onClick={toggleTema}
      title={apakahGelap ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      aria-label={apakahGelap ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-garis bg-permukaan text-teks transition-colors hover:border-utama hover:text-utama"
    >
      {apakahGelap ? (
        // Ikon Matahari (ke mode terang)
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
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        // Ikon Bulan (ke mode gelap)
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
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
