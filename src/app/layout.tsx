import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BusHub — Перевозки Украина-Европа",
  description: "Агрегатор пассажирских перевозок и посылок между Украиной и Европой",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
