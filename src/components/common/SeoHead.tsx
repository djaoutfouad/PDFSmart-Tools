import { useEffect } from 'react';
import { SITE_CONFIG } from '../../config/siteConfig';

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  keywords?: string[];
  schemaData?: Record<string, any>;
  includeWebSiteSchema?: boolean;
  faqs?: SeoFaqItem[];
}

export function SeoHead({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = `${SITE_CONFIG.canonicalUrl}/og-image.png`,
  keywords,
  schemaData,
  includeWebSiteSchema = true,
  faqs,
}: SeoProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Update or create Meta Description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', description);

    // 3. Update Keywords
    if (keywords && keywords.length > 0) {
      let keywordsTag = document.querySelector('meta[name="keywords"]');
      if (!keywordsTag) {
        keywordsTag = document.createElement('meta');
        keywordsTag.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsTag);
      }
      keywordsTag.setAttribute('content', keywords.join(', '));
    }

    // 4. Update Canonical
    const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : SITE_CONFIG.canonicalUrl);
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', currentUrl);

    // 5. Open Graph tags
    const ogTags: Record<string, string> = {
      'og:title': title,
      'og:description': description,
      'og:type': ogType,
      'og:url': currentUrl,
      'og:image': ogImage,
      'og:site_name': 'PDFSmart Tools',
    };

    Object.entries(ogTags).forEach(([prop, val]) => {
      let tag = document.querySelector(`meta[property="${prop}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', prop);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', val);
    });

    // 6. Twitter Card tags
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': ogImage,
    };

    Object.entries(twitterTags).forEach(([name, val]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', val);
    });

    // 7. Structured Data (JSON-LD) with dynamic WebSite & FAQPage schemas
    const scriptId = 'structured-data-json-ld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;

    // Compose cohesive @graph structured data
    const graphEntities: any[] = [];

    // A. Dynamic WebSite Schema (uses SITE_CONFIG.canonicalUrl and incorporates site & current page meta)
    if (includeWebSiteSchema) {
      graphEntities.push({
        '@type': 'WebSite',
        '@id': `${SITE_CONFIG.canonicalUrl}/#website`,
        url: SITE_CONFIG.canonicalUrl,
        name: 'PDFSmart Tools',
        description: description || 'Free, private, and fast online PDF tools processed locally in your browser.',
        inLanguage: 'en-US',
        publisher: {
          '@type': 'Organization',
          '@id': `${SITE_CONFIG.canonicalUrl}/#organization`,
          name: 'PDFSmart Tools',
          url: SITE_CONFIG.canonicalUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_CONFIG.canonicalUrl}/logo.png`,
          },
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_CONFIG.canonicalUrl}/tools?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      });
    }

    // B. Custom schemaData passed from props
    if (schemaData) {
      if (Array.isArray(schemaData['@graph'])) {
        graphEntities.push(...schemaData['@graph']);
      } else {
        const { '@context': _ctx, ...rest } = schemaData;
        graphEntities.push(rest);
      }
    }

    // C. Dynamic FAQPage Schema using current canonical URL, title and meta information
    const hasExistingFaq = graphEntities.some((item) => item['@type'] === 'FAQPage');
    if (faqs && faqs.length > 0 && !hasExistingFaq) {
      graphEntities.push({
        '@type': 'FAQPage',
        '@id': `${currentUrl}#faq`,
        url: currentUrl,
        name: `${title} - Frequently Asked Questions`,
        description: `Frequently asked questions regarding ${title}. ${description}`,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      });
    }

    const finalSchema = graphEntities.length > 0
      ? {
          '@context': 'https://schema.org',
          '@graph': graphEntities,
        }
      : null;

    if (finalSchema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(finalSchema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonical, ogType, ogImage, keywords, schemaData, includeWebSiteSchema, faqs]);

  return null;
}
