"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Navbar from "./Navbar";

const HIDE_NAV_PATHS = ["/login", "/register"];

function NavbarGate() {
  const pathname = usePathname();
  if (HIDE_NAV_PATHS.includes(pathname)) return null;
  return <Navbar />;
}

export default function ConditionalNavbar() {
  return (
    <Suspense fallback={null}>
      <NavbarGate />
    </Suspense>
  );
}
