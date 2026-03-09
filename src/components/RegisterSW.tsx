"use client";

import { useEffect } from "react";
import { basePath } from "@/lib/base-path";

export default function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(`${basePath}/sw.js`).catch(() => {});
    }
  }, []);
  return null;
}
