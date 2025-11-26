import Link from "next/link";

import type { Job } from "@/lib/jobStore";

type Props = {
  job: Job;
};

export function JobCard({ job }: Props) {
  return (
    <article className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm shadow-sm">
      <div className="flex flex-col">
        <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-400">
          {new Date(job.postedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })}
        </p>
        <span className="text-base font-semibold text-zinc-900">
          {job.title}
        </span>
        <span className="text-xs text-zinc-500">{job.company}</span>
      </div>
      <Link
        href={`/${job.slug}`}
        className="rounded-full border border-indigo-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-600 transition hover:border-blue-500 hover:bg-blue-500 hover:text-white"
      >
        Click link
      </Link>
    </article>
  );
}

