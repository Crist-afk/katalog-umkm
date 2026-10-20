"use client";

import { useActionState } from "react";
import NavAdmin from "@/components/NavAdmin";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { ubahProduk } from "@/app/admin/actions";

// US-09: ubah produk & US-34: Validasi form di server
export default function HalamanUbahProduk({ produk }) {
  const aksiUbah = ubahProduk.bind(null, produk.id);
  const [state, formAction, isPending] = useActionState(aksiUbah, null);

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      {state?.error && (
        <div className="max-w-xl rounded-xl border border-bahaya/20 bg-permukaan p-4 text-sm text-bahaya">
          {state.error}
        </div>
      )}
      <form action={formAction} className="flex max-w-xl flex-col gap-4">
        <Input
          label="Nama produk"
          name="nama"
          defaultValue={state?.values?.nama ?? produk.nama}
          error={state?.errors?.nama}
          required
        />
        <Input
          label="Harga (Rp)"
          name="harga"
          type="number"
          min="1"
          defaultValue={state?.values?.harga ?? produk.harga}
          error={state?.errors?.harga}
          required
        />
        <Input
          label="Kategori"
          name="kategori"
          defaultValue={state?.values?.kategori ?? produk.kategori}
        />
        <Input
          label="Link foto"
          name="foto_url"
          placeholder="https://... atau /produk/nama-file.svg"
          defaultValue={state?.values?.foto_url ?? produk.foto_url}
        />
        <Input
          label="Deskripsi"
          name="deskripsi"
          textarea
          defaultValue={state?.values?.deskripsi ?? produk.deskripsi}
        />
        <div className="flex gap-3">
          <Tombol type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan perubahan"}
          </Tombol>
          <Tombol href="/admin" varian="garis">
            Batal
          </Tombol>
        </div>
      </form>
    </div>
  );
}
