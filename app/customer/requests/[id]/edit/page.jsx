"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditRequestPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");

  /* ======================
     Load request details
  ====================== */
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
        setTitle(data.title);
        setDescription(data.description);
        setPricePerHour(String(data.pricePerHour));
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        router.push("/customer/requests");
      });
  }, [id, router]);

  /* ======================
     Submit edit
  ====================== */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !description || !pricePerHour) {
      toast.error("All fields are required");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/customer/requests/${id}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          pricePerHour: Number(pricePerHour),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Update failed");
        setSaving(false);
        return;
      }

      toast.success("Request updated");
      router.push(`/customer/requests/${id}`);
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-[#E2E2E2] rounded-xl p-10 text-center">
        <p className="text-sm text-[#6B6B6B]">Loading request...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-[#1F1F1F]">Edit request</h1>
        <p className="text-sm text-[#6B6B6B] mt-1">Update request details</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E2E2E2] rounded-xl p-8 space-y-6"
      >
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1F1F1F]">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#4D688C]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1F1F1F]">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#4D688C]"
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
            className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-[#4D688C]"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#4D688C] text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-[#4D688C] hover:underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
