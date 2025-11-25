import Link from "next/link";
import { notFound } from "next/navigation";

import { JobCard } from "@/components/JobCard";
import { getJobBySlug, getJobs } from "@/lib/jobStore";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const jobs = await getJobs();
  const otherJobs = jobs.filter((j) => j.id !== job.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <main className="mx-auto flex max-w-4xl flex-col gap-8">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← back to recent jobs
        </Link>
        <section className="rounded-3xl bg-white p-8 shadow-lg shadow-zinc-200">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-400">
            {job.company}
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-zinc-950">
            {job.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{job.location}</p>
          <p className="mt-6 text-base text-zinc-700">{job.summary}</p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-100">
            <table className="min-w-full table-auto text-sm">
              <tbody>
                {[
                  { label: "Role", value: job.title },
                  { label: "Company", value: job.company },
                  { label: "Batch", value: job.batch ?? "Not specified" },
                  {
                    label: "Eligibility Criteria",
                    value: job.eligibility ?? "Refer to official link",
                  },
                  { label: "CTC", value: job.ctc ?? "Not disclosed" },
                  {
                    label: "Other Details",
                    value: job.otherDetails ?? "Please review the job post",
                  },
                ].map((item) => (
                  <tr
                    key={item.label}
                    className="border-b border-zinc-100 last:border-b-0"
                  >
                    <th className="w-36 bg-zinc-50 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500 sm:w-1/3 sm:text-xs">
                      {item.label}
                    </th>
                    <td className="px-4 py-3 text-sm text-zinc-800 sm:text-base">
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-medium text-indigo-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={job.externalUrl}
              target="_blank"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Visit official job link
            </Link>
            <div className="rounded-full border border-zinc-200 px-4 py-3 text-sm text-zinc-500">
              Share link:{" "}
              <span className="font-medium text-zinc-900">
                {`/${job.slug}`}
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900">
              Recent job updates
            </h2>
            <Link
              href="/"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {otherJobs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-200 bg-white/70 p-6 text-center text-sm text-zinc-500">
              More openings will appear here soon.
            </p>
          ) : (
            <div className="space-y-3">
              {otherJobs.map((item) => (
                <JobCard key={item.id} job={item} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

