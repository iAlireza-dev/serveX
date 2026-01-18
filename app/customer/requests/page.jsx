"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CustomerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/requests")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const statusStyle = (status) => {
    if (status === "OPEN") {
      return "border-[#4D688C] text-[#4D688C]";
    }
    if (status === "ASSIGNED") {
      return "border-green-600 text-green-600";
    }
    return "border-neutral-400 text-neutral-400";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F1F1F]">
            Your service requests
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Manage and track your service requests
          </p>
        </div>

        {!loading && requests.length > 0 && (
          <Link
            href="/customer/requests/new"
            className="rounded-lg bg-[#59584A] text-white px-5 py-3 text-sm font-medium hover:opacity-90 transition"
          >
            New request
          </Link>
        )}
      </header>
      {loading ? (
        <div className="bg-white border border-[#E2E2E2] rounded-xl p-10 text-center">
          <p className="text-sm text-[#6B6B6B]">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-[#E2E2E2] rounded-xl p-10 text-center">
          <p className="text-[#6B6B6B] mb-6">
            You haven’t created any service requests yet.
          </p>
          <Link
            href="/customer/requests/new"
            className="inline-block rounded-lg bg-[#59584A] text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition"
          >
            Create your first request
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <Link
              key={req.id}
              href={`/customer/requests/${req.id}`}
              className="block bg-white border border-[#E2E2E2] rounded-xl p-6 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-[#1F1F1F]">
                    {req.title}
                  </h3>
                  <p className="text-sm text-[#6B6B6B] mt-1">
                    £{req.pricePerHour} / hour
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full border ${statusStyle(
                    req.status,
                  )}`}
                >
                  {req.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
