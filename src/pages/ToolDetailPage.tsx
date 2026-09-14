import { lazy, Suspense } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ChevronRight,
  Home
} from 'lucide-react';
import { getToolBySlug, TOOLS } from '../data/toolsData';
import { ToolCard } from '../components/common/ToolCard';
import { SeoHead } from '../components/common/SeoHead';
import { AdSlot } from '../components/common/AdSlot';
import { ToolIllustration } from '../components/common/ToolIllustration';
import { ClientOnly } from 'vite-react-ssg';
import { SITE_CONFIG } from '../config/siteConfig';

// Lazy-load the heavy client-side tool runner to keep SSG build free of browser-only canvas/Wasm dependencies
const ToolRunner = lazy(() =>
  import('../components/tools/ToolRunner').then((m) => ({ default: m.ToolRunner }))
);

interface ToolDetailPageProps {
  toolSlug: string;
  onNavigate: (path: string) => void;
}

export function ToolDetailPage({ toolSlug, onNavigate }: ToolDetailPageProps) {
  const tool = getToolBySlug(toolSlug);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Tool Not Found</h1>
        <p className="text-sm text-slate-600">The PDF tool you are looking for does not exist.</p>
        <button
          onClick={() => onNavigate('/tools')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold cursor-pointer"
        >
          View All Available Tools
        </button>
      </div>
    );
  }

  // Get related tools from same category or other popular
  const relatedTools = TOOLS.filter((t) => t.id !== tool.id && t.category === tool.category).slice(0, 3);
  if (relatedTools.length < 3) {
    const more = TOOLS.filter((t) => t.id !== tool.id && !relatedTools.includes(t)).slice(0, 3 - relatedTools.length);
    relatedTools.push(...more);
  }

  // Schema.org structured data for SEO (SoftwareApplication & HowTo)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool.name,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: tool.shortDescription,
      },
      {
        '@type': 'HowTo',
        name: `How to use ${tool.name}`,
        description: tool.shortDescription,
        step: tool.howToSteps.map((s, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: s.title,
          text: s.description,
        })),
      },
    ],
  };

  return (
    <div id={`tool-page-${tool.slug}`} className="space-y-12 sm:space-y-16 pb-16">
      <SeoHead
        title={tool.metaTitle}
        description={tool.metaDescription}
        canonical={`${SITE_CONFIG.canonicalUrl}/tools/${tool.slug}`}
        keywords={tool.keywords}
        schemaData={structuredData}
        faqs={tool.faqs}
      />

      {/* Breadcrumb & Hero Header */}
      <section className="bg-gradient-to-b from-blue-50/60 to-slate-50 border-b border-slate-200/80 pt-6 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Breadcrumb Navigation */}
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
              href="/tools"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/tools');
              }}
              className="hover:text-blue-600 capitalize"
            >
              Tools
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">{tool.name}</span>
          </nav>

          <div className="text-center space-y-3 pt-2">
            <div className="flex justify-center pb-1">
              <div className="p-3 bg-white/90 rounded-2xl shadow-xs border border-slate-200/80 inline-flex items-center justify-center">
                <ToolIllustration toolId={tool.slug} size="lg" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {tool.category} Tool
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              {tool.name}
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
              {tool.longDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Primary Tool Runner Component */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Privacy Trust Badge (Mandatory for AdSense & User Trust) */}
        <div 
          id="tool-privacy-trust-badge"
          className="flex items-center justify-center gap-2 p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-300/80 text-emerald-900 shadow-xs text-xs sm:text-sm font-semibold text-center"
        >
          <span>🔒 Local Browser Processing: Files are processed client-side in memory during standard operation. Zero documents uploaded to our servers.</span>
        </div>

        <ClientOnly
          fallback={
            <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 shadow-xs text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Loading {tool.name}...</h3>
              <p className="text-sm text-slate-500">Preparing client-side PDF workspace</p>
            </div>
          }
        >
          {() => (
            <Suspense
              fallback={
                <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 shadow-xs text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Loading {tool.name}...</h3>
                  <p className="text-sm text-slate-500">Preparing client-side PDF workspace</p>
                </div>
              }
            >
              <ToolRunner tool={tool} />
            </Suspense>
          )}
        </ClientOnly>
      </section>

      {/* AD LOCATION 3: TOOL_AD_AFTER_RESULT (Below tool interface/results, clearly separated) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="TOOL_AD_AFTER_RESULT" />
      </div>

      {/* How to Use Section (Step by Step) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-bold text-slate-900">
            How it works: Step-by-Step Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Follow these simple steps to use our free {tool.name} tool on any desktop, tablet, or mobile browser
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tool.howToSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                  {idx + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deep Content & Architecture Explanation Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              Why Choose PDFSmart {tool.name}?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unlike traditional cloud-based PDF conversion portals that transmit sensitive documents across external internet servers, PDFSmart Tools executes calculations, rendering, and document processing natively inside your device web browser during standard operation. This architecture is designed to keep financial statements, legal contracts, and personal records contained on your local machine.
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Key Features & Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tool.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Architecture Card */}
          <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1"></span>
              <span>In-Browser Privacy Architecture</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-900/80 leading-relaxed">
              {tool.privacyNotice}
            </p>
          </div>

          {/* Supported Specifications */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <span className="font-semibold text-slate-700">Accepted Formats:</span>{' '}
              {tool.inputFormats.join(', ')}
            </div>
            <div>
              <span className="font-semibold text-slate-700">Output Format:</span>{' '}
              {tool.outputFormat}
            </div>
            <div>
              <span className="font-semibold text-slate-700">Max File Size:</span>{' '}
              {tool.maxFileSizeMb} MB
            </div>
          </div>
        </div>
      </section>

      {/* Common Use Cases */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Common Use Cases</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tool.useCases.map((uc, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {uc}
            </div>
          ))}
        </div>
      </section>

      {/* AD LOCATION 4: CONTENT_AD_BEFORE_RELATED (Below content, before related tools & FAQ) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="CONTENT_AD_BEFORE_RELATED" />
      </div>

      {/* FAQ Accordion Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Common questions regarding privacy, document compatibility, and client-side processing for {tool.name}
          </p>
        </div>

        <div className="space-y-3">
          {tool.faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">{faq.question}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        <h2 className="text-xl font-bold text-slate-900">Related PDF Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {relatedTools.map((relTool) => (
            <ToolCard
              key={relTool.id}
              tool={relTool}
              onClick={() => onNavigate(`/tools/${relTool.slug}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
