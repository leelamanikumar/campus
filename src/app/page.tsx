import { JobList } from "@/components/JobList";
import { getJobs } from "@/lib/jobStore";

export default async function Home() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 px-4 py-16 font-sans text-zinc-900">
      <main className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="rounded-3xl bg-white/80 p-10 shadow-xl shadow-zinc-100">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-400">
            Campus Radar
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-zinc-950">
            Latest job updates in one place
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-zinc-600">
            Track daily hiring notifications from Infosys, TCS, Wipro and more.
            Each link opens with a dedicated page you can share like{" "}
            <span className="font-semibold text-zinc-900">
              yoursite.com/infosys-software-engineer
            </span>
            .
          </p>
        </header>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">
              Recently uploaded links
            </h2>
            <p className="text-sm text-zinc-500">
              {jobs.length} job{jobs.length === 1 ? "" : "s"} listed
            </p>
          </div>

          <JobList jobs={jobs} />
        </section>
      </main>
    </div>
  );
}
