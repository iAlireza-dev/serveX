import { prisma } from "@/app/lib/db/prisma";

export async function completeJob({ jobId, specialistId }) {
  const result = await prisma.request.updateMany({
    where: {
      id: jobId,
      specialistId: specialistId,
      status: "ASSIGNED",
    },
    data: {
      status: "COMPLETED",
    },
  });

  return result;
}