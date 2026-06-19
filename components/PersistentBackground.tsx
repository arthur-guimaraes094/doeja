"use client";

import React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const FloatingVegetables2D = dynamic(
  () => import("./FloatingVegetables2D"),
  { ssr: false }
);

export default function PersistentBackground() {
  const pathname = usePathname();

  // Omit background animation on docs/developer pages
  if (pathname?.startsWith("/docs")) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-85">
      <FloatingVegetables2D />
    </div>
  );
}
