import { useEffect } from 'react';
import { PEACEFUL_TASTE_CONTACT } from '@shared/orderReceipt';

const SITE_URL = import.meta.env.VITE_SITE_URL || PEACEFUL_TASTE_CONTACT.siteUrl;
const DEFAULT_IMAGE = PEACEFUL_TASTE_CONTACT.logoUrl;

type PageMetaProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  robots?: string;
};

function ensureMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element!.setAttribute(key, value);
  });
}

function ensureLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element!.setAttribute(key, value);
  });
}

export default function PageMeta({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  robots = 'index, follow',
}: PageMetaProps) {
  useEffect(() => {
    const canonicalUrl = new URL(path, SITE_URL).toString();
    const fullTitle = title.includes('Peaceful Taste') ? title : `${title} | Peaceful Taste`;

    document.title = fullTitle;
    ensureMeta('meta[name="description"]', { name: 'description', content: description });
    ensureMeta('meta[name="robots"]', { name: 'robots', content: robots });
    ensureMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    ensureMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });
    ensureMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    ensureMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    ensureMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });
    ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    ensureLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
  }, [description, image, path, robots, title]);

  return null;
}
