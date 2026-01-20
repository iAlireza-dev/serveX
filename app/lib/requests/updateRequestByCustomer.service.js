import { prisma } from "../db/prisma";

export async function updateRequestByCustomer(requestId, customerId, data) {
  return await prisma.$transaction(async (tx) => {
    const request = await tx.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new Error("REQUEST_NOT_FOUND");
    }

    if (request.customerId !== customerId) {
      throw new Error("UNAUTHORIZED_ACTION");
    }

    if (request.status === "COMPLETED") {
      throw new Error("CANNOT_EDIT_COMPLETED_REQUEST");
    }

    if (request.status !== "OPEN" && request.status !== "ASSIGNED") {
      throw new Error("INVALID_REQUEST_STATE");
    }

    const updatedRequest = await tx.request.update({
      where: { id: requestId },
      data: {
        title: data.title,
        description: data.description,
        pricePerHour: data.pricePerHour,
      },
      select: {
        id: true,
        title: true,
        description: true,
        pricePerHour: true,
        updatedAt: true,
      },
    });

    return updatedRequest;
  });
}
