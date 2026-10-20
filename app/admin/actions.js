"use server";

import { redirect } from "next/navigation";
import { buatKoneksiAdmin } from "@/lib/supabase/admin";

/**
 * Server Action untuk memproses login admin dengan email dan password.
 */
export async function loginAdmin(arg1, arg2) {
  const formData = arg2 instanceof FormData ? arg2 : arg1 instanceof FormData ? arg1 : null;
  const email = formData?.get("email");
  const password = formData?.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let signInError = null;

  try {
    const supabase = await buatKoneksiAdmin();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      signInError = "Email atau password salah. Silakan periksa kembali.";
    }
  } catch (err) {
    signInError = err.message || "Terjadi kesalahan saat memproses login.";
  }

  if (signInError) {
    return { error: signInError };
  }

  redirect("/admin");
}

/**
 * Server Action untuk mengakhiri sesi admin (logout) lalu kembali ke halaman login.
 */
export async function keluarAdmin() {
  try {
    const supabase = await buatKoneksiAdmin();
    await supabase.auth.signOut();
  } catch {
    // Tetap arahkan ke halaman login jika terjadi kegagalan
  }

  redirect("/admin/login");
}

/**
 * Server Action untuk mengganti password admin yang sedang login.
 */
export async function tambahProduk(arg1, arg2) {
  const formData = arg2 instanceof FormData ? arg2 : arg1 instanceof FormData ? arg1 : null;

  const rawNama = formData?.get("nama") ?? "";
  const rawHarga = formData?.get("harga") ?? "";
  const rawKategori = formData?.get("kategori") ?? "";
  const rawFoto = formData?.get("foto_url") ?? "";
  const rawDeskripsi = formData?.get("deskripsi") ?? "";

  const nama = String(rawNama).trim();
  const rawHargaStr = String(rawHarga).trim();
  const harga = parseInt(rawHargaStr, 10);
  const kategori = String(rawKategori).trim();
  const foto_url = String(rawFoto).trim();
  const deskripsi = String(rawDeskripsi).trim();

  const values = {
    nama,
    harga: rawHargaStr,
    kategori,
    foto_url,
    deskripsi,
  };

  const errors = {};
  if (!nama) {
    errors.nama = "Nama produk wajib diisi.";
  }
  if (!rawHargaStr) {
    errors.harga = "Harga produk wajib diisi.";
  } else if (isNaN(harga) || harga <= 0) {
    errors.harga = "Harga harus berupa angka lebih dari 0.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values, error: "Mohon periksa kembali isian form Anda." };
  }

  try {
    const supabase = await buatKoneksiAdmin();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return { error: "Sesi tidak ditemukan. Silakan login kembali.", values };

    const { error } = await supabase.from("produk").insert([{ nama, harga, kategori, foto_url, deskripsi }]);
    if (error) return { error: error.message, values };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat menyimpan produk.", values };
  }

  redirect("/admin");
}

export async function ubahProduk(id, arg1, arg2) {
  const formData = arg2 instanceof FormData ? arg2 : arg1 instanceof FormData ? arg1 : null;

  const rawNama = formData?.get("nama") ?? "";
  const rawHarga = formData?.get("harga") ?? "";
  const rawKategori = formData?.get("kategori") ?? "";
  const rawFoto = formData?.get("foto_url") ?? "";
  const rawDeskripsi = formData?.get("deskripsi") ?? "";

  const nama = String(rawNama).trim();
  const rawHargaStr = String(rawHarga).trim();
  const harga = parseInt(rawHargaStr, 10);
  const kategori = String(rawKategori).trim();
  const foto_url = String(rawFoto).trim();
  const deskripsi = String(rawDeskripsi).trim();

  const values = {
    nama,
    harga: rawHargaStr,
    kategori,
    foto_url,
    deskripsi,
  };

  const errors = {};
  if (!nama) {
    errors.nama = "Nama produk wajib diisi.";
  }
  if (!rawHargaStr) {
    errors.harga = "Harga produk wajib diisi.";
  } else if (isNaN(harga) || harga <= 0) {
    errors.harga = "Harga harus berupa angka lebih dari 0.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values, error: "Mohon periksa kembali isian form Anda." };
  }

  try {
    const supabase = await buatKoneksiAdmin();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return { error: "Sesi tidak ditemukan. Silakan login kembali.", values };

    const { error } = await supabase
      .from("produk")
      .update({ nama, harga, kategori, foto_url, deskripsi })
      .eq("id", id);
    if (error) return { error: error.message, values };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat menyimpan perubahan.", values };
  }

  redirect("/admin");
}

export async function hapusProduk(id) {
  try {
    const supabase = await buatKoneksiAdmin();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { error: "Sesi tidak ditemukan. Silakan login kembali." };

    const { error } = await supabase.from("produk").delete().eq("id", id);
    if (error) return { error: error.message };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat menghapus produk." };
  }

  redirect("/admin");
}

export async function gantiPasswordAdmin(arg1, arg2) {
  const formData = arg2 instanceof FormData ? arg2 : arg1 instanceof FormData ? arg1 : null;
  const passwordBaru = formData?.get("password_baru");
  const konfirmasiPassword = formData?.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (String(passwordBaru).length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak sama dengan password baru." };
  }

  try {
    const supabase = await buatKoneksiAdmin();

    // Pastikan admin sedang login sebelum mengganti password
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Sesi tidak ditemukan atau telah berakhir. Silakan login kembali." };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: String(passwordBaru),
    });

    if (updateError) {
      return { error: updateError.message || "Gagal mengganti password." };
    }

    return { success: true, message: "Password berhasil diperbarui." };
  } catch (err) {
    return { error: err.message || "Terjadi kesalahan saat mengganti password." };
  }
}

