"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.message || "Login failed");
      return;
    }

    const data = await res.json();
    toast.success("Welcome back");

    if (!data.role) {
      router.push("/onboarding");
      return;
    }

    if (data.role === "CUSTOMER") {
      router.push("/customer");
      return;
    }

    if (data.role === "SPECIALIST") {
      router.push("/specialist");
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF7] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl border border-neutral-200"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-neutral-900">
            Sign in to ServeX
          </h1>
          <p className="text-sm text-neutral-500">
            Access your service dashboard
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-neutral-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-neutral-300 px-4 py-3 text-neutral-900 outline-none focus:border-[#59584A]"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-neutral-600">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-neutral-300 px-4 py-3 text-neutral-900 outline-none focus:border-[#59584A]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#59584A] text-white py-3 text-base font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
