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
