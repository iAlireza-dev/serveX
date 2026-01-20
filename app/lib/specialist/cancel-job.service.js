import { prisma } from "../db/prisma";

export async function cancelJobBySpecialist(jobId, specialistId) {
  return await prisma.$transaction(async (tx) => {
    const job = await tx.request.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new Error("JOB_NOT_FOUND");
    }

    if (job.status === "COMPLETED") {
      throw new Error("CANNOT_CANCEL_COMPLETED_JOB");
    }

    if (job.status !== "ASSIGNED") {
      throw new Error("JOB_NOT_ASSIGNED");
    }

    if (job.specialistId !== specialistId) {
      throw new Error("NOT_JOB_OWNER");
    }
    const updatedJob = await tx.request.update({
      where: { id: jobId },
      data: {
        status: "OPEN",
        specialistId: null,
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
