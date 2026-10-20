import { buatKoneksiServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

// US-27: sitemap.xml otomatis dari database
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://katalog-umkm.vercel.app";

  let produkUrls = [];
  try {
    const supabase = buatKoneksiServer();
    const { data } = await supabase.from("produk").select("id, created_at");
    if (data) {
      produkUrls = data.map((p) => ({
        url: `${baseUrl}/produk/${p.id}`,
        lastModified: new Date(p.created_at),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch {
    /* empty */
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...produkUrls,
  ];
}
