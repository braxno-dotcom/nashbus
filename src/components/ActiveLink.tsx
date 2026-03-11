"use client";

import { usePathname } from "next/navigation";

interface ActiveLinkProps {
  href: string;
  activeClass: string;
  defaultClass: string;
  className?: string;
  children: React.ReactNode;
}

export default function ActiveLink({ href, activeClass, defaultClass, className = "", children }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname === href.replace(/\/$/, "");

  return (
    <a href={href} className={`${className} ${isActive ? activeClass : defaultClass}`}>
      {children}
    </a>
  );
}
