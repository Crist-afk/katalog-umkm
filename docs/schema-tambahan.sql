-- Schema tambahan untuk fitur bonus
-- Jalankan di Supabase > SQL Editor > New query > tempel > Run
-- Aman dijalankan ulang (CREATE IF NOT EXISTS / DO NOTHING)

-- US-19: Status stok
ALTER TABLE public.produk ADD COLUMN IF NOT EXISTS stok integer NOT NULL DEFAULT -1;
-- stok = -1 artinya "tidak terbatas / selalu tersedia"
-- stok = 0 artinya "habis"
-- stok > 0 artinya jumlah stok tersisa

-- US-20: Harga coret (diskon) dan badge
ALTER TABLE public.produk ADD COLUMN IF NOT EXISTS harga_coret integer DEFAULT NULL;
ALTER TABLE public.produk ADD COLUMN IF NOT EXISTS badge text DEFAULT NULL;
-- badge: 'Baru', 'Terlaris', atau NULL

-- US-32: Aktif / nonaktifkan produk
ALTER TABLE public.produk ADD COLUMN IF NOT EXISTS aktif boolean NOT NULL DEFAULT true;

-- US-47: Atur urutan tampil produk
ALTER TABLE public.produk ADD COLUMN IF NOT EXISTS urutan integer NOT NULL DEFAULT 0;

