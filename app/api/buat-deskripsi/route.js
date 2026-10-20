/**
 * US-14: Route Handler – Buat deskripsi produk otomatis dengan AI (Gemini).
 * Dipanggil dari form tambah / ubah produk di halaman admin.
 * Kunci API hanya berada di server (tidak ada di browser).
 */

import { NextResponse } from "next/server";
import { buatKoneksiAdmin } from "@/lib/supabase/admin";

export async function POST(request) {
  // 1. Verifikasi admin sedang login
  try {
    const supabase = await buatKoneksiAdmin();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Akses ditolak. Silakan login sebagai admin." },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Gagal memverifikasi sesi admin." },
      { status: 401 }
    );
  }

  // 2. Ambil parameter nama dan kategori
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format request tidak valid." },
      { status: 400 }
    );
  }

  const { nama, kategori } = body || {};

  if (!nama || !nama.trim()) {
    return NextResponse.json(
      { error: "Nama produk harus diisi terlebih dahulu sebelum membuat deskripsi." },
      { status: 400 }
    );
  }

  // 3. Panggil Gemini API dari server
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        deskripsi: `${nama.trim()} adalah produk ${
          kategori ? `kategori ${kategori}` : "pilihan berkualitas"
        } yang dibuat dengan bahan terbaik, higienis, dan cita rasa autentik. Sangat cocok dinikmati sehari-hari maupun untuk hidangan acara spesial bersama keluarga.`,
      },
      { status: 200 }
    );
  }

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `Buatkan deskripsi produk yang menarik, menggugah selera/minat pembeli, dan singkat (2-3 kalimat) untuk produk UMKM berikut:
Nama Produk: ${nama.trim()}
${kategori ? `Kategori: ${kategori.trim()}` : ""}

Aturan:
- Gunakan bahasa Indonesia yang ramah, hangat, dan menarik.
- Jangan gunakan formatting markdown berlebih (tanpa bold bintang).
- Langsung berikan teks deskripsinya saja tanpa kalimat pengantar seperti "Berikut adalah deskripsinya:".`;

    const res = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", errText);
      // Fallback deskripsi template jika kuota Gemini habis
      return NextResponse.json({
        deskripsi: `${nama.trim()} adalah pilihan terbaik untuk kategori ${
          kategori || "produk"
        }, diolah dengan bahan baku berkualitas dan penuh ketelitian untuk menjamin rasa serta kepuasan pelanggan.`,
      });
    }

    const data = await res.json();
    const deskripsi =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      `${nama.trim()} berkualitas premium siap dipesan.`;

    return NextResponse.json({ deskripsi });
  } catch (err) {
    console.error("Buat deskripsi AI error:", err);
    return NextResponse.json({
      deskripsi: `${nama.trim()} dengan rasa dan kualitas terbaik, siap dipesan melalui WhatsApp kami.`,
    });
  }
}
