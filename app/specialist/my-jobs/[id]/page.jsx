"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MyJobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    fetch(`/api/specialist/my-jobs/${id}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load job");
        }

        return data;
      })
      .then((data) => {
        setJob(data);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  async function handleFinish() {
    setFinishing(true);

    try {
      const res = await fetch(`/api/specialist/jobs/${id}/complete`, {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Could not complete job");
      }

      toast.success("Job completed");
      router.push("/specialist/my-jobs");
      router.refresh?.();
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setFinishing(false);
    }
  }

  async function handleCancel() {
    setCancelling(true);

    try {
      const res = await fetch(`/api/specialist/jobs/${id}/cancel`, {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Could not cancel job");
      }

      toast.success("Job cancelled");
      router.push("/specialist");
      router.refresh?.();
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setCancelling(false);
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
          <span
            className={`text-xs px-3 py-1 rounded-full border ${
              job.status === "ASSIGNED"
                ? "border-[#4D688C] text-[#4D688C]"
                : job.status === "COMPLETED"
                  ? "border-green-600 text-green-600"
                  : "border-neutral-400 text-neutral-400"
            }`}
          >
            {job.status}
          </span>

          {job.status === "ASSIGNED" && (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="rounded-lg border border-red-600 text-red-600 px-5 py-2 text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Cancel job"}
              </button>

              <button
                onClick={handleFinish}
                disabled={finishing}
                className="rounded-lg bg-green-600 text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {finishing ? "Finishing..." : "Finish this job"}
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => router.back()}
        className="mt-6 text-sm text-[#4D688C] hover:underline"
      >
        Back
      </button>
    </div>
  );
}
