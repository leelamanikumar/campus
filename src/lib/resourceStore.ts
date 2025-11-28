import crypto from "crypto";
import { MongoClient } from "mongodb";
import type { Collection, WithId } from "mongodb";

export type ResourceMaterial = {
  id: string;
  title: string;
  url: string;
  type?: string;
  description?: string;
};

export type Resource = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  tags: string[];
  heroImage?: string;
  materials: ResourceMaterial[];
  createdAt: string;
  updatedAt: string;
};

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "job-links";
const collectionName = process.env.MONGODB_RESOURCE_COLLECTION ?? "resources";

if (!uri) {
  throw new Error(
    "MONGODB_URI is not set. Add it to your .env.local to use the resource store.",
  );
}

let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _resourceMongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._resourceMongoClientPromise) {
    const client = new MongoClient(uri);
    global._resourceMongoClientPromise = client.connect();
  }
  clientPromise = global._resourceMongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

async function getCollection(): Promise<Collection<Resource>> {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection<Resource>(collectionName);
  await collection.createIndex({ slug: 1 }, { unique: true });
  return collection;
}

function stripMongoId(doc: WithId<Resource>): Resource {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...resource } = doc;
  return resource;
}

export async function getResources(): Promise<Resource[]> {
  const collection = await getCollection();
  const resources = await collection
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return resources.map(stripMongoId);
}

export async function getResourceBySlug(
  slug: string,
): Promise<Resource | undefined> {
  const collection = await getCollection();
  const resource = await collection.findOne({ slug });
  return resource ? stripMongoId(resource) : undefined;
}

export async function addResource(
  data: Omit<Resource, "id" | "createdAt" | "updatedAt"> & {
    createdAt?: string;
    updatedAt?: string;
  },
): Promise<Resource> {
  const collection = await getCollection();
  const now = new Date().toISOString();
  const resource: Resource = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
  };

  await collection.insertOne(resource);
  return resource;
}

export async function updateResource(
  slug: string,
  data: Partial<Omit<Resource, "id" | "slug" | "createdAt">> & {
    updatedAt?: string;
  },
): Promise<Resource> {
  const collection = await getCollection();
  const resource = await collection.findOne({ slug });

  if (!resource) {
    throw new Error(`Resource with slug "${slug}" not found.`);
  }

  const updateData: Partial<Resource> = {
    ...data,
    updatedAt: data.updatedAt ?? new Date().toISOString(),
  };

  await collection.updateOne({ slug }, { $set: updateData });
  const updated = await collection.findOne({ slug });
  if (!updated) {
    throw new Error(`Resource with slug "${slug}" not found after update.`);
  }
  return stripMongoId(updated);
}

export async function deleteResource(slug: string): Promise<Resource> {
  const collection = await getCollection();
  const resource = await collection.findOne({ slug });

  if (!resource) {
    throw new Error(`Resource with slug "${slug}" not found.`);
  }

  await collection.deleteOne({ slug });
  return stripMongoId(resource);
}






