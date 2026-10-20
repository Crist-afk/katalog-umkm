import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: "Tentang Kami",
  description: `Kenali lebih lanjut tentang ${toko.nama}, ${toko.tagline}`,
};

// US-22: halaman tentang toko
export default function HalamanTentang() {
  return (
    <div className="flex flex-col gap-8 py-12">
      <div>
        <p className="text-sm font-semibold text-utama">Tentang kami</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {toko.nama}
        </h1>
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-teks-lembut">
          {toko.tagline}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-garis bg-permukaan p-6">
          <h2 className="font-bold">Alamat</h2>
          <p className="mt-2 text-sm leading-relaxed text-teks-lembut">{toko.alamat}</p>
        </div>
        <div className="rounded-2xl border border-garis bg-permukaan p-6">
          <h2 className="font-bold">Jam buka</h2>
          <p className="mt-2 text-sm text-teks-lembut">{toko.jamBuka}</p>
        </div>
        <div className="rounded-2xl border border-garis bg-permukaan p-6">
          <h2 className="font-bold">Hubungi kami</h2>
          <a
            href={`https://wa.me/${toko.nomorWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-sm font-semibold text-utama hover:text-utama-gelap"
          >
            Chat via WhatsApp →
          </a>
        </div>
      </div>

      <Link href="/" className="self-start text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
        ← Kembali ke katalog
      </Link>
    </div>
  );
}
