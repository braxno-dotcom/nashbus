import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import Header from "@/components/Header";
import FreightBoard from "@/components/FreightBoard";

export default async function FreightPage({
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
          <FreightBoard dict={dict} />
        </div>
      </div>
    </div>
  );
}
