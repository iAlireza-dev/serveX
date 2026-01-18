import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFFBF7] text-[#2F2F2F]">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#4D688C] flex items-center select-none">
          Serve
          <span
            className=" text-transparent bg-clip-text animated-gradient animated-x"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #59584A, #4D688C, #59584A)",
            }}
          >
            X
          </span>
        </h1>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link
            href="/signUp"
            className="px-4 py-2 rounded-md bg-[#59584A] text-white hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-20 items-center">
        {/* Text */}
        <div>
          <h2 className="text-5xl font-bold leading-tight">
            Request services.
            <br />
            Manage work.
            <br />
            <span className="text-[#4D688C]">All in one place.</span>
          </h2>

          <p className="mt-6 text-lg text-[#4A4A4A] max-w-xl">
            ServeX helps customers request services and specialists manage jobs
            through a clear, simple, and structured service platform.
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-md bg-[#59584A] text-white font-medium hover:opacity-90 transition"
            >
              Request a Service
            </Link>

            <Link
              href="/signup"
              className="px-6 py-3 rounded-md border border-[#4D688C] text-[#4D688C] hover:bg-[#E9F0FA] transition"
            >
              Become a Specialist
            </Link>
          </div>
        </div>

        {/* Animated X */}
        <div className="flex items-center justify-center">
          <span
            className="text-[200px] font-extrabold leading-none text-transparent bg-clip-text animated-gradient animated-x select-none"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #59584A, #4D688C, #59584A)",
            }}
          >
            X
          </span>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-[#E9F0FA]">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-14">
          <div>
            <h3 className="text-lg font-semibold text-[#4D688C] mb-2">
              Request services easily
            </h3>
            <p className="text-sm text-[#3F3F3F]">
              Create a service request in minutes and clearly describe what you
              need — no phone calls, no confusion.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#4D688C] mb-2">
              Specialists you can rely on
            </h3>
            <p className="text-sm text-[#3F3F3F]">
              Professionals review requests, accept jobs, and complete services
              through a clear and structured workflow.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#4D688C] mb-2">
              Track everything in one place
            </h3>
            <p className="text-sm text-[#3F3F3F]">
              Follow the status of your requests from submission to completion,
              all inside one simple dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h3 className="text-2xl font-semibold mb-14">How ServeX works</h3>

        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <span className="text-[#59584A] font-semibold">01</span>
            <p className="mt-2">
              Customers submit a service request with a clear description.
            </p>
          </div>

          <div>
            <span className="text-[#59584A] font-semibold">02</span>
            <p className="mt-2">
              Specialists review available requests and accept suitable jobs.
            </p>
          </div>

          <div>
            <span className="text-[#59584A] font-semibold">03</span>
            <p className="mt-2">
              The service is completed and tracked through its entire lifecycle.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#4D688C] text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h3 className="text-3xl font-semibold">
            A simple platform for real service work
          </h3>

          <p className="mt-4 text-blue-100">
            Built to keep service requests clear, structured, and easy to
            manage.
          </p>

          <Link
            href="/signup"
            className="inline-block mt-10 px-8 py-3 rounded-md bg-[#59584A] hover:opacity-90 transition"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E9E4DD]">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-[#6A6A6A]">
          © {new Date().getFullYear()} ServeX. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
