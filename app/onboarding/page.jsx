"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();

  async function selectRole(role) {
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      toast.success("Role selected successfully");

      const meRes = await fetch("/api/me");
      const me = await meRes.json();

      if (me.role === "CUSTOMER") {
        router.push("/dashboard");
      }

      if (me.role === "SPECIALIST") {
        router.push("/jobs");
      }
    } catch {
      toast.error("Network error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F7F6F3] px-6">
      <div className="w-full max-w-5xl">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-[#1F1F1F] mb-3">
            Choose how you want to use ServeX
          </h1>
          <p className="text-[#5F5F5F] text-base">
            Select your role to continue. You can’t change this later.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer */}
          <div className="bg-white border border-[#E2E2E2] rounded-xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#1F1F1F] mb-4">
                Customer
              </h2>
              <ul className="space-y-2 text-[#4F4F4F] text-sm">
                <li>• Create service requests</li>
                <li>• Track request progress</li>
                <li>• Manage your services</li>
              </ul>
            </div>

            <button
              onClick={() => selectRole("CUSTOMER")}
              className="mt-8 w-full rounded-lg bg-[#59584A] text-white py-3 text-sm font-medium hover:opacity-90 transition"
            >
              Continue as Customer
            </button>
          </div>

          {/* Specialist */}
          <div className="bg-white border border-[#E2E2E2] rounded-xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#1F1F1F] mb-4">
                Specialist
              </h2>
              <ul className="space-y-2 text-[#4F4F4F] text-sm">
                <li>• Browse available jobs</li>
                <li>• Accept service requests</li>
                <li>• Complete and manage tasks</li>
              </ul>
            </div>

            <button
              onClick={() => selectRole("SPECIALIST")}
              className="mt-8 w-full rounded-lg bg-[#59584A] text-white py-3 text-sm font-medium hover:opacity-90 transition"
            >
              Continue as Specialist
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
