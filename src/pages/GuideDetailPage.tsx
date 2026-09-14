import { Clock, Calendar, ArrowLeft, Home, ChevronRight, Sparkles } from 'lucide-react';
import { getGuideBySlug, GUIDES } from '../data/guidesData';
import { getToolBySlug } from '../data/toolsData';
import { ToolCard } from '../components/common/ToolCard';
import { SeoHead } from '../components/common/SeoHead';
import { AdSlot } from '../components/common/AdSlot';
import { SITE_CONFIG } from '../config/siteConfig';

interface GuideDetailPageProps {
  guideSlug: string;
  onNavigate: (path: string) => void;
}

export function GuideDetailPage({ guideSlug, onNavigate }: GuideDetailPageProps) {
  const guide = getGuideBySlug(guideSlug);

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Guide Not Found</h1>
        <p className="text-sm text-slate-600">The guide or tutorial you requested could not be found.</p>
        <button
          onClick={() => onNavigate('/guides')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
        >
          View All Guides
        </button>
      </div>
    );
  }

  const relatedTools = guide.relatedToolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter(Boolean) as any[];

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.summary,
    author: {
      '@type': 'Organization',
      name: 'PDFSmart Tools',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PDFSmart Tools',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.canonicalUrl}/logo.png`,
      },
    },
    datePublished: guide.publishedDate,
  };

  return (
    <div id={`guide-${guide.slug}`} className="space-y-12 pb-16">
      <SeoHead
        title={`${guide.title} | PDFSmart Guides`}
        description={guide.summary}
        canonical={`${SITE_CONFIG.canonicalUrl}/guides/${guide.slug}`}
        ogType="article"
        schemaData={schemaData}
      />

      {/* Header */}
      <section className="bg-gradient-to-b from-blue-50/60 to-slate-50 border-b border-slate-200/80 pt-6 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="hover:text-blue-600 flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <a
              href="/guides"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/guides');
              }}
              className="hover:text-blue-600"
            >
              Guides
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold truncate max-w-[200px]">{guide.title}</span>
          </nav>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="font-bold text-blue-600 bg-blue-100/80 px-2.5 py-1 rounded-md">
                {guide.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {guide.readingTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {guide.publishedDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {guide.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">
          {guide.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </article>

      {/* AdSlot - CONTENT_AD_BEFORE_RELATED */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="CONTENT_AD_BEFORE_RELATED" id={`guide-${guide.slug}-ad`} />
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Try Related Free Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((t) => (
              <ToolCard
                key={t.id}
                tool={t}
                onClick={() => onNavigate(`/tools/${t.slug}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
