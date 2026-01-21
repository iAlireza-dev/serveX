"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/requests")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load requests");
        }
        return data;
      })
      .then((data) => {
        setRequests(data);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-10 text-center">
        <p className="text-sm text-neutral-500">Loading requests...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Requests</h1>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b">
            <tr className="text-left text-neutral-600">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Specialist</th>
              <th className="px-4 py-3">£ / hour</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r) => (
              <tr
                key={r.id}
                className="border-b last:border-b-0 hover:bg-neutral-50 transition"
              >
                <td className="px-4 py-3">{r.title}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3">{r.customer?.email || "—"}</td>
                <td className="px-4 py-3">{r.specialist?.email || "—"}</td>
                <td className="px-4 py-3">£{r.pricePerHour}</td>
                <td className="px-4 py-3">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
