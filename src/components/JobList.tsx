'use client';

import { useState } from "react";

import { JobCard } from "./JobCard";

import type { Job } from "@/lib/jobStore";

type Props = {
  jobs: Job[];
  emptyMessage?: string;
};

const INITIAL_DISPLAY_COUNT = 10;

export function JobList({ jobs, emptyMessage }: Props) {
  const [showAll, setShowAll] = useState(false);

  if (jobs.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-200 bg-white/50 p-6 text-center text-sm text-zinc-500">
        {emptyMessage ?? "No jobs yet. Check back soon!"}
      </p>
    );
  }

  const displayedJobs = showAll ? jobs : jobs.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMore = jobs.length > INITIAL_DISPLAY_COUNT;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {displayedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      {hasMore && !showAll && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowAll(true)}
            className="rounded-full border-2 border-indigo-500 bg-white px-6 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-500 hover:text-white"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}

