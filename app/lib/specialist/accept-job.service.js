import { prisma } from "../db/prisma";

export async function acceptJob({ jobId, specialistId }) {
  return await prisma.$transaction(async (tx) => {
    const job = await tx.request.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new Error("JOB_NOT_FOUND");
    }

    if (job.status !== "OPEN") {
      throw new Error("JOB_NOT_OPEN");
    }

    if (job.specialistId !== null) {
      throw new Error("JOB_ALREADY_ASSIGNED");
    }

    const updatedJob = await tx.request.update({
      where: { id: jobId },
      data: {
        specialistId,
        status: "ASSIGNED",
      },
      select: {
        id: true,
        status: true,
        specialistId: true,
        updatedAt: true,
      },
    });

    return updatedJob;
  });
}
