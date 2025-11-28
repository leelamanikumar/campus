import Link from "next/link";

import { JobList } from "@/components/JobList";
import { getJobs } from "@/lib/jobStore";
import { getResources } from "@/lib/resourceStore";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [jobs, resources] = await Promise.all([getJobs(), getResources()]);
  const featuredResources = resources.slice(0, 4);

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
          Find fresh hiring updates from TCS, Infosys, Wipro, Accenture & top MNCs. <br />
            <span className="font-semibold text-zinc-900">
            You can explore job updates, interview experiences, and curated interview materials all in one place
            </span>
            .
          </p>
        </header>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-400">
                Interview Hub
              </p>
              <h2 className="text-2xl font-semibold text-zinc-950">
                Resources to kick-start your preparation
              </h2>
            </div>
            <Link
              href="/resources"
              className="rounded-full border border-indigo-200 px-4 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
            >
              More
            </Link>
          </div>

          {featuredResources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/60 p-6 text-center text-sm text-zinc-500">
              Resources are coming soon.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-400">
                    {resource.tags.join(" • ") || "Interview prep"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                    {resource.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600">
                    {resource.summary}
                  </p>
                  <Link
                    href={`/resources/${resource.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:underline"
                  >
                    Explore →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">
              Recently uploaded links
            </h2>
            <p className="text-sm text-zinc-500">
              {jobs.length} job{jobs.length === 1 ? "" : "s"} total
            </p>
          </div>

          <JobList jobs={jobs} />
        </section>
      </main>
    </div>
  );
}
