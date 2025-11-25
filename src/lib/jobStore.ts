import crypto from "crypto";
import {
  MongoClient,
  type Collection,
  type ModifyResult,
  type WithId,
} from "mongodb";

export type Job = {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  externalUrl: string;
  summary: string;
  tags: string[];
  postedAt: string;
};

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "job-links";
const collectionName = process.env.MONGODB_COLLECTION ?? "jobs";

if (!uri) {
  throw new Error(
    "MONGODB_URI is not set. Add it to your .env.local to use the job store.",
  );
}

let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

async function getCollection(): Promise<Collection<Job>> {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection<Job>(collectionName);
  await collection.createIndex({ slug: 1 }, { unique: true });
  return collection;
}

function stripMongoId(doc: WithId<Job>): Job {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...job } = doc;
  return job;
}

export async function getJobs(): Promise<Job[]> {
  const collection = await getCollection();
  const jobs = await collection.find().sort({ postedAt: -1 }).toArray();
  return jobs.map(stripMongoId);
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  const collection = await getCollection();
  const job = await collection.findOne({ slug });
  return job ? stripMongoId(job) : undefined;
}

export async function addJob(
  data: Omit<Job, "id" | "postedAt"> & { postedAt?: string },
): Promise<Job> {
  const collection = await getCollection();
  const newJob: Job = {
    ...data,
    id: crypto.randomUUID(),
    postedAt: data.postedAt ?? new Date().toISOString(),
  };

  await collection.insertOne(newJob);
  return newJob;
}

export async function deleteJob(slug: string): Promise<Job> {
  const collection = await getCollection();
  const result: ModifyResult<Job> = await collection.findOneAndDelete({ slug });

  if (!result?.value) {
    throw new Error(`Job with slug "${slug}" not found.`);
  }

  return stripMongoId(result.value);
}

