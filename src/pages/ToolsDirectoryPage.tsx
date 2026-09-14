import { useState } from 'react';
import { Search, Sparkles, Filter, ChevronRight, Home } from 'lucide-react';
import { TOOLS, TOOL_CATEGORIES } from '../data/toolsData';
import { ToolCard } from '../components/common/ToolCard';
import { SeoHead } from '../components/common/SeoHead';
import { AdSlot } from '../components/common/AdSlot';
import { SITE_CONFIG } from '../config/siteConfig';

interface ToolsDirectoryPageProps {
  initialCategory?: string;
  onNavigate: (path: string) => void;
}

export function ToolsDirectoryPage({ initialCategory = 'all', onNavigate }: ToolsDirectoryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div id="tools-directory-page" className="space-y-10 sm:space-y-12 pb-16">
      <SeoHead
        title="All PDF Tools Directory - Free & Private Utilities | PDFSmart"
        description="Browse all 15 free online PDF tools. Merge, split, compress, convert to Word and JPG, rotate, delete pages, protect, and watermark PDFs."
        canonical={`${SITE_CONFIG.canonicalUrl}/tools`}
        keywords={['all pdf tools', 'online pdf suite', 'free pdf utilities', 'client side pdf editor']}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-blue-50/60 to-slate-50 border-b border-slate-200/80 pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
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
            <span className="text-slate-800 font-semibold">Tools Directory</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              All PDF Utilities & Converters
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Access the complete collection of 15 free, browser-based PDF utilities. No file uploads, no watermarks, and no sign-ups required.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md pt-2">
            <div className="relative flex items-center bg-white rounded-xl border border-slate-300 shadow-xs focus-within:ring-2 focus-within:ring-blue-500">
              <Search className="w-4 h-4 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tools by keyword..."
                className="w-full px-3 py-2 text-sm text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onClick={() => onNavigate(`/tools/${tool.slug}`)}
            />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
            <p className="font-semibold text-slate-700">No tools found matching your search query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </section>

      {/* AdSlot - CONTENT_AD_BEFORE_RELATED */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot placement="CONTENT_AD_BEFORE_RELATED" id="tools-directory-bottom-ad" />
      </div>
    </div>
  );
}
