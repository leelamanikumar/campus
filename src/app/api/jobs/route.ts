import { NextResponse } from "next/server";

import { addJob, deleteJob, getJobs } from "@/lib/jobStore";

export async function GET() {
  const jobs = await getJobs();
  return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    title?: string;
    company?: string;
    location?: string;
    externalUrl?: string;
    summary?: string;
    tags?: string[];
    slug?: string;
    batch?: string;
    eligibility?: string;
    ctc?: string;
    otherDetails?: string;
  };

  if (
    !payload.title ||
    !payload.company ||
    !payload.externalUrl ||
    !payload.slug
  ) {
    return NextResponse.json(
      { error: "title, company, externalUrl and slug are required." },
      { status: 400 },
    );
  }

  try {
    const job = await addJob({
      title: payload.title.trim(),
      company: payload.company.trim(),
      location: payload.location?.trim() ?? "India",
      externalUrl: payload.externalUrl.trim(),
      summary: payload.summary?.trim() ?? "New job update",
      tags: payload.tags ?? [],
      slug: payload.slug.trim().toLowerCase(),
      batch: payload.batch?.trim(),
      eligibility: payload.eligibility?.trim(),
      ctc: payload.ctc?.trim(),
      otherDetails: payload.otherDetails?.trim(),
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add job." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const { slug } = (await request.json()) as { slug?: string };

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required to delete a job." },
      { status: 400 },
    );
  }

  try {
    const removed = await deleteJob(slug.trim().toLowerCase());
    return NextResponse.json(removed);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete job." },
      { status: 404 },
    );
  }
}

