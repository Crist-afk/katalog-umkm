import { notFound } from "next/navigation";
import { buatKoneksiServer } from "@/lib/supabase/server";
import FormUbahProduk from "@/components/FormUbahProduk";

// US-09: ambil data produk lama dari DB, lalu tampilkan form ubah.
export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  let produk = null;
  try {
    const supabase = buatKoneksiServer();
    const { data } = await supabase
      .from("produk")
      .select("id, nama, harga, deskripsi, foto_url, kategori")
      .eq("id", id)
      .maybeSingle();
    produk = data;
  } catch {
    // produk null → notFound()
  }

  if (!produk) notFound();

  return <FormUbahProduk produk={produk} />;
}
