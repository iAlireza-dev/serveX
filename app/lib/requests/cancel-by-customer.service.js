import { prisma } from "../db/prisma";

export async function cancelRequestByCustomer(requestId, customerId) {
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
      throw new Error("CANNOT_CANCEL_COMPLETED_REQUEST");
    }

    if (request.status !== "OPEN" && request.status !== "ASSIGNED") {
      throw new Error("INVALID_REQUEST_STATE");
    }

    if (request.status === "CANCELLED_BY_CUSTOMER") {
      return {
        id: request.id,
        status: request.status,
        updatedAt: request.updatedAt,
      };
    }

    const updatedRequest = await tx.request.update({
      where: { id: requestId },
      data: {
        specialistId: null,
        status: "CANCELLED_BY_CUSTOMER",
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    return updatedRequest;
  });
}