"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

function StatCard({ label, value, helper }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-5">
      <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </span>
      <span className="text-2xl font-semibold text-neutral-900">{value}</span>
      {helper && <span className="text-xs text-neutral-500">{helper}</span>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (res) => {
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const msg = data?.error || data?.message || "Failed to load stats";
          throw new Error(msg);
        }

        return data;
      })
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        setErrorText(err.message);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-6 text-2xl font-semibold text-neutral-900">
          Admin dashboard
        </h1>
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-600">
          Loading stats...
        </div>
      </div>
    );
  }

  if (errorText && !stats) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-6 text-2xl font-semibold text-neutral-900">
          Admin dashboard
        </h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          {errorText}
        </div>
      </div>
    );
  }
  if (!stats) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900">
        Admin dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total users"
          value={stats.totalUsers}
          helper="All registered users"
        />
        <StatCard
          label="Total specialists"
          value={stats.totalSpecialists}
          helper="Users with specialist role"
        />
        <StatCard
          label="Total requests"
          value={stats.totalRequests}
          helper="All service requests"
        />
      </div>
    </div>
  );
}
