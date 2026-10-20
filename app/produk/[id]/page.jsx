import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolBagikan from "@/components/TombolBagikan";
import TombolTambahKeranjang from "@/components/TombolTambahKeranjang";
import TombolFavorit from "@/components/TombolFavorit";
import KartuProduk from "@/components/KartuProduk";
import AsistenAI from "@/components/AsistenAI";
import { CatatTerakhirDilihat } from "@/components/TerakhirDilihat";
import { buatKoneksiServer } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

async function ambilProduk(id) {
  try {
    const supabase = buatKoneksiServer();
    const { data, error } = await supabase
      .from("produk")
      .select("id, nama, harga, deskripsi, foto_url, kategori, created_at")
      .eq("id", id)
      .maybeSingle();
    if (!error && data) return data;
  } catch {
    /* empty */
  }
  return null;
}

// US-26: generateMetadata untuk SEO dan Open Graph per produk
export async function generateMetadata({ params }) {
  const { id } = await params;
  const produk = await ambilProduk(id);
  if (!produk) return { title: "Produk tidak ditemukan" };
  return {
    title: produk.nama,
    description: produk.deskripsi || `${produk.nama} – ${formatRupiah(produk.harga)}`,
    openGraph: {
      title: `${produk.nama} — ${toko.nama}`,
      description: produk.deskripsi || `${produk.nama} – ${formatRupiah(produk.harga)}`,
      images: produk.foto_url?.startsWith("http") ? [{ url: produk.foto_url }] : [],
    },
  };
}

// US-02: ambil satu produk dari Supabase berdasarkan id, di sisi server.
export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  const produk = await ambilProduk(id);

  if (!produk) {
    notFound();
  }

  // US-17: ambil produk terkait dari kategori yang sama
  let produkTerkait = [];
  if (produk.kategori) {
    try {
      const supabase = buatKoneksiServer();
      const { data } = await supabase
        .from("produk")
        .select("id, nama, harga, foto_url, kategori")
        .eq("kategori", produk.kategori)
        .neq("id", produk.id)
        .limit(4);
      produkTerkait = data || [];
    } catch {
      /* empty */
    }
  }

  return (
    <>
      <CatatTerakhirDilihat produk={produk} />
      <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
        />
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
            Kembali ke katalog
          </Link>
          <p className="text-sm text-teks-lembut">{produk.kategori}</p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
          <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
          <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
          <div className="flex flex-col gap-3">
            <TombolTambahKeranjang produk={produk} />
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <TombolWhatsApp produk={produk} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <TombolFavorit produk={produk} varian="lebar" />
                <TombolBagikan
                  judul={`${produk.nama} — ${toko.nama}`}
                  teks={`Lihat ${produk.nama} seharga ${formatRupiah(produk.harga)} di ${toko.nama}`}
                />
              </div>
            </div>
          </div>
          {/* US-50: Asisten AI tanya jawab produk */}
          <AsistenAI produk={produk} />
        </div>
      </article>

      {produkTerkait.length > 0 && (
        <section className="border-t border-garis py-10">
          <h2 className="mb-4 text-lg font-bold">Produk lain di kategori {produk.kategori}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {produkTerkait.map((p) => (
              <KartuProduk key={p.id} produk={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
