import { Home, ChevronRight } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';
import { SITE_CONFIG } from '../config/siteConfig';

interface CookiePolicyPageProps {
  onNavigate: (path: string) => void;
}

export function CookiePolicyPage({ onNavigate }: CookiePolicyPageProps) {
  return (
    <div id="cookie-policy-page" className="space-y-12 pb-16">
      <SeoHead
        title={`Cookie Policy - ${SITE_CONFIG.siteName}`}
        description={`Learn how ${SITE_CONFIG.siteName} uses cookies, local storage, and advertising identifiers.`}
        canonical={`${SITE_CONFIG.canonicalUrl}/cookie-policy`}
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
            <span className="text-slate-800 font-semibold">Cookie Policy</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-sm text-slate-500">Last updated: August 20, 2026</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your computer or mobile device when you browse websites. They are widely used to ensure websites function properly, remember user preferences, and provide analytical data to website operators.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">2. How We Use Cookies</h2>
            <p>
              {SITE_CONFIG.siteName} uses minimal cookies. Our document processing operates entirely inside browser memory and does not require tracking cookies. We may use cookies for:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
              <li><strong>Essential Preferences:</strong> Remembering UI preferences such as dark/light contrast or category filters.</li>
              <li><strong>Anonymous Analytics:</strong> Measuring overall site traffic and error rates to improve stability.</li>
              <li><strong>Advertising (Google AdSense):</strong> Third-party advertising partners may place cookies to serve relevant ads based on browsing history where permitted.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">3. Managing and Disabling Cookies</h2>
            <p>
              You can modify your browser settings to decline all cookies or to alert you when a cookie is being placed. If you choose to disable cookies, the core client-side PDF tools will continue to function normally.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">4. Contact Information</h2>
            <p>
              If you have any questions about our use of cookies, please contact {SITE_CONFIG.contactName} at{' '}
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
