# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
> Baca AGENTS.md dan docs/user-stories.md bagian US-01.
>
> Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.
>
> Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Dibuat koneksi Supabase sisi server di `lib/supabase/server.js` menggunakan `SUPABASE_SECRET_KEY` dan re-export di `lib/supabase/index.js`.
- Halaman `app/page.jsx` diubah menjadi Server Component async yang mengambil daftar produk langsung dari tabel `produk` di Supabase.
- Produk ditampilkan menggunakan komponen `KartuProduk` dengan format harga rupiah yang rapi.
- Ditambahkan penanganan kondisi tabel kosong ("Belum ada produk") dan pesan error jika koneksi gagal.
- Komponen `CatatanBelumAktif` dan mock data `lib/data-contoh.js` telah dihapus dari katalog utama.

**Perbaikan:**
- Menambahkan normalisasi URL pada fungsi `buatKoneksiServer()` agar otomatis memotong trailing slash atau akhiran `/rest/v1` jika pengguna tidak sengaja menyalin URL endpoint REST dari dashboard Supabase, mencegah error *"Invalid path specified in request URL"*.

---

## US-02 Detail produk

**Prompt:**
> Baca docs/user-stories.md bagian US-02.
>
> Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- Halaman `app/produk/[id]/page.jsx` mengambil data satu produk secara dinamis dari tabel `produk` di Supabase berdasarkan parameter `id`.
- Menampilkan foto, nama, kategori, harga berformat rupiah, dan deskripsi produk dari database.
- Memanggil `notFound()` dari `next/navigation` jika produk tidak ditemukan di database.
- Komponen `CatatanBelumAktif` telah dihapus dengan tetap mempertahankan tombol WhatsApp dan tampilan halaman.

**Perbaikan:**
- Menangani `params` dinamis sebagai Promise (`const { id } = await params`) sesuai standar Next.js 16 dan memastikan eksekusi `notFound()` berada di luar blok `try/catch` agar sinyal 404 internal Next.js dapat ditangkap dengan tepat.

---

## US-03 Pesan via WhatsApp

**Prompt:**
> Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".
>
> Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- Komponen `components/TombolWhatsApp.jsx` diubah dari elemen `<button>` menjadi elemen `<a>` dengan styling visual tombol yang persis sama.
- Tautan diarahkan ke format `https://wa.me/<nomor>?text=<pesan>`.
- Nomor tujuan diambil dari `lib/toko.js`.
- Pesan otomatis memuat nama dan harga produk berformat rupiah yang di-encode dengan aman menggunakan `encodeURIComponent`.
- Dilengkapi atribut `target="_blank"` dan `rel="noopener noreferrer"` agar terbuka di tab baru.

**Perbaikan:**
- Menambahkan sanitasi string nomor WhatsApp dengan `.replace(/[^0-9]/g, "")` untuk memastikan nomor tetap berformat numerik internasional valid meskipun terdapat spasi atau tanda hubung pada file pengaturan.

---

## US-04 Login admin

**Prompt:**
> Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.
>
> Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Dibuat helper `lib/supabase/admin.js` yang memanfaatkan `@supabase/ssr` (`createServerClient`) bersama `cookies()` dari `next/headers` untuk mengelola cookie sesi admin.
- Dibuat Server Action `loginAdmin` di `app/admin/actions.js` yang memverifikasi kredensial via `supabase.auth.signInWithPassword` dan melakukan redirect ke `/admin` jika sukses.
- Dibuat Server Action `keluarAdmin` yang memanggil `supabase.auth.signOut()` dan mengarahkan kembali ke `/admin/login`.
- Form di `app/admin/login/page.jsx` disambungkan ke Server Action menggunakan `useActionState` dan menampilkan pesan error jika login gagal.
- Tombol "Keluar" di `components/NavAdmin.jsx` disambungkan ke Server Action `keluarAdmin`.
- Komponen `CatatanBelumAktif` telah dihapus dari halaman login.

**Perbaikan:**
- Menyusun penanganan argumen Server Action agar fleksibel menangani pemanggilan via `useActionState` maupun `<form action={...}>` langsung, serta menyediakan pesan kesalahan dalam Bahasa Indonesia yang informatif.

---

## US-05 Ganti password

**Prompt:**
> Baca docs/user-stories.md bagian US-05.
>
> Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Menambahkan Server Action `gantiPasswordAdmin` di `app/admin/actions.js`.
- Memvalidasi di server: memeriksa kelengkapan isian, panjang password minimal 8 karakter, kecocokan konfirmasi password, serta keaktifan sesi login admin via `supabase.auth.getUser()`.
- Mengganti password akun admin aktif menggunakan `supabase.auth.updateUser({ password })`.
- Form di `app/admin/password/page.jsx` disambungkan via `useActionState` untuk menampilkan pesan sukses atau pesan error secara dinamis.
- Komponen `CatatanBelumAktif` telah dihapus dari halaman ganti password.

**Perbaikan:**
- Menambahkan state status pending (`isPending`) pada tombol submit untuk mencegah submit ganda dan menampilkan umpan balik visual "Menyimpan...".

---

## US-06 Proteksi halaman admin

**Prompt:**
> Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.
>
> Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Dibuat file `proxy.js` di root proyek untuk memproteksi semua rute `/admin/:path*` kecuali `/admin/login`.
- Memeriksa sesi login menggunakan `@supabase/ssr` dan cookie request; jika tidak ada sesi aktif, otomatis mengalihkan (*redirect 307*) ke `/admin/login`.
- Seluruh Server Action yang melakukan mutasi data telah memverifikasi status login admin di server.
- Menghapus komponen `CatatanBelumAktif` dari halaman dashboard `app/admin/page.jsx`.

**Perbaikan:**
- Mengimplementasikan ekspor alias ganda (`export async function proxy`, `export const middleware = proxy`, dan `export default proxy`) untuk memastikan kompatibilitas penuh dengan router Next.js 16.

---

## Debugging dan fitur bonus

*(Bagian ini dapat diisi saat mengerjakan perbaikan tambahan atau fitur bonus US-07 s.d. US-14)*

