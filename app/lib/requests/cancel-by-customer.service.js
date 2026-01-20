import { prisma } from "../db/prisma";

export async function cancelRequestByCustomer(requestId, customerId) {
  const request = await prisma.request.findUnique({
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
    return request;
  }

  const updatedRequest = await prisma.request.update({
    where: { id: requestId },

    select: {
      id: true,
      status: true,
      updatedAt: true,
    },

    data: {
      specialistId: null,
      status: "CANCELLED_BY_CUSTOMER",
    },
  });

  return updatedRequest;
}
