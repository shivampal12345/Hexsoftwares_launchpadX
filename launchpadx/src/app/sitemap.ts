import type { MetadataRoute } from 'next';
import { startups } from '@/constants/dummyData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const staticRoutes = [
    '',
    '/startups',
    '/dashboard',
    '/about',
    '/contact',
    '/faq',
    '/legal',
  ].map((route) => ({
    url: `${baseUrl}${route || '/'}`,
    lastModified: new Date(),
  }));

  const startupRoutes = startups.map((startup) => ({
    url: `${baseUrl}/startups/${startup.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...startupRoutes];
}
