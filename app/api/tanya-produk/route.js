/**
 * US-50: Route Handler – Asisten AI tanya jawab produk.
 *
 * - Memanggil Gemini REST API dari server (kunci tidak ada di browser).
 * - Konteks jawaban hanya berdasar data produk yang dikirim.
 * - Panjang pertanyaan dibatasi 300 karakter.
 * - Rate-limit dasar: maks 5 permintaan per menit per IP.
 * - Timeout 15 detik ke Gemini API.
 */

import { NextResponse } from "next/server";

// --------------- Rate Limiter sederhana (in-memory) ---------------
const LIMIT_WINDOW_MS = 60_000; // 1 menit
const LIMIT_MAX = 5;
const rateMap = new Map();

function cekRateLimit(ip) {
  const now = Date.now();
  let record = rateMap.get(ip);
  if (!record || now - record.windowStart > LIMIT_WINDOW_MS) {
    record = { windowStart: now, count: 0 };
    rateMap.set(ip, record);
  }
  record.count += 1;
  return record.count <= LIMIT_MAX;
}

// Bersihkan record lama setiap 5 menit agar memori tidak membengkak
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of rateMap) {
    if (now - rec.windowStart > LIMIT_WINDOW_MS * 2) rateMap.delete(ip);
  }
}, 300_000);

// --------------- Handler ---------------
export async function POST(request) {
  // 1. Validasi API key tersedia
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Fitur asisten AI belum dikonfigurasi." },
      { status: 503 }
    );
  }

  // 2. Rate-limit berdasar IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  if (!cekRateLimit(ip)) {
    return NextResponse.json(
      { error: "Terlalu banyak pertanyaan. Coba lagi dalam 1 menit." },
      { status: 429 }
    );
  }

  // 3. Parse dan validasi body
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 }
    );
  }

  const { pertanyaan, produk } = body;

  if (!pertanyaan || typeof pertanyaan !== "string" || !pertanyaan.trim()) {
    return NextResponse.json(
      { error: "Pertanyaan tidak boleh kosong." },
      { status: 400 }
    );
  }

  if (pertanyaan.trim().length > 300) {
    return NextResponse.json(
      { error: "Pertanyaan terlalu panjang (maks 300 karakter)." },
      { status: 400 }
    );
  }

  if (!produk || !produk.nama) {
    return NextResponse.json(
      { error: "Data produk tidak lengkap." },
      { status: 400 }
    );
  }

  // 4. Bangun prompt – jawaban HANYA berdasar data produk
  const konteksProduk = [
    `Nama produk: ${produk.nama}`,
    produk.harga ? `Harga: Rp${Number(produk.harga).toLocaleString("id-ID")}` : null,
    produk.kategori ? `Kategori: ${produk.kategori}` : null,
    produk.deskripsi ? `Deskripsi: ${produk.deskripsi}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const systemPrompt = `Kamu adalah asisten toko online bernama "Dapur Bunda". Tugasmu menjawab pertanyaan pembeli HANYA berdasarkan informasi produk berikut. Jangan mengarang informasi yang tidak ada. Jika kamu tidak tahu jawabannya, sampaikan bahwa informasi tersebut tidak tersedia dan sarankan pembeli untuk bertanya lewat WhatsApp. Jawab dengan singkat, ramah, dan dalam bahasa Indonesia.

Data produk:
${konteksProduk}`;

  // 5. Panggil Gemini API dengan timeout 15 detik
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const res = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: pertanyaan.trim() }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.4,
        },
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Gemini API error:", res.status, detail);
      return NextResponse.json(
        { error: "Gagal mendapatkan jawaban dari AI. Silakan coba lagi nanti." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const jawaban =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, saya tidak bisa menjawab saat ini.";

    return NextResponse.json({ jawaban });
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      return NextResponse.json(
        { error: "Permintaan ke AI memakan waktu terlalu lama. Silakan coba lagi." },
        { status: 504 }
      );
    }
    console.error("Tanya-produk error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses pertanyaan." },
      { status: 500 }
    );
  }
}
