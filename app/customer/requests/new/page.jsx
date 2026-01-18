"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewRequestPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !description || !pricePerHour) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/customer/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          pricePerHour: Number(pricePerHour),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create request");
        setLoading(false);
        return;
      }

      toast.success("Request created successfully");
      router.push("/customer/requests");
    } catch {
      toast.error("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <header className="mb-10">
          <h1 className="text-2xl font-semibold text-[#1F1F1F]">
            Create a new request
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-2">
            Describe the service you need and set your expected rate.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-[#E9F0FA] border border-[#E2E2E2] rounded-xl p-8 space-y-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1F1F1F]">
              Request title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bathroom plumbing repair"
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#59584A]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1F1F1F]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the problem or service in detail"
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#59584A]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1F1F1F]">
              Price per hour (£)
            </label>
            <input
              type="number"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              placeholder="e.g. 40"
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#59584A]"
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#59584A] text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create request"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/customer/requests")}
              className="text-sm text-[#4D688C] hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
