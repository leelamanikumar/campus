import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/leela', '/admin'],
    },
    sitemap: 'https://offcampusjobs.online/sitemap.xml',
  };
}

