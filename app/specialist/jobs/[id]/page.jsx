"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function JobDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    fetch(`/api/specialist/jobs/${id}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const msg = data?.error || data?.message || "Failed to load job";
          throw new Error(msg);
        }

        return data;
      })
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load job");
        setLoading(false);
      });
  }, [id]);

  async function handleAccept() {
    if (!id) return;

    setAccepting(true);

    try {
      const res = await fetch(`/api/specialist/jobs/${id}/accept`, {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || data?.message || "Could not accept job");
        setAccepting(false);
        return;
      }

      toast.success("Job accepted");
      router.push("/specialist/my-jobs");
      router.refresh?.();
    } catch {
      toast.error("Network error");
    } finally {
      setAccepting(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-[#E2E2E2] rounded-xl p-10 text-center">
        <p className="text-sm text-[#6B6B6B]">Loading job...</p>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-[#1F1F1F]">{job.title}</h1>
        <p className="text-sm text-[#6B6B6B] mt-1">
          £{job.pricePerHour} / hour
        </p>
      </header>

      <div className="bg-white border border-[#E2E2E2] rounded-xl p-8 space-y-8">
        <div>
          <h3 className="text-sm font-medium text-[#1F1F1F] mb-2">
            Description
          </h3>
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            {job.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#EDEDED]">
          <span className="text-xs px-3 py-1 rounded-full border border-[#4D688C] text-[#4D688C]">
            {job.status}
          </span>

          {job.status === "OPEN" ? (
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="rounded-lg bg-[#4D688C] text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {accepting ? "Accepting..." : "Accept this job"}
            </button>
          ) : (
            <span className="text-sm text-[#6B6B6B]">
              This job is no longer available.
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => router.back()}
        className="mt-6 text-sm text-[#4D688C] hover:underline"
      >
        Back to jobs
      </button>
    </div>
  );
}