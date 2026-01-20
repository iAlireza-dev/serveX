"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CustomerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

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

  async function handleLogout() {
    const res = await fetch("/api/logout", { method: "POST" });

    if (!res.ok) {
      toast.error("Logout failed");
      return;
    }

    toast.success("Logged out");
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex bg-[#FFFBF7]">
      <aside className="w-64 bg-[#4D688C] p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-white">ServeX</h2>
          <p className="text-xs text-white/70">Customer panel</p>
        </div>

        <nav className="space-y-2 flex-1">
          {navItem("/customer", "Dashboard")}
          {navItem("/customer/requests", "My requests")}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-m text-red-400 hover:bg-white/10 hover:text-red-200 transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
