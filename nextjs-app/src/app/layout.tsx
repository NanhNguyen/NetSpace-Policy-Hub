import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PWARegistration from "@/components/PWARegistration";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NetSpace Policy Hub — Tra cứu Chính sách Nội bộ",
    template: "%s — NetSpace Policy Hub",
  },
  description:
    "Trung tâm tra cứu chính sách nội bộ NetSpace. Mọi quy định, hướng dẫn và phúc lợi — tất cả ở một nơi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} antialiased bg-bg-light text-text-main`}>
        <PWARegistration />
        <Header />
        <div className="min-h-[calc(100vh-80px)]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
