import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getResourceBySlug,
  type Resource,
} from "@/lib/resourceStore";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    return {
      title: "Resource not found",
    };
  }

  return {
    title: `${resource.title} | Campus Resources`,
    description: resource.summary,
  };
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12">
      <main className="mx-auto flex max-w-4xl flex-col gap-8">
        <Link
          href="/resources"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to resources
        </Link>

        <article className="rounded-3xl bg-white p-8 shadow-lg shadow-zinc-200">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-400">
            {resource.tags.join(" • ") || "Interview kit"}
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-zinc-950">
            {resource.title}
          </h1>
          <p className="mt-3 text-base text-zinc-600">{resource.summary}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-zinc-400">
            Updated{" "}
            {new Date(resource.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          {resource.description && (
            <div className="mt-6 space-y-4 text-base text-zinc-700">
              {resource.description.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          <section className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold text-zinc-900">
              Included materials
            </h2>
            <div className="space-y-3">
              {resource.materials.map((material) => (
                <div
                  key={material.id}
                  className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-base font-semibold text-zinc-900">
                      {material.title}
                    </p>
                    {material.description && (
                      <p className="text-sm text-zinc-600">
                        {material.description}
                      </p>
                    )}
                    {material.type && (
                      <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-medium text-indigo-700">
                        {material.type}
                      </span>
                    )}
                  </div>
                  <Link
                    href={material.url}
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-full border border-indigo-200 px-4 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                  >
                    Open link
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}






