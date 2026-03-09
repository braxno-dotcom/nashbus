import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import Header from "@/components/Header";
import AddTripForm from "@/components/AddTripForm";
import DriverClients from "@/components/DriverClients";

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
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Page title */}
          <div className="text-center py-3">
            <h1 className="text-base font-bold text-gray-800">{dict.nav.addTrip}</h1>
          </div>

          {/* Add trip form */}
          <AddTripForm dict={dict} />

          {/* Clients database */}
          <DriverClients dict={dict} />
        </div>
      </div>
    </div>
  );
}
