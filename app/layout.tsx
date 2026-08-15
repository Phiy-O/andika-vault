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
  return {
    title: settings?.siteTitle ?? "Andika | Portofolio",
    description:
      settings?.metaDescription ??
      "The portfolio and journal of Andika, a software engineer creating thoughtful digital products.",
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
