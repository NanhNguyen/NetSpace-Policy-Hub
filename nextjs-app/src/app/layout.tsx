import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PWARegistration from "@/components/PWARegistration";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NetSpace Policy Hub — Tra cứu Chính sách Nội bộ",
    template: "%s — NetSpace Policy Hub",
  },
  description:
    "Trung tâm tra cứu chính sách nội bộ NetSpace. Mọi quy định, hướng dẫn và phúc lợi — tất cả ở một nơi.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

import { Toaster } from 'react-hot-toast';

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} antialiased bg-bg-light text-text-main`}>
        <Toaster position="top-center" reverseOrder={false} />
        <PWARegistration />
        {children}
      </body>
    </html>
  );
}
