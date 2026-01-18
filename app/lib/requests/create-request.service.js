import { prisma } from "../db/prisma";


export async function createRequest({
  userId,
  title,
  description,
  pricePerHour,
}) {
  const request = await prisma.request.create({
    data: {
      title,
      description,
      pricePerHour,
      status: "OPEN",
      customerId: userId,
      specialistId: null,
    },

    select: {
      id: true,
      title: true,
      pricePerHour: true,
      status: true,
      createdAt: true,
    },
  });

  return request;
}
