import crypto from "crypto";
import { NextResponse } from "next/server";

import {
  addResource,
  deleteResource,
  getResources,
  updateResource,
  type ResourceMaterial,
} from "@/lib/resourceStore";

export async function GET() {
  const resources = await getResources();
  return NextResponse.json({ resources });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    title?: string;
    summary?: string;
    description?: string;
    tags?: string[];
    slug?: string;
    materials?: ResourceMaterial[];
  };

  if (!payload.title || !payload.summary || !payload.slug) {
    return NextResponse.json(
      { error: "title, summary and slug are required." },
      { status: 400 },
    );
  }

  const materials =
    payload.materials?.filter(
      (item) => item.title?.trim() && item.url?.trim(),
    ) ?? [];

  if (materials.length === 0) {
    return NextResponse.json(
      { error: "At least one material (title + URL) is required." },
      { status: 400 },
    );
  }

  try {
    const resource = await addResource({
      title: payload.title.trim(),
      summary: payload.summary.trim(),
      description: payload.description?.trim(),
      tags: payload.tags ?? [],
      slug: payload.slug.trim().toLowerCase(),
      materials: materials.map((item) => ({
        id: item.id ?? crypto.randomUUID(),
        title: item.title.trim(),
        url: item.url.trim(),
        type: item.type?.trim(),
        description: item.description?.trim(),
      })),
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to add resource.",
      },
      { status: 400 },
    );
  }
}

export async function PUT(request: Request) {
  const payload = (await request.json()) as {
    slug?: string;
    title?: string;
    summary?: string;
    description?: string;
    tags?: string[];
    materials?: ResourceMaterial[];
  };

  if (!payload.slug) {
    return NextResponse.json(
      { error: "Slug is required to update a resource." },
      { status: 400 },
    );
  }

  const materials =
    payload.materials?.filter(
      (item) => item.title?.trim() && item.url?.trim(),
    ) ?? [];

  if (materials.length === 0) {
    return NextResponse.json(
      { error: "At least one material (title + URL) is required." },
      { status: 400 },
    );
  }

  try {
    const resource = await updateResource(payload.slug.trim().toLowerCase(), {
      title: payload.title?.trim(),
      summary: payload.summary?.trim(),
      description: payload.description?.trim(),
      tags: payload.tags ?? [],
      materials: materials.map((item) => ({
        id: item.id ?? crypto.randomUUID(),
        title: item.title.trim(),
        url: item.url.trim(),
        type: item.type?.trim(),
        description: item.description?.trim(),
      })),
    });

    return NextResponse.json(resource);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to update resource.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const { slug } = (await request.json()) as { slug?: string };

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required to delete a resource." },
      { status: 400 },
    );
  }

  try {
    const removed = await deleteResource(slug.trim().toLowerCase());
    return NextResponse.json(removed);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete resource.",
      },
      { status: 404 },
    );
  }
}


