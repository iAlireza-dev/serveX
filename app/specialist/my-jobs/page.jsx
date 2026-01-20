"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/specialist/my-jobs")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load your jobs");
        setLoading(false);
      });
  }, []);

  const statusBadge = (status) => {
    if (status === "ASSIGNED") {
      return "border-[#4D688C] text-[#4D688C]";
    }
    if (status === "COMPLETED") {
      return "border-green-600 text-green-600";
    }
    return "border-neutral-400 text-neutral-400";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-[#1F1F1F]">My jobs</h1>
        <p className="text-sm text-[#6B6B6B] mt-1">
          Jobs you have accepted and are working on
        </p>
      </header>

      {loading ? (
        <div className="bg-white border border-[#E2E2E2] rounded-xl p-10 text-center">
          <p className="text-sm text-[#6B6B6B]">Loading your jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-[#E2E2E2] rounded-xl p-10 text-center">
          <p className="text-[#6B6B6B]">You haven’t accepted any jobs yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/specialist/my-jobs/${job.id}`}
              className="block bg-white border border-[#E2E2E2] rounded-xl p-6 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-[#1F1F1F]">
                    {job.title}
                  </h3>
                  <p className="text-sm text-[#6B6B6B] mt-1">
                    £{job.pricePerHour} / hour
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full border ${statusBadge(
                    job.status,
                  )}`}
                >
                  {job.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
