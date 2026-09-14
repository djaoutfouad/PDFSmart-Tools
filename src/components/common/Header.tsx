import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  ChevronDown, 
  ShieldCheck, 
  Menu, 
  X
} from 'lucide-react';
import { TOOL_CATEGORIES, TOOLS } from '../../data/toolsData';

interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function Header({ currentPath = '/', onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setSearchOpen(false);
  }, [currentPath]);

  // Keyboard shortcut Ctrl/Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  const filteredTools = searchQuery.trim()
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : TOOLS.slice(0, 6);

  return (
    <>
      <header id="main-header" className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Main Navigation */}
            <div className="flex items-center gap-6 lg:gap-8">
              <a
                id="header-logo"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
                className="flex items-center gap-2.5 group cursor-pointer shrink-0"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight flex items-center gap-1.5">
                    PDFSmart <span className="text-blue-600 font-semibold text-xs px-1.5 py-0.5 rounded-md bg-blue-50 border border-blue-200">Tools</span>
                  </span>
                </div>
              </a>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1">
                <a
                  id="nav-all-tools"
                  href="/tools"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/tools');
                  }}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    currentPath === '/tools' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  All Tools
                </a>

                {/* Categories Dropdown */}
                <div className="relative">
                  <button
                    id="nav-categories-dropdown-btn"
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    onBlur={() => setTimeout(() => setCategoriesOpen(false), 200)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Categories
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {categoriesOpen && (
                    <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      {TOOL_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                        <a
                          key={cat.id}
                          href={`/tools?category=${cat.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/tools?category=${cat.id}`);
                          }}
                          className="block px-4 py-2.5 hover:bg-slate-50 transition-colors"
                        >
                          <div className="font-semibold text-sm text-slate-800">{cat.name}</div>
                          <div className="text-xs text-slate-500 line-clamp-1">{cat.description}</div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  id="nav-guides"
                  href="/guides"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/guides');
                  }}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    currentPath.startsWith('/guides') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Guides
                </a>

                <a
                  id="nav-about"
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/about');
                  }}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    currentPath === '/about' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  About
                </a>

                {/* 1. Contact Us Navigation Item */}
                <a
                  id="nav-contact-us"
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/contact');
                  }}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    currentPath === '/contact' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Contact Us
                </a>
              </nav>
            </div>

            {/* Right side controls: Quick Search, Privacy Badge, Mobile Menu */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Quick Search Button */}
              <button
                id="header-search-trigger"
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Search Tools (Cmd+K / Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search tools...</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-300 rounded text-slate-600 shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Privacy Badge */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>In-Browser Processing</span>
              </div>

              {/* Mobile Menu Toggle Button */}
              <div className="flex md:hidden items-center gap-2">
                <button
                  id="mobile-menu-toggle"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                  aria-label="Toggle navigation menu"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Mobile Search Bar */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-sm bg-slate-100 rounded-lg text-slate-600 font-medium cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                Search PDF tools...
              </span>
              <kbd className="text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">⌘K</kbd>
            </button>

            {/* Mobile Navigation Links */}
            <div className="grid grid-cols-1 gap-1">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
                className={`px-3 py-2 text-sm font-semibold rounded-lg ${
                  currentPath === '/' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Home
              </a>
              <a
                href="/tools"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/tools');
                }}
                className={`px-3 py-2 text-sm font-semibold rounded-lg ${
                  currentPath === '/tools' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                All 15 Tools
              </a>
              <div className="pl-3 py-1 space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Categories
                </div>
                {TOOL_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <a
                    key={cat.id}
                    href={`/tools?category=${cat.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/tools?category=${cat.id}`);
                    }}
                    className="block px-2 py-1 text-sm text-slate-600 hover:text-blue-600"
                  >
                    • {cat.name}
                  </a>
                ))}
              </div>
              <a
                href="/guides"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/guides');
                }}
                className={`px-3 py-2 text-sm font-semibold rounded-lg ${
                  currentPath.startsWith('/guides') ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Guides & Tutorials
              </a>
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/about');
                }}
                className={`px-3 py-2 text-sm font-semibold rounded-lg ${
                  currentPath === '/about' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                About PDFSmart
              </a>
              {/* Contact Us in Mobile Menu */}
              <a
                id="mobile-nav-contact-us"
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/contact');
                }}
                className={`px-3 py-2 text-sm font-semibold rounded-lg ${
                  currentPath === '/contact' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Contact Us
              </a>
            </div>

            {/* Mobile Privacy Callout */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-xl text-emerald-800 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Designed for local processing in your browser memory.</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div
          id="search-modal-backdrop"
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            id="search-modal-container"
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 border-b border-slate-200">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                id="search-tools-input"
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g. merge, compress, protect, word, rotate)..."
                className="w-full py-4 text-base bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                {searchQuery.trim() ? `Search Results (${filteredTools.length})` : 'Popular Tools'}
              </div>

              {filteredTools.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  No tools found matching "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setSearchOpen(false);
                        navigate(`/tools/${tool.slug}`);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 text-left transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                            {tool.name}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">
                            {tool.shortDescription}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-400 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-700 px-2 py-1 rounded">
                        {tool.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Press <kbd className="px-1 py-0.5 bg-white border border-slate-300 rounded font-mono">ESC</kbd> to close</span>
              <span>15 Free Client-Side Tools</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
