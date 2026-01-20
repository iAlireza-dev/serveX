"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SpecialistJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/specialist/jobs");

        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Failed to load jobs");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setJobs(data);
      } catch {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-[#1F1F1F]">
          Available jobs
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">
          Browse and accept service requests
        </p>
      </header>

      {loading ? (
        <div className="bg-white border border-[#E2E2E2] rounded-xl p-10 text-center">
          <p className="text-sm text-[#6B6B6B]">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-[#E2E2E2] rounded-xl p-10 text-center">
          <p className="text-[#6B6B6B]">No available jobs at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/specialist/jobs/${job.id}`}
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

                <span className="text-xs px-3 py-1 rounded-full border border-[#4D688C] text-[#4D688C]">
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
