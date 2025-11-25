import { JobCard } from "./JobCard";

import type { Job } from "@/lib/jobStore";

type Props = {
  jobs: Job[];
  emptyMessage?: string;
};

export function JobList({ jobs, emptyMessage }: Props) {
  if (jobs.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-200 bg-white/50 p-6 text-center text-sm text-zinc-500">
        {emptyMessage ?? "No jobs yet. Check back soon!"}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