-- US-31: Tabel kategori
CREATE TABLE IF NOT EXISTS public.kategori (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.kategori ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_baca_kategori" ON public.kategori;
DROP POLICY IF EXISTS "admin_tambah_kategori" ON public.kategori;
DROP POLICY IF EXISTS "admin_ubah_kategori" ON public.kategori;
DROP POLICY IF EXISTS "admin_hapus_kategori" ON public.kategori;
CREATE POLICY "admin_baca_kategori" ON public.kategori FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_tambah_kategori" ON public.kategori FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_ubah_kategori" ON public.kategori FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_hapus_kategori" ON public.kategori FOR DELETE TO authenticated USING (true);

-- Isi kategori awal dari data produk yang sudah ada
INSERT INTO public.kategori (nama)
SELECT DISTINCT kategori FROM public.produk WHERE kategori IS NOT NULL AND kategori != ''
ON CONFLICT (nama) DO NOTHING;

-- US-18: Galeri beberapa foto produk
CREATE TABLE IF NOT EXISTS public.foto_produk (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  produk_id bigint NOT NULL REFERENCES public.produk(id) ON DELETE CASCADE,
  foto_url text NOT NULL,
  urutan integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.foto_produk ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_baca_foto" ON public.foto_produk;
DROP POLICY IF EXISTS "admin_tambah_foto" ON public.foto_produk;
DROP POLICY IF EXISTS "admin_hapus_foto" ON public.foto_produk;
CREATE POLICY "admin_baca_foto" ON public.foto_produk FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_tambah_foto" ON public.foto_produk FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_hapus_foto" ON public.foto_produk FOR DELETE TO authenticated USING (true);

-- US-38 & US-39: Ulasan dan rating
CREATE TABLE IF NOT EXISTS public.ulasan (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  produk_id bigint NOT NULL REFERENCES public.produk(id) ON DELETE CASCADE,
  nama_pengirim text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  isi text NOT NULL,
  disetujui boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ulasan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_baca_ulasan" ON public.ulasan;
DROP POLICY IF EXISTS "publik_tambah_ulasan" ON public.ulasan;
DROP POLICY IF EXISTS "admin_ubah_ulasan" ON public.ulasan;
DROP POLICY IF EXISTS "admin_hapus_ulasan" ON public.ulasan;
CREATE POLICY "admin_baca_ulasan" ON public.ulasan FOR SELECT TO authenticated USING (true);
CREATE POLICY "publik_tambah_ulasan" ON public.ulasan FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_ubah_ulasan" ON public.ulasan FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_hapus_ulasan" ON public.ulasan FOR DELETE TO authenticated USING (true);

-- US-40 & US-41: Catat klik WhatsApp
CREATE TABLE IF NOT EXISTS public.klik_wa (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  produk_id bigint NOT NULL REFERENCES public.produk(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.klik_wa ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_baca_klik" ON public.klik_wa;
DROP POLICY IF EXISTS "publik_tambah_klik" ON public.klik_wa;
CREATE POLICY "admin_baca_klik" ON public.klik_wa FOR SELECT TO authenticated USING (true);
CREATE POLICY "publik_tambah_klik" ON public.klik_wa FOR INSERT TO authenticated WITH CHECK (true);

-- US-42: Banner promo
CREATE TABLE IF NOT EXISTS public.banner (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  judul text NOT NULL,
  deskripsi text,
  gambar_url text NOT NULL,
  link text,
  aktif boolean NOT NULL DEFAULT true,
  urutan integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.banner ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_baca_banner" ON public.banner;
DROP POLICY IF EXISTS "admin_tambah_banner" ON public.banner;
DROP POLICY IF EXISTS "admin_ubah_banner" ON public.banner;
DROP POLICY IF EXISTS "admin_hapus_banner" ON public.banner;
CREATE POLICY "admin_baca_banner" ON public.banner FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_tambah_banner" ON public.banner FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_ubah_banner" ON public.banner FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_hapus_banner" ON public.banner FOR DELETE TO authenticated USING (true);

-- US-43: Pengaturan toko
CREATE TABLE IF NOT EXISTS public.pengaturan_toko (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nama text NOT NULL,
  tagline text,
  nomor_wa text NOT NULL,
  alamat text,
  jam_buka text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pengaturan_toko ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_baca_pengaturan" ON public.pengaturan_toko;
DROP POLICY IF EXISTS "admin_ubah_pengaturan" ON public.pengaturan_toko;
CREATE POLICY "admin_baca_pengaturan" ON public.pengaturan_toko FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_ubah_pengaturan" ON public.pengaturan_toko FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
-- Sisipkan data awal
INSERT INTO public.pengaturan_toko (nama, tagline, nomor_wa, alamat, jam_buka)
SELECT 'Dapur Bunda',
       'Aneka Makanan & Minuman yang dibuat dengan cinta dan bahan pilihan, siap dipesan lewat WhatsApp.',
       '6289623467477',
       'Jl. Harapan Kita, RW 15 RW 18 RT 01 RW 06, Desa Cibitung Wetan, Kecamatan Cibitung, Kabupaten Bekasi, Jawa Barat, Indonesia',
       'Senin-Jumat, 08.00–20.00'
WHERE NOT EXISTS (SELECT 1 FROM public.pengaturan_toko);

-- US-45: Log aktivitas admin
CREATE TABLE IF NOT EXISTS public.log_aktivitas (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_email text NOT NULL,
  aksi text NOT NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.log_aktivitas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_baca_log" ON public.log_aktivitas;
DROP POLICY IF EXISTS "admin_tambah_log" ON public.log_aktivitas;
CREATE POLICY "admin_baca_log" ON public.log_aktivitas FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_tambah_log" ON public.log_aktivitas FOR INSERT TO authenticated WITH CHECK (true);

-- US-48: Varian harga per ukuran
CREATE TABLE IF NOT EXISTS public.varian_produk (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  produk_id bigint NOT NULL REFERENCES public.produk(id) ON DELETE CASCADE,
  nama text NOT NULL,
  harga integer NOT NULL CHECK (harga >= 0),
  stok integer NOT NULL DEFAULT -1,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.varian_produk ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_baca_varian" ON public.varian_produk;
DROP POLICY IF EXISTS "admin_tambah_varian" ON public.varian_produk;
DROP POLICY IF EXISTS "admin_ubah_varian" ON public.varian_produk;
DROP POLICY IF EXISTS "admin_hapus_varian" ON public.varian_produk;
CREATE POLICY "admin_baca_varian" ON public.varian_produk FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_tambah_varian" ON public.varian_produk FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_ubah_varian" ON public.varian_produk FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_hapus_varian" ON public.varian_produk FOR DELETE TO authenticated USING (true);
