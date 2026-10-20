import Link from "next/link";
import { keluarAdmin } from "@/app/admin/actions";

export default function NavAdmin() {
  return (
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-garis pb-4 text-sm">
      <Link href="/admin" className="font-semibold hover:text-utama">
        Produk
      </Link>
      <Link href="/admin/password" className="font-semibold hover:text-utama">
        Ganti password
      </Link>
      {/* US-04: tombol keluar mengakhiri sesi dan kembali ke /admin/login */}
      <form action={keluarAdmin} className="ml-auto">
        <button type="submit" className="text-teks-lembut hover:text-bahaya cursor-pointer">
          Keluar
        </button>
      </form>
    </nav>
  );
}

