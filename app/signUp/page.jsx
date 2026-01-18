"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#FFFBF7] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-[#E9E4DD] rounded-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#4D688C]">
            Create your Serve<span className="text-[#59584A]">X</span> account
          </h1>
          <p className="mt-2 text-sm text-[#6A6A6A]">
            Start requesting services or join as a specialist.
          </p>
        </div>

        {success ? (
          <div className="text-center text-sm text-green-600">
            Account created successfully. You can now{" "}
            <Link href="/login" className="underline">
              log in
            </Link>
            .
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#D8D4CE] rounded-md bg-transparent focus:outline-none focus:border-[#4D688C]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[#D8D4CE] rounded-md bg-transparent focus:outline-none focus:border-[#4D688C]"
                required
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2 rounded-md bg-[#59584A] text-white font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-6 text-center text-sm text-[#6A6A6A]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#4D688C] hover:underline">
              Log in
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
