"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SpecialistLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const linkClass = (href) =>
    `block px-4 py-3 rounded-lg text-sm font-medium transition ${
      pathname === href
        ? "bg-white text-[#4D688C]"
        : "text-white hover:bg-white/10"
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
        <h2 className="text-xl font-semibold text-white mb-10">ServeX</h2>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <Link href="/specialist" className={linkClass("/specialist")}>
            Available Jobs
          </Link>

          <Link
            href="/specialist/my-jobs"
            className={linkClass("/specialist/my-jobs")}
          >
            My Jobs
          </Link>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 rounded-lg border border-red-400/30 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 px-10 py-8">{children}</main>
    </div>
  );
}
