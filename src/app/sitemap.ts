import { MetadataRoute } from 'next';
import { getJobs } from '@/lib/jobStore';
import { getResources } from '@/lib/resourceStore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://offcampusjobs.online';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Dynamic job pages
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await getJobs();
    jobPages = jobs.map((job) => ({
      url: `${baseUrl}/${job.slug}`,
      lastModified: new Date(job.postedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching jobs for sitemap:', error);
  }

  // Dynamic resource pages
  let resourcePages: MetadataRoute.Sitemap = [];
  try {
    const resources = await getResources();
    resourcePages = resources.map((resource) => ({
      url: `${baseUrl}/resources/${resource.slug}`,
      lastModified: new Date(resource.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching resources for sitemap:', error);
  }

  return [...staticPages, ...jobPages, ...resourcePages];
}

