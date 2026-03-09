import type { Metadata } from "next";
import { i18n } from "@/i18n/config";
import "../globals.css";

export const metadata: Metadata = {
  title: "NashBus — Перевезення Україна-Європа-Молдова",
  description:
    "Агрегатор пасажирських перевезень та посилок між Україною, Європою та Молдовою",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
