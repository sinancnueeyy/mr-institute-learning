import { useEffect } from 'react';
import { type SeoMetadata } from '../types/cms';

export function useSEO(seo?: SeoMetadata) {
  useEffect(() => {
    if (!seo) return;

    // 1. Title
    document.title = seo.title || 'MR Institute of Learning';

    // 2. Meta Tags (Helper Function)
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Description & Keywords
    setMetaTag('description', seo.description);
    setMetaTag('keywords', seo.keywords);

    // OpenGraph
    setMetaTag('og:title', seo.title, true);
    setMetaTag('og:description', seo.description, true);
    if (seo.ogImage) setMetaTag('og:image', seo.ogImage, true);

    // Twitter
    if (seo.twitterCard) setMetaTag('twitter:card', seo.twitterCard);
    setMetaTag('twitter:title', seo.title);
    setMetaTag('twitter:description', seo.description);
    if (seo.ogImage) setMetaTag('twitter:image', seo.ogImage);

    // Robots (Index / NoIndex)
    setMetaTag('robots', seo.noIndex ? 'noindex, nofollow' : 'index, follow');

    // 3. Canonical URL
    if (seo.canonicalUrl) {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = seo.canonicalUrl;
    }

    // Cleanup function not strictly necessary for SPA unless we want to clear previous SEO
    // But typically we just let the next page overwrite it.

  }, [seo]);
}
