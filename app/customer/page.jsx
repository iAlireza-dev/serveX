export default function CustomerDashboard() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold text-[#1F1F1F]">
          Welcome to your dashboard
        </h1>
        <p className="text-[#5F5F5F] mt-2">
          Manage your service requests and track progress
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-[#E2E2E2] bg-white p-6">
          <p className="text-sm text-[#5F5F5F]">Active requests</p>
          <p className="text-2xl font-semibold text-[#1F1F1F] mt-2">0</p>
        </div>

        <div className="rounded-xl border border-[#E2E2E2] bg-white p-6">
          <p className="text-sm text-[#5F5F5F]">Completed services</p>
          <p className="text-2xl font-semibold text-[#1F1F1F] mt-2">0</p>
        </div>

        <div className="rounded-xl border border-[#E2E2E2] bg-white p-6">
          <p className="text-sm text-[#5F5F5F]">Next step</p>
          <p className="mt-2 text-sm text-[#4A6FA5]">
            Create your first request
          </p>
        </div>
      </section>
    </div>
  );
}
