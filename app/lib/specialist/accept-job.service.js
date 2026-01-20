import { prisma } from "../db/prisma";

export async function acceptJob({ jobId, specialistId }) {
  const result = await prisma.request.updateMany({
    where: {
      id: jobId,
      status: "OPEN",
      specialistId: null,
    },
    data: {
      specialistId,
      status: "ASSIGNED",
    },
  });

  return result;
}
