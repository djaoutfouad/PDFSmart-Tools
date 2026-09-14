import { BookOpen, Clock, ArrowRight, Home, ChevronRight } from 'lucide-react';
import { GUIDES } from '../data/guidesData';
import { SeoHead } from '../components/common/SeoHead';
import { SITE_CONFIG } from '../config/siteConfig';

interface GuidesPageProps {
  onNavigate: (path: string) => void;
}

export function GuidesPage({ onNavigate }: GuidesPageProps) {
  return (
    <div id="guides-index-page" className="space-y-12 pb-16">
      <SeoHead
        title="PDF Guides & Tutorials - Optimization, Privacy & Best Practices | PDFSmart"
        description="Comprehensive guides on PDF management, client-side privacy, PDF compression techniques, and format conversion."
        canonical={`${SITE_CONFIG.canonicalUrl}/guides`}
        keywords={['pdf tutorials', 'pdf privacy guide', 'how to compress pdf', 'pdf conversion best practices']}
      />

      {/* Header */}
      <section className="bg-gradient-to-b from-blue-50/60 to-slate-50 border-b border-slate-200/80 pt-6 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
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
            <span className="text-slate-800 font-semibold">Guides & Tutorials</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              PDF Guides & Learning Center
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              In-depth articles and tutorials to help you work faster, reduce file sizes, and maintain complete privacy with digital documents.
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDES.map((guide) => (
            <article
              key={guide.slug}
              onClick={() => onNavigate(`/guides/${guide.slug}`)}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {guide.readingTime}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors leading-snug">
                  {guide.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {guide.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
