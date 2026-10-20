import Link from "next/link";
import NavKeranjang from "@/components/NavKeranjang";
import NavFavorit from "@/components/NavFavorit";
import NavBandingkan from "@/components/NavBandingkan";
import TombolModeGelap from "@/components/TombolModeGelap";
import { ambilPengaturanToko } from "@/lib/pengaturan";

export default async function Header() {
  const toko = await ambilPengaturanToko();

  return (
    <header className="border-b border-garis bg-latar transition-colors">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
          {toko.nama}
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium sm:gap-3">
          <Link href="/" className="hidden text-teks hover:text-utama sm:inline-block">
            Katalog
          </Link>
          <Link href="/tentang" className="hidden text-teks hover:text-utama sm:inline-block">
            Tentang
          </Link>
          <NavBandingkan />
          <NavFavorit />
          <NavKeranjang />
          <TombolModeGelap />
        </nav>
      </div>
    </header>
  );
}
