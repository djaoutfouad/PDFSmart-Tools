import { Home, ChevronRight } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';
import { SITE_CONFIG } from '../config/siteConfig';

interface DisclaimerPageProps {
  onNavigate: (path: string) => void;
}

export function DisclaimerPage({ onNavigate }: DisclaimerPageProps) {
  return (
    <div id="disclaimer-page" className="space-y-12 pb-16">
      <SeoHead
        title={`Disclaimer - ${SITE_CONFIG.siteName}`}
        description={`Disclaimer and limitation of liability regarding the use of ${SITE_CONFIG.siteName}' client-side document processing suite.`}
        canonical={`${SITE_CONFIG.canonicalUrl}/disclaimer`}
      />

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
            <span className="text-slate-800 font-semibold">Disclaimer</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Disclaimer
          </h1>
          <p className="text-sm text-slate-500">Last updated: August 20, 2026</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">1. Educational & General Purpose Use</h2>
            <p>
              The information, software utilities, and documentation provided on {SITE_CONFIG.siteName} are intended for general document conversion, management, and optimization purposes only.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">2. No Legal or Professional Advice</h2>
            <p>
              {SITE_CONFIG.siteName} is not a law firm, financial institution, or certified electronic signature provider. Nothing on this website constitutes legal, financial, or regulatory compliance advice.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">3. Document Integrity & Backup Responsibility</h2>
            <p>
              While our WebAssembly and client-side processing algorithms undergo rigorous testing to preserve document structure, users are solely responsible for verifying the integrity, formatting, and contents of converted files. Always maintain original backup copies of critical documents.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">4. Contact Information</h2>
            <p>
              If you have any questions or require further clarification regarding this Disclaimer, please contact {SITE_CONFIG.contactName} at{' '}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="text-blue-600 hover:underline font-semibold"
              >
                {SITE_CONFIG.contactEmail}
              </a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
