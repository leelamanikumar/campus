'use client';

import { useEffect, useMemo, useState } from "react";

import type { Job } from "@/lib/jobStore";
import type { Resource } from "@/lib/resourceStore";

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

type ResourceMaterialPayload = {
  title: string;
  url: string;
  type?: string;
};

type ResourcePayload = {
  title: string;
  summary: string;
  description: string;
  tags: string;
  slug: string;
  materials: ResourceMaterialPayload[];
};

const initialResourceState: ResourcePayload = {
  title: "",
  summary: "",
  description: "",
  tags: "",
  slug: "",
  materials: [{ title: "", url: "" }],
};

export function AdminConsole({ onLogout }: Props) {
  const [form, setForm] = useState<JobPayload>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [deleteState, setDeleteState] = useState<Record<string, boolean>>({});

  const [resourceForm, setResourceForm] = useState<ResourcePayload>(
    initialResourceState,
  );
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceMessage, setResourceMessage] = useState<string | null>(null);
  const [resourceDeleteState, setResourceDeleteState] = useState<
    Record<string, boolean>
  >({});
  const [editingResourceSlug, setEditingResourceSlug] = useState<string | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      try {
        const [jobsRes, resourcesRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/resources"),
        ]);

        const jobsData = (await jobsRes.json()) as { jobs?: JobListItem[] };
        const resourcesData = (await resourcesRes.json()) as {
          resources?: Resource[];
        };

        setJobs(jobsData.jobs ?? []);
        setResources(resourcesData.resources ?? []);
      } catch (error) {
        console.error("Failed to load admin data", error);
      }
    })();
  }, []);

  const recentUrlPreview = useMemo(() => {
    if (!form.slug) return "/your-custom-slug";
    return `/${form.slug}`;
  }, [form.slug]);

  const resourceUrlPreview = useMemo(() => {
    if (!resourceForm.slug) return "/your-resource-slug";
    return `/resources/${resourceForm.slug}`;
  }, [resourceForm.slug]);

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

      const data = (await response.json()) as JobListItem & {
        error?: string;
      };

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

  function handleResourceMaterialChange(
    index: number,
    field: keyof ResourceMaterialPayload,
    value: string,
  ) {
    setResourceForm((prev) => ({
      ...prev,
      materials: prev.materials.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addResourceMaterialField() {
    setResourceForm((prev) => ({
      ...prev,
      materials: [...prev.materials, { title: "", url: "" }],
    }));
  }

  function removeResourceMaterialField(index: number) {
    setResourceForm((prev) => {
      if (prev.materials.length === 1) return prev;
      return {
        ...prev,
        materials: prev.materials.filter((_, idx) => idx !== index),
      };
    });
  }

  function handleResourceEdit(resource: Resource) {
    setEditingResourceSlug(resource.slug);
    setResourceForm({
      title: resource.title,
      summary: resource.summary,
      description: resource.description || "",
      tags: resource.tags.join(", "),
      slug: resource.slug,
      materials: resource.materials.map((m) => ({
        id: m.id,
        title: m.title,
        url: m.url,
        type: m.type || "",
        description: m.description || "",
      })),
    });
    // Scroll to form
    document
      .getElementById("resource-form")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function handleResourceCancel() {
    setEditingResourceSlug(null);
    setResourceForm(initialResourceState);
    setResourceMessage(null);
  }

  async function handleResourceSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setResourceLoading(true);
    setResourceMessage(null);

    const materials = resourceForm.materials
      .map((item) => ({
        id: item.id,
        title: item.title.trim(),
        url: item.url.trim(),
        type: item.type?.trim() || undefined,
        description: item.description?.trim() || undefined,
      }))
      .filter((item) => item.title && item.url);

    if (materials.length === 0) {
      setResourceMessage("Add at least one material with title and URL.");
      setResourceLoading(false);
      return;
    }

    try {
      const payload = {
        title: resourceForm.title.trim(),
        summary: resourceForm.summary.trim(),
        description: resourceForm.description.trim(),
        tags: resourceForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        slug: resourceForm.slug.trim().toLowerCase(),
        materials,
      };

      if (!payload.title || !payload.summary || !payload.slug) {
        throw new Error("Title, summary, and slug are required.");
      }

      const isEditing = editingResourceSlug !== null;
      const response = await fetch("/api/resources", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { ...payload, slug: editingResourceSlug } : payload),
      });

      const data = (await response.json()) as Resource & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save resource.");
      }

      if (isEditing) {
        setResources((prev) =>
          prev.map((r) => (r.slug === editingResourceSlug ? data : r)),
        );
        setResourceMessage("Resource updated ✅");
      } else {
        setResources((prev) => [data, ...prev]);
        setResourceMessage("Resource published ✅");
      }

      setResourceForm(initialResourceState);
      setEditingResourceSlug(null);
    } catch (error) {
      setResourceMessage(
        error instanceof Error ? error.message : "Failed to save resource",
      );
    } finally {
      setResourceLoading(false);
    }
  }

  async function handleResourceDelete(slug: string) {
    const confirmDelete = window.confirm(
      "Delete this resource? This cannot be undone.",
    );
    if (!confirmDelete) return;

    setResourceDeleteState((prev) => ({ ...prev, [slug]: true }));
    setResourceMessage(null);

    try {
      const response = await fetch("/api/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete resource.");
      }

      setResources((prev) => prev.filter((resource) => resource.slug !== slug));
      setResourceMessage("Resource removed 🗑️");
    } catch (error) {
      setResourceMessage(
        error instanceof Error ? error.message : "Delete failed",
      );
    } finally {
      setResourceDeleteState((prev) => ({ ...prev, [slug]: false }));
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <main className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
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
              Create a friendly URL like <span className="text-white">/infosys</span>{" "}
              that opens a dedicated job page.
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
                    {
                      label: "CTC / stipend",
                      name: "ctc",
                      placeholder: "₹6-8 LPA",
                    },
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
                    setForm((prev) => ({
                      ...prev,
                      otherDetails: event.target.value,
                    }))
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

          <section className="rounded-3xl bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
                  Resources
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  {editingResourceSlug ? "Edit resource" : "Share interview kits"}
                </h2>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Upload prep guides, experience writeups, or curated material links.
            </p>

            <form id="resource-form" onSubmit={handleResourceSubmit} className="mt-8 space-y-5">
              <label className="block text-sm font-medium">
                Resource title
                <input
                  type="text"
                  name="resource-title"
                  value={resourceForm.title}
                  onChange={(event) =>
                    setResourceForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  required
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder-white/40 focus:border-sky-300 focus:outline-none"
                  placeholder="TCS NQT Master Guide"
                />
              </label>

              <label className="block text-sm font-medium">
                Spotlight summary
                <textarea
                  rows={3}
                  value={resourceForm.summary}
                  onChange={(event) =>
                    setResourceForm((prev) => ({
                      ...prev,
                      summary: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder-white/40 focus:border-sky-300 focus:outline-none"
                  placeholder="2 lines about what candidates get from this resource"
                />
              </label>

              <label className="block text-sm font-medium">
                Detailed notes
                <textarea
                  rows={4}
                  value={resourceForm.description}
                  onChange={(event) =>
                    setResourceForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder-white/40 focus:border-sky-300 focus:outline-none"
                  placeholder="Explain what study material, schedules or links are included."
                />
              </label>

              <label className="block text-sm font-medium">
                Tags (comma separated)
                <input
                  type="text"
                  value={resourceForm.tags}
                  onChange={(event) =>
                    setResourceForm((prev) => ({ ...prev, tags: event.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder-white/40 focus:border-sky-300 focus:outline-none"
                  placeholder="TCS, Aptitude, 2025"
                />
              </label>

              <label className="block text-sm font-medium">
                Resource slug
                <div className="mt-2 flex rounded-2xl border border-white/20 bg-white/5 text-base text-white focus-within:border-sky-300">
                  <span className="px-4 py-3 text-white/60">/resources</span>
                  <input
                    type="text"
                    value={resourceForm.slug}
                    required
                    disabled={editingResourceSlug !== null}
                    onChange={(event) =>
                      setResourceForm((prev) => ({
                        ...prev,
                        slug: event.target.value.toLowerCase().replace(/\s+/g, "-"),
                      }))
                    }
                    className="flex-1 rounded-r-2xl bg-transparent px-4 py-3 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="tcs-nqt-2025"
                  />
                </div>
                <p className="mt-1 text-xs text-white/50">
                  Preview: {resourceUrlPreview}
                  {editingResourceSlug && " (slug cannot be changed when editing)"}
                </p>
              </label>

              <div className="space-y-4">
                <p className="text-sm font-semibold text-white/80">
                  Materials (title + URL)
                </p>
                {resourceForm.materials.map((material, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="text-xs uppercase tracking-wide text-white/50">
                        Title
                        <input
                          type="text"
                          value={material.title}
                          onChange={(event) =>
                            handleResourceMaterialChange(index, "title", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 focus:border-sky-300 focus:outline-none"
                          placeholder="Aptitude practice sheet"
                        />
                      </label>
                      <label className="text-xs uppercase tracking-wide text-white/50">
                        URL
                        <input
                          type="url"
                          value={material.url}
                          onChange={(event) =>
                            handleResourceMaterialChange(index, "url", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 focus:border-sky-300 focus:outline-none"
                          placeholder="https://..."
                        />
                      </label>
                    </div>
                    {resourceForm.materials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResourceMaterialField(index)}
                        className="mt-3 text-xs text-red-200 hover:text-red-100"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addResourceMaterialField}
                  className="text-sm font-semibold text-sky-200 hover:text-sky-100"
                >
                  + Add another material
                </button>
              </div>

              <div className="flex gap-3">
                {editingResourceSlug && (
                  <button
                    type="button"
                    onClick={handleResourceCancel}
                    disabled={resourceLoading}
                    className="flex-1 rounded-2xl border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={resourceLoading}
                  className="flex-1 rounded-2xl bg-sky-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-200 disabled:opacity-60"
                >
                  {resourceLoading
                    ? editingResourceSlug
                      ? "Updating..."
                      : "Publishing..."
                    : editingResourceSlug
                      ? "Update resource"
                      : "Publish resource"}
                </button>
              </div>

              {resourceMessage && (
                <p className="text-sm text-sky-100" role="status">
                  {resourceMessage}
                </p>
              )}
            </form>
          </section>
        </div>

        <div className="space-y-8">
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

          <aside className="rounded-3xl bg-white p-8 text-slate-900 shadow-2xl shadow-slate-200">
            <h2 className="text-xl font-semibold">Published resources</h2>
            <p className="text-sm text-slate-500">
              {resources.length} interview kits
            </p>
            <div className="mt-6 space-y-4 overflow-y-auto">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="space-y-3 rounded-2xl border border-slate-100 p-4 text-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{resource.title}</p>
                      <p className="text-slate-500">{resource.summary}</p>
                      <p className="text-xs text-slate-400">
                        Updated {new Date(resource.updatedAt).toLocaleString()} • /
                        resources/{resource.slug}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleResourceEdit(resource)}
                        disabled={Boolean(resourceDeleteState[resource.slug])}
                        className="self-start rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 transition hover:bg-blue-50 disabled:opacity-60"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResourceDelete(resource.slug)}
                        disabled={Boolean(resourceDeleteState[resource.slug])}
                        className="self-start rounded-full border border-red-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        {resourceDeleteState[resource.slug] ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-3 text-xs text-slate-600">
                    <p className="font-semibold text-slate-900">Materials</p>
                    <ul className="mt-2 space-y-1">
                      {resource.materials.map((material) => (
                        <li key={material.id ?? material.url}>
                          <span className="text-slate-800">{material.title}</span>{" "}
                          · {material.url}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              {resources.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                  Publish your first resource to see it here.
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

