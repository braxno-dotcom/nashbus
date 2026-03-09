import type { Metadata, Viewport } from "next";
import { i18n } from "@/i18n/config";
import "../globals.css";
import RegisterSW from "@/components/RegisterSW";

export const metadata: Metadata = {
  title: "NashBus — Перевезення Україна-Європа-Молдова",
  description:
    "Агрегатор пасажирських перевезень та посилок між Україною, Європою та Молдовою",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NashBus",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
