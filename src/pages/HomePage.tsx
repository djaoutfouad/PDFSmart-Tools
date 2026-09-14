import { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { TOOLS, TOOL_CATEGORIES, getPopularTools } from '../data/toolsData';
import { GUIDES } from '../data/guidesData';
import { ToolCard } from '../components/common/ToolCard';
import { SeoHead } from '../components/common/SeoHead';
import { AdSlot } from '../components/common/AdSlot';
import { SITE_CONFIG } from '../config/siteConfig';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const popularTools = getPopularTools();

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const homeFaqs = [
    {
      question: 'Is PDFSmart Tools really free to use?',
      answer: 'Yes. All 15 tools are completely free to use with no hidden subscriptions, document paywalls, or watermarks added to your output.',
    },
    {
      question: 'How does client-side PDF processing work without uploading files?',
      answer: 'We leverage modern WebAssembly (Wasm) and JavaScript engines that compile and manipulate PDF binary streams directly in your browser memory (RAM). When you finish, the memory is released.',
    },
    {
      question: 'Are my confidential documents safe?',
      answer: 'Designed to process files locally in your browser during standard operation without transmitting document contents to remote servers. We recommend keeping backups of your original documents.',
    },
    {
      question: 'Does this work on mobile phones and tablets?',
      answer: 'Yes. PDFSmart Tools is fully responsive and functions smoothly across iOS Safari, Android Chrome, macOS, Windows, and Linux.',
    },
  ];

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PDFSmart Tools',
    url: SITE_CONFIG.canonicalUrl,
    description: 'Free, private, and fast online PDF tools processed locally in your browser.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div id="home-page" className="space-y-12 sm:space-y-16 pb-16">
      <SeoHead
        title="PDFSmart Tools - Free, Private & In-Browser PDF Utilities"
        description="Merge, split, compress, convert, rotate, protect, and watermark PDF documents online for free. Client-side privacy with zero file uploads."
        canonical={SITE_CONFIG.canonicalUrl}
        keywords={['pdf tools', 'merge pdf', 'compress pdf', 'pdf to word', 'split pdf', 'private pdf converter']}
        schemaData={schemaData}
        faqs={homeFaqs}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-8 bg-gradient-to-b from-blue-50/50 via-slate-50 to-slate-50">
        {/* Subtle SVG Background of abstract document leaves, security shields, and nodes */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <svg
            className="absolute w-full h-full text-blue-500/10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 600"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="hero-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="hero-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Top Left Floating Document Leaf */}
            <g transform="translate(80, 40) rotate(-12)" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity="0.25">
              <rect x="0" y="0" width="90" height="120" rx="10" fill="url(#hero-grad-1)" />
              <line x1="18" y1="28" x2="62" y2="28" strokeLinecap="round" />
              <line x1="18" y1="42" x2="72" y2="42" strokeLinecap="round" />
              <line x1="18" y1="56" x2="52" y2="56" strokeLinecap="round" />
              <line x1="18" y1="70" x2="66" y2="70" strokeLinecap="round" />
            </g>

            {/* Top Right Floating Document Leaf */}
            <g transform="translate(1020, 60) rotate(14)" stroke="#6366F1" strokeWidth="1.5" strokeOpacity="0.25">
              <rect x="0" y="0" width="85" height="115" rx="10" fill="url(#hero-grad-1)" />
              <line x1="16" y1="26" x2="58" y2="26" strokeLinecap="round" />
              <line x1="16" y1="40" x2="68" y2="40" strokeLinecap="round" />
              <line x1="16" y1="54" x2="48" y2="54" strokeLinecap="round" />
            </g>

            {/* Left Mid Shield Symbol */}
            <g transform="translate(160, 220)" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.3" fill="url(#hero-grad-2)">
              <path d="M40 10 C40 10 70 8 78 18 C78 48 60 66 40 76 C20 66 2 48 2 18 C10 8 40 10 40 10 Z" />
              <path d="M26 40 L35 49 L55 29" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>

            {/* Right Mid Shield Symbol */}
            <g transform="translate(960, 240)" stroke="#3B82F6" strokeWidth="1.5" strokeOpacity="0.3" fill="url(#hero-grad-1)">
              <path d="M40 10 C40 10 70 8 78 18 C78 48 60 66 40 76 C20 66 2 48 2 18 C10 8 40 10 40 10 Z" />
              <circle cx="40" cy="38" r="8" stroke="#3B82F6" strokeWidth="2" fill="none" />
              <path d="M40 46 L40 54" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Interconnected Data Mesh Nodes */}
            <g stroke="#94A3B8" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 4">
              <line x1="170" y1="120" x2="200" y2="230" />
              <line x1="200" y1="230" x2="320" y2="340" />
              <line x1="1020" y1="140" x2="980" y2="240" />
              <line x1="980" y1="240" x2="880" y2="360" />
              <line x1="320" y1="340" x2="480" y2="400" />
              <line x1="880" y1="360" x2="720" y2="400" />
            </g>

            {/* Node Points */}
            <circle cx="170" cy="120" r="4" fill="#3B82F6" fillOpacity="0.3" />
            <circle cx="200" cy="230" r="5" fill="#10B981" fillOpacity="0.4" />
            <circle cx="320" cy="340" r="3.5" fill="#6366F1" fillOpacity="0.3" />
            <circle cx="1020" cy="140" r="4" fill="#6366F1" fillOpacity="0.3" />
            <circle cx="980" cy="240" r="5" fill="#3B82F6" fillOpacity="0.4" />
            <circle cx="880" cy="360" r="3.5" fill="#10B981" fillOpacity="0.3" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>In-Browser PDF Processing — Designed to Process Locally</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Every PDF Tool You Need,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Private & Instant
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            Free client-side PDF utilities. Merge, compress, convert, split, rotate, and secure documents right on your device without transmitting confidential data.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-2xl border border-slate-300 shadow-sm focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 transition-all p-1.5">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 15 tools (e.g. merge, compress, protect, word)..."
                className="w-full px-3 py-2.5 text-sm text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AD LOCATION 1: HOME_AD_TOP (Below hero, before main tools) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="HOME_AD_TOP" />
      </div>

      {/* Popular Tools Section */}
      {!searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Popular PDF Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                The most frequently used document utilities
              </p>
            </div>
            <button
              onClick={() => onNavigate('/tools')}
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              View all 15 tools
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularTools.slice(0, 6).map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => onNavigate(`/tools/${tool.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Tools Catalog & Category Filter */}
      <section id="tools-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              All PDF Utilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse by category or search for specific workflows
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="font-semibold text-slate-800">No tools found matching your query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => onNavigate(`/tools/${tool.slug}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Privacy Deep Dive Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl overflow-hidden relative">
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Architected for Modern Privacy</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Why In-Browser Processing is Safer Than Cloud Converters
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Traditional online converters upload your documents to external cloud servers where they are saved and parsed. PDFSmart Tools is designed to process files locally inside your browser sandbox during standard operation, without transferring document contents to our servers. Keep a backup of your original files before processing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Designed for Local In-Browser Processing</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Fast Processing (No Upload / Download Wait)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Client-Side In-Memory Execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Guides / Knowledge Base Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              PDF Guides & Best Practices
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Practical tutorials on document optimization, conversion, and privacy
            </p>
          </div>
          <button
            onClick={() => onNavigate('/guides')}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            Explore all guides
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDES.map((guide) => (
            <div
              key={guide.slug}
              onClick={() => onNavigate(`/guides/${guide.slug}`)}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {guide.category}
                  </span>
                  <span>{guide.readingTime}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                  {guide.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Read Tutorial</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm">
            Everything you need to know about PDFSmart Tools and browser-based processing
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Is PDFSmart Tools really free to use?',
              a: 'Yes. All 15 tools are free to use with no accounts, subscriptions, or document watermarks added to your output.',
            },
            {
              q: 'How does client-side PDF processing work without uploading files?',
              a: 'We leverage modern WebAssembly (Wasm) and JavaScript engines that compile and manipulate PDF binary streams directly in your browser memory (RAM). When you finish, the memory is released.',
            },
            {
              q: 'Are my confidential documents safe?',
              a: 'Designed to process files locally in your browser during standard operation without transmitting document contents to remote servers. We recommend keeping backups of your original documents.',
            },
            {
              q: 'Does this work on mobile phones and tablets?',
              a: 'Yes. PDFSmart Tools is fully responsive and functions smoothly across iOS Safari, Android Chrome, macOS, Windows, and Linux.',
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">{faq.q}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AD LOCATION 2: HOME_AD_BOTTOM (Between FAQ and footer area) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="HOME_AD_BOTTOM" />
      </div>
    </div>
  );
}
