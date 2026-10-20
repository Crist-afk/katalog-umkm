"use server";

import { redirect } from "next/navigation";
import { buatKoneksiAdmin } from "@/lib/supabase/admin";
import { buatKoneksiServer } from "@/lib/supabase/server";

// Helper upload foto ke Supabase Storage (US-29)
async function prosesUploadFoto(fotoFile, fotoUrlManual, errors) {
  if (fotoFile && fotoFile instanceof File && fotoFile.size > 0) {
    // Validasi tipe file gambar
    if (!fotoFile.type.startsWith("image/")) {
      errors.foto_file = "Format file tidak didukung. Unggah gambar (JPG, PNG, WEBP, atau SVG).";
      return null;
    }

    // Validasi ukuran maksimal 5 MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (fotoFile.size > MAX_SIZE) {
      errors.foto_file = "Ukuran gambar terlalu besar. Maksimal 5 MB.";
      return null;
    }

    try {
      const serverClient = buatKoneksiServer();
      const ext = fotoFile.name.split(".").pop() || "jpg";
      const namaBersih = fotoFile.name.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 20);
      const namaFile = `${Date.now()}-${namaBersih}.${ext}`;

      const arrayBuffer = await fotoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await serverClient.storage
        .from("produk")
        .upload(namaFile, buffer, {
          contentType: fotoFile.type,
          upsert: true,
        });

      if (uploadError) {
        errors.foto_file = `Gagal mengunggah foto: ${uploadError.message}`;
        return null;
      }

      const { data: { publicUrl } } = serverClient.storage.from("produk").getPublicUrl(namaFile);
      return publicUrl;
    } catch (err) {
      errors.foto_file = `Terjadi kesalahan saat mengunggah foto: ${err.message}`;
      return null;
    }
  }

  return fotoUrlManual || "";
}

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
  const foto_file = formData?.get("foto_file");

  const nama = String(rawNama).trim();
  const rawHargaStr = String(rawHarga).trim();
  const harga = parseInt(rawHargaStr, 10);
  const kategori = String(rawKategori).trim();
  let foto_url = String(rawFoto).trim();
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

  // Upload ke Supabase Storage jika ada file foto (US-29)
  if (foto_file && foto_file instanceof File && foto_file.size > 0) {
    const uploadedUrl = await prosesUploadFoto(foto_file, foto_url, errors);
    if (uploadedUrl) {
      foto_url = uploadedUrl;
      values.foto_url = uploadedUrl;
    }
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
  const foto_file = formData?.get("foto_file");

  const nama = String(rawNama).trim();
  const rawHargaStr = String(rawHarga).trim();
  const harga = parseInt(rawHargaStr, 10);
  const kategori = String(rawKategori).trim();
  let foto_url = String(rawFoto).trim();
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

  // Upload ke Supabase Storage jika ada file foto baru (US-29)
  if (foto_file && foto_file instanceof File && foto_file.size > 0) {
    const uploadedUrl = await prosesUploadFoto(foto_file, foto_url, errors);
    if (uploadedUrl) {
      foto_url = uploadedUrl;
      values.foto_url = uploadedUrl;
    }
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

