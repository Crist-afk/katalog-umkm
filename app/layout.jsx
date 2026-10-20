import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { KeranjangProvider } from "@/context/KeranjangContext";
import { FavoritProvider } from "@/context/FavoritContext";
import { BandingkanProvider } from "@/context/BandingkanContext";
import { toko } from "@/lib/toko";

export const metadata = {
  title: {
    default: toko.nama,
    template: `%s — ${toko.nama}`,
  },
  description: toko.tagline,
  manifest: "/manifest.json",
  themeColor: "#1f6b4f",
  openGraph: {
    siteName: toko.nama,
    locale: "id_ID",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: toko.nama,
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('katalog_umkm_tema');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <KeranjangProvider>
          <FavoritProvider>
            <BandingkanProvider>
              <Header />
              <main className="mx-auto w-full max-w-5xl flex-1 px-4">{children}</main>
              <Footer />
            </BandingkanProvider>
          </FavoritProvider>
        </KeranjangProvider>
      </body>
    </html>
  );
}

