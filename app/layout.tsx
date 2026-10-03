import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { getSiteSettings } from "@/src/actions/site-setting";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const calligraphy = Cormorant_Garamond({
  variable: "--font-calligraphy",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  const title = settings?.siteTitle ?? "Andika | Portofolio";
  const description =
    settings?.metaDescription ??
    "The portfolio and journal of Andika, a software engineer creating thoughtful digital products.";
  const siteUrl = process.env.NEXTAUTH_URL || "https://andika.dev";
  const image = `${siteUrl}/images/andika-profile.png`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      type: "website",
      url: siteUrl,
      title,
      description,
      siteName: title,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${calligraphy.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
