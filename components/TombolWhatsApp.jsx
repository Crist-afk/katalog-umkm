import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

// US-03: buka WhatsApp toko dengan pesan otomatis berisi nama dan harga produk.
export default function TombolWhatsApp({ produk }) {
  if (!produk) return null;

  const nomorBersih = (toko.nomorWhatsApp || "").replace(/[^0-9]/g, "");
  const pesan = `Halo, saya ingin memesan ${produk.nama} seharga ${formatRupiah(produk.harga)}.`;
  const linkWhatsApp = `https://wa.me/${nomorBersih}?text=${encodeURIComponent(pesan)}`;

  return (
    <a
      href={linkWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
    >
      Pesan via WhatsApp
    </a>
  );
}

