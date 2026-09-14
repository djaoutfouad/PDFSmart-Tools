import { FileText, ShieldCheck, Heart, Sparkles, Lock, ArrowUpRight, Mail } from 'lucide-react';
import { TOOLS } from '../../data/toolsData';
import { SITE_CONFIG } from '../../config/siteConfig';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  const organizeTools = TOOLS.filter((t) => t.category === 'organize');
  const convertTools = TOOLS.filter((t) => t.category === 'convert');
  const optimizeAndSecurityTools = TOOLS.filter((t) => t.category === 'optimize' || t.category === 'security');

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm mt-auto">
      {/* Top Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-base">Private & Client-Side PDF Utilities</h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  PDF processing is performed locally in your browser whenever supported.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/50 px-3 py-1.5 rounded-full border border-emerald-800/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Local In-Browser Processing
              </span>
              <span className="text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full">
                Free to Use
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand & Mission */}
          <div className="col-span-2 space-y-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="flex items-center gap-2 text-white font-extrabold text-lg"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              PDFSmart Tools
            </a>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              PDFSmart Tools is a suite of fast, privacy-focused online PDF utilities built with client-side WebAssembly and modern web standards. We empower students, researchers, and professionals to work with documents securely without sharing confidential data.
            </p>
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <div className="text-xs font-semibold text-slate-300">
                {SITE_CONFIG.contactName}
              </div>
              <div>
                <a
                  id="footer-contact-email"
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {SITE_CONFIG.contactEmail}
                </a>
              </div>
            </div>
            <div className="pt-1 text-xs text-slate-500">
              © {new Date().getFullYear()} {SITE_CONFIG.siteName}. All rights reserved.
            </div>
          </div>

          {/* Organize PDF */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Organize</h4>
            <ul className="space-y-2 text-xs">
              {organizeTools.map((t) => (
                <li key={t.id}>
                  <a
                    href={`/tools/${t.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/tools/${t.slug}`);
                    }}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {t.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Convert PDF */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Convert</h4>
            <ul className="space-y-2 text-xs">
              {convertTools.map((t) => (
                <li key={t.id}>
                  <a
                    href={`/tools/${t.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/tools/${t.slug}`);
                    }}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {t.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & Optimize + Legal */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Optimize & Security</h4>
            <ul className="space-y-2 text-xs mb-6">
              {optimizeAndSecurityTools.map((t) => (
                <li key={t.id}>
                  <a
                    href={`/tools/${t.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/tools/${t.slug}`);
                    }}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {t.name}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Legal & Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/privacy-policy');
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/terms');
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/cookie-policy"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/cookie-policy');
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/disclaimer');
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Disclaimer
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/about');
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/contact');
                  }}
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact & Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
