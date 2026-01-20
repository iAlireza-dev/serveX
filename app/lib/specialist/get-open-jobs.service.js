export async function getOpenJobs() {
  const jobs = await prisma.request.findMany({
    where: {
      status: "OPEN",
      specialistId: null,
    },
    orderBy: { createdAt: "desc" },
  });
  return jobs;
}
