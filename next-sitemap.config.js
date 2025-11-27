/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://offcampusjobs.online',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/leela', '/admin/*'],
  // Note: Dynamic routes (jobs and resources) are handled by src/app/sitemap.ts
};

