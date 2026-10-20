import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import TombolTambahKeranjang from "@/components/TombolTambahKeranjang";
import TombolFavorit from "@/components/TombolFavorit";

// US-01 (Kartu), US-21 (Tambah keranjang), US-24 (Favorit)
export default function KartuProduk({ produk }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar transition-all hover:shadow-sm">
      <div className="relative block overflow-hidden">
        <Link href={`/produk/${produk.id}`}>
          <img
            src={produk.foto_url}
            alt={produk.nama}
            className="aspect-square w-full bg-permukaan object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-2.5 right-2.5 z-10">
          <TombolFavorit produk={produk} />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-teks-lembut">{produk.kategori}</p>
          <Link href={`/produk/${produk.id}`}>
            <h3 className="font-semibold leading-snug hover:text-utama">{produk.nama}</h3>
          </Link>
        </div>
        <div className="flex items-center justify-between gap-2 pt-1">
          <p className="rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
          <TombolTambahKeranjang produk={produk} varian="kompak" />
        </div>
      </div>
    </div>
  );
}
