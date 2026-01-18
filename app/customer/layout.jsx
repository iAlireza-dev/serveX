"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerLayout({ children }) {
  const pathname = usePathname();

  const navItem = (href, label) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`block rounded-lg px-4 py-2 text-sm transition ${
          active ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-[#FFFBF7]">
      <aside className="w-64 bg-[#4D688C] p-6">
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-white">ServeX</h2>
          <p className="text-xs text-white/70">Customer panel</p>
        </div>

        <nav className="space-y-2">
          {navItem("/customer", "Dashboard")}
          {navItem("/customer/requests", "My requests")}
        </nav>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
