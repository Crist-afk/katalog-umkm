"use client";

import { useActionState } from "react";
import NavAdmin from "@/components/NavAdmin";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahProduk } from "@/app/admin/actions";

// US-08: Tambah produk & US-34: Validasi form di server
export default function HalamanTambahProduk() {
  const [state, formAction, isPending] = useActionState(tambahProduk, null);

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Tambah produk</h1>
      {state?.error && (
        <div className="max-w-xl rounded-xl border border-bahaya/20 bg-permukaan p-4 text-sm text-bahaya">
          {state.error}
        </div>
      )}
      <form action={formAction} className="flex max-w-xl flex-col gap-4">
        <Input
          label="Nama produk"
          name="nama"
          defaultValue={state?.values?.nama || ""}
          error={state?.errors?.nama}
          required
        />
        <Input
          label="Harga (Rp)"
          name="harga"
          type="number"
          min="1"
          defaultValue={state?.values?.harga || ""}
          error={state?.errors?.harga}
          required
        />
        <Input
          label="Kategori"
          name="kategori"
          defaultValue={state?.values?.kategori || ""}
        />
        <Input
          label="Upload file foto (maks. 5 MB)"
          name="foto_file"
          type="file"
          accept="image/*"
          error={state?.errors?.foto_file}
        />
        <Input
          label="Atau link foto (URL)"
          name="foto_url"
          placeholder="https://... atau /produk/nama-file.svg"
          defaultValue={state?.values?.foto_url || ""}
        />
        <Input
          label="Deskripsi"
          name="deskripsi"
          textarea
          defaultValue={state?.values?.deskripsi || ""}
        />
        <div className="flex gap-3">
          <Tombol type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan produk"}
          </Tombol>
          <Tombol href="/admin" varian="garis">
            Batal
          </Tombol>
        </div>
      </form>
    </div>
  );
}

