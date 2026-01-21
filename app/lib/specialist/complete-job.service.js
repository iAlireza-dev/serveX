import { prisma } from "@/app/lib/db/prisma";

export async function completeJob({ jobId, specialistId }) {
  return await prisma.$transaction(async (tx) => {
    const job = await tx.request.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new Error("JOB_NOT_FOUND");
    }

    if (job.specialistId !== specialistId) {
      throw new Error("NOT_JOB_OWNER");
    }

    if (job.status === "COMPLETED") {
      throw new Error("JOB_ALREADY_COMPLETED");
    }

    if (job.status !== "ASSIGNED") {
      throw new Error("JOB_NOT_IN_PROGRESS");
    }

    const updatedJob = await tx.request.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    return updatedJob;
  });
}