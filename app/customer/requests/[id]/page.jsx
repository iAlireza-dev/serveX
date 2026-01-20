"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CustomerRequestDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/customer/requests/${id}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load request");
        }
        return data;
      })
      .then((data) => {
        setRequest(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  }, [id]);

  async function handleCancel() {
    setCancelling(true);

    try {
      const res = await fetch(`/api/customer/requests/${id}/cancel`, {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Could not cancel request");
        return;
      }

      toast.success("Request cancelled");
      router.push("/customer/requests");
      router.refresh?.();
    } catch {
      toast.error("Network error");
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-[#E2E2E2] rounded-xl p-10 text-center">
        <p className="text-sm text-[#6B6B6B]">Loading request...</p>
      </div>
    );
  }

  if (!request) return null;

  const canCancel = request.status === "OPEN" || request.status === "ASSIGNED";
  const canEdit = request.status === "OPEN" || request.status === "ASSIGNED";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-[#1F1F1F]">
          {request.title}
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">
          £{request.pricePerHour} / hour
        </p>
      </header>

      {/* Card */}
      <div className="bg-white border border-[#E2E2E2] rounded-xl p-8 space-y-8">
        <div>
          <h3 className="text-sm font-medium text-[#1F1F1F] mb-2">
            Description
          </h3>
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            {request.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#EDEDED]">
          {/* Status */}
          <span
            className={`text-xs px-3 py-1 rounded-full border ${
              request.status === "OPEN"
                ? "border-[#4D688C] text-[#4D688C]"
                : request.status === "ASSIGNED"
                  ? "border-yellow-600 text-yellow-600"
                  : request.status.startsWith("CANCELLED")
                    ? "border-red-600 text-red-600"
                    : "border-green-600 text-green-600"
            }`}
          >
            {request.status}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {canEdit && (
              <button
                onClick={() => router.push(`/customer/requests/${id}/edit`)}
                className="rounded-lg border border-[#4D688C] text-[#4D688C] px-6 py-3 text-sm font-medium hover:bg-[#4D688C]/10 transition"
              >
                Edit request
              </button>
            )}

            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="rounded-lg bg-red-600 text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Cancel request"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mt-6 text-sm text-[#4D688C] hover:underline"
      >
        Back to requests
      </button>
    </div>
  );
}
