"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load users");
        }
        return data;
      })
      .then((data) => {
        setUsers(data);
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
        <p className="text-sm text-neutral-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Users</h1>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b">
            <tr className="text-left text-neutral-600">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Customer Requests</th>
              <th className="px-4 py-3">Assigned Jobs</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b last:border-b-0 hover:bg-neutral-50 transition"
              >
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.role || "—"}</td>
                <td className="px-4 py-3">{u._count.customerRequests}</td>
                <td className="px-4 py-3">{u._count.assignedRequests}</td>
                <td className="px-4 py-3">{u.isActive ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
