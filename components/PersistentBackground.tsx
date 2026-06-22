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

  // Render background animation exclusively on the home page
  if (pathname !== "/") {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-85">
      <FloatingVegetables2D />
    </div>
  );
}
