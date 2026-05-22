import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StokCerdas - Prediksi Restock UMKM",
  description:
    "Landing page StokCerdas untuk manajemen inventaris dan prediksi restock berbasis AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
