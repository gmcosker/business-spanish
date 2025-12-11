import { useEffect } from 'react';

interface PageSEOOptions {
  title?: string;
  description?: string;
  canonicalPath?: string;
  structuredData?: Record<string, any>;
}

/**
 * usePageSEO
 * Sets per-page SEO metadata (title, description, canonical URL, structured data).
 * Restores previous values on cleanup to avoid leaking tags between routes.
 */
export function usePageSEO({
  title,
  description,
  canonicalPath,
  structuredData,
}: PageSEOOptions) {
  useEffect(() => {
    const previousTitle = document.title;

    if (title) {
      document.title = title;
    }

    const descriptionMeta =
      document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = descriptionMeta?.getAttribute('content') ?? null;

    if (description && descriptionMeta) {
      descriptionMeta.setAttribute('content', description);
    }

    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://business-spanish.vercel.app';

    let canonicalLink =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const hadCanonical = Boolean(canonicalLink);
    const previousCanonicalHref = canonicalLink?.getAttribute('href') ?? null;

    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }

    if (canonicalPath && canonicalLink) {
      const href = canonicalPath.startsWith('http')
        ? canonicalPath
        : `${origin}${canonicalPath}`;
      canonicalLink.setAttribute('href', href);
    }

    let structuredDataScript: HTMLScriptElement | null = null;

    if (structuredData) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      structuredDataScript.setAttribute('data-page-schema', 'true');
      structuredDataScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(structuredDataScript);
    }

    return () => {
      document.title = previousTitle;

      if (descriptionMeta && previousDescription !== null) {
        descriptionMeta.setAttribute('content', previousDescription);
      }

      if (canonicalLink) {
        if (hadCanonical) {
          if (previousCanonicalHref) {
            canonicalLink.setAttribute('href', previousCanonicalHref);
          }
        } else {
          document.head.removeChild(canonicalLink);
        }
      }

      if (structuredDataScript) {
        document.head.removeChild(structuredDataScript);
      }
    };
  }, [title, description, canonicalPath, structuredData]);
}






