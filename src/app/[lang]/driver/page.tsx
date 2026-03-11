import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import Header from "@/components/Header";
import DriverPageClient from "@/components/DriverPageClient";

export default async function DriverPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={lang as Locale} dict={dict} />
      <div className="pt-12 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <DriverPageClient dict={dict} lang={lang} />
        </div>
      </div>
    </div>
  );
}
