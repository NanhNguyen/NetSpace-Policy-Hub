import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PWARegistration from "@/components/PWARegistration";
import AuthToastListener from "@/components/AuthToastListener";
import { Toaster } from 'react-hot-toast';

const zona = localFont({
  src: [
    {
      path: "../../public/fonts/SVN-ZonaPro/SVN-ZonaPro-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/SVN-ZonaPro/SVN-ZonaPro-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/SVN-ZonaPro/SVN-ZonaPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SVN-ZonaPro/SVN-ZonaPro-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/SVN-ZonaPro/SVN-ZonaPro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/SVN-ZonaPro/SVN-ZonaPro-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/SVN-ZonaPro/SVN-ZonaPro-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-zona",
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
      <body className={`${zona.variable} font-sans antialiased bg-bg-light text-text-main`}>
        <Toaster position="bottom-right" reverseOrder={false} />
        <PWARegistration />
        <AuthToastListener />
        {children}
      </body>
    </html>
  );
}
