import { i18n } from "@/i18n/config";
import { basePath } from "@/lib/base-path";
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect(`${basePath}/${i18n.defaultLocale}/`);
}
