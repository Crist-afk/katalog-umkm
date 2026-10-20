// US-27: robots.txt yang menunjuk ke sitemap
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://katalog-umkm.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
