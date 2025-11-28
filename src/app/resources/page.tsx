import Link from "next/link";

import { getResources } from "@/lib/resourceStore";

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 px-4 py-16 font-sans text-zinc-900">
      <main className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="rounded-3xl bg-white/80 p-10 shadow-xl shadow-zinc-100">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-400">
            Interview Hub
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-zinc-950">
            All prep resources & experiences
          </h1>
          <p className="mt-2 text-lg text-zinc-600">
            Explore curated kits, interview experiences, and study materials shared via the admin console.
          </p>
        </header>

        {resources.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-zinc-200 bg-white/60 p-8 text-center text-sm text-zinc-500">
            No resources yet. Check back soon!
          </p>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => (
              <article
                key={resource.id}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-400">
                  {resource.tags.join(" • ") || "Interview prep"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
                  {resource.title}
                </h2>
                <p className="mt-3 text-sm text-zinc-600">{resource.summary}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                  <span>{resource.materials.length} material(s)</span>
                  <span>
                    Updated{" "}
                    {new Date(resource.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                    })}
                  </span>
                </div>
                <Link
                  href={`/resources/${resource.slug}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 hover:underline"
                >
                  Explore →
                </Link>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}





