'use client';

import { useEffect, useMemo, useState } from "react";

import type { Job } from "@/lib/jobStore";

type JobPayload = {
  title: string;
  company: string;
  location: string;
  externalUrl: string;
  summary: string;
  tags: string;
  slug: string;
  batch: string;
  eligibility: string;
  ctc: string;
  otherDetails: string;
};

type JobListItem = Job;

type Props = {
  onLogout?: () => void;
};

const initialState: JobPayload = {
  title: "",
  company: "",
  location: "",
  externalUrl: "",
  summary: "",
  tags: "",
  slug: "",
  batch: "",
  eligibility: "",
  ctc: "",
  otherDetails: "",
};

export function AdminConsole({ onLogout }: Props) {
  const [form, setForm] = useState<JobPayload>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [deleteState, setDeleteState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/jobs");
      const data = (await res.json()) as { jobs?: JobListItem[] };
      setJobs(data.jobs ?? []);
    })();
  }, []);

  const recentUrlPreview = useMemo(() => {
    if (!form.slug) return "/your-custom-slug";
    return `/${form.slug}`;
  }, [form.slug]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location,
        externalUrl: form.externalUrl,
        summary: form.summary,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        slug: form.slug,
        batch: form.batch.trim() || undefined,
        eligibility: form.eligibility.trim() || undefined,
        ctc: form.ctc.trim() || undefined,
        otherDetails: form.otherDetails.trim() || undefined,
      };

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as JobListItem;

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save job.");
      }

      setJobs((prev) => [data, ...prev]);
      setForm(initialState);
      setMessage("Job link published ✅");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save job");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug: string) {
    const confirmDelete = window.confirm(
      "Delete this job link? This cannot be undone.",
    );
    if (!confirmDelete) return;

    setDeleteState((prev) => ({ ...prev, [slug]: true }));
    setMessage(null);

    try {
      const response = await fetch("/api/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete job.");
      }

      setJobs((prev) => prev.filter((job) => job.slug !== slug));
      setMessage("Job removed 🗑️");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleteState((prev) => ({ ...prev, [slug]: false }));
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <main className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-lime-300">
                Admin dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-white">
                Publish a new job link
              </h1>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-lime-300 hover:text-lime-200"
              >
                Logout
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Create a friendly URL like <span className="text-white">/infosys</span> that
            opens a dedicated job page.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {([
              { label: "Job title", name: "title", type: "text" },
              { label: "Company", name: "company", type: "text" },
              { label: "Location", name: "location", type: "text" },
              { label: "External job link", name: "externalUrl", type: "url" },
            ] satisfies Array<{
              label: string;
              name: keyof JobPayload;
              type: string;
            }>).map((field) => (
              <label key={field.name} className="block text-sm font-medium">
                {field.label}
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  required={["title", "company", "externalUrl"].includes(
                    field.name,
                  )}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.name]: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder-white/40 focus:border-lime-300 focus:outline-none"
                />
              </label>
            ))}

            <label className="block text-sm font-medium">
              Short summary
              <textarea
                name="summary"
                rows={4}
                value={form.summary}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, summary: event.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder-white/40 focus:border-lime-300 focus:outline-none"
                placeholder="60-80 characters about the job"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              {(
                [
                  {
                    label: "Target batch",
                    name: "batch",
                    placeholder: "e.g., 2024/2025",
                  },
                  {
                    label: "Eligibility criteria",
                    name: "eligibility",
                    placeholder: "B.E / B.Tech with 7 CGPA",
                  },
                  { label: "CTC / stipend", name: "ctc", placeholder: "₹6-8 LPA" },
                ] satisfies Array<{
                  label: string;
                  name: "batch" | "eligibility" | "ctc";
                  placeholder: string;
                }>
              ).map((field) => (
                <label key={field.name} className="block text-sm font-medium">
                  {field.label}
                  <input
                    type="text"
                    name={field.name}
                    value={form[field.name]}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.name]: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder-white/40 focus:border-lime-300 focus:outline-none"
                    placeholder={field.placeholder}
                  />
                </label>
              ))}
            </div>

            <label className="block text-sm font-medium">
              Other details / notes
              <textarea
                name="otherDetails"
                rows={3}
                value={form.otherDetails}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, otherDetails: event.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder-white/40 focus:border-lime-300 focus:outline-none"
                placeholder="Interview rounds, deadlines, documents to carry..."
              />
            </label>

            <label className="block text-sm font-medium">
              Tags (comma separated)
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tags: event.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder-white/40 focus:border-lime-300 focus:outline-none"
                placeholder="Freshers, WFH, Product"
              />
            </label>

            <label className="block text-sm font-medium">
              Custom slug
              <div className="mt-2 flex rounded-2xl border border-white/20 bg-white/5 text-base text-white focus-within:border-lime-300">
                <span className="px-4 py-3 text-white/60">your-site.com</span>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  required
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: event.target.value.toLowerCase().replace(/\s+/g, "-"),
                    }))
                  }
                  className="flex-1 rounded-r-2xl bg-transparent px-4 py-3 focus:outline-none"
                  placeholder="/infosys-offcampus"
                />
              </div>
              <p className="mt-1 text-xs text-white/50">
                Preview: {recentUrlPreview}
              </p>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-lime-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-lime-200 disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish job"}
            </button>

            {message && (
              <p className="text-sm text-lime-200" role="status">
                {message}
              </p>
            )}
          </form>
        </section>

        <aside className="rounded-3xl bg-white p-8 text-slate-900 shadow-2xl shadow-slate-200">
          <h2 className="text-xl font-semibold">Latest jobs</h2>
          <p className="text-sm text-slate-500">
            {jobs.length} published links
          </p>
          <div className="mt-6 space-y-4 overflow-y-auto">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="space-y-3 rounded-2xl border border-slate-100 p-4 text-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{job.title}</p>
                    <p className="text-slate-500">{job.company}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(job.postedAt).toLocaleString()} • /{job.slug}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(job.slug)}
                    disabled={Boolean(deleteState[job.slug])}
                    className="self-start rounded-full border border-red-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {deleteState[job.slug] ? "Deleting..." : "Delete"}
                  </button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="min-w-full table-auto text-xs">
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
                          value: job.otherDetails ?? "Review job post",
                        },
                      ].map((item) => (
                        <tr
                          key={item.label}
                          className="border-b border-slate-100 text-[11px] last:border-b-0 sm:text-xs"
                        >
                          <th className="w-32 bg-slate-50 px-3 py-2 text-left font-semibold uppercase tracking-wide text-slate-500 sm:w-1/3">
                            {item.label}
                          </th>
                          <td className="px-3 py-2 text-slate-800">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                Publish your first job to see it here.
              </p>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

