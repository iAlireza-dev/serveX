"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const linkClass = (href) =>
    `block rounded-lg px-4 py-2 text-sm transition ${
      pathname === href
        ? "bg-white/20 text-white"
        : "text-white/80 hover:bg-white/10"
    }`;

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
    <div className="min-h-screen flex bg-[#F7F6F3]">
      <aside className="w-64 bg-[#4D688C] p-6 flex flex-col">
        <h2 className="text-xl font-semibold text-white mb-10">ServeX Admin</h2>

        <nav className="space-y-2 flex-1">
          <Link href="/admin" className={linkClass("/admin")}>
            Dashboard
          </Link>
          <Link href="/admin/users" className={linkClass("/admin/users")}>
            Users
          </Link>
          <Link href="/admin/requests" className={linkClass("/admin/requests")}>
            Requests
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-white/10 hover:text-red-200 transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
