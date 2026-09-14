import { Home, ChevronRight } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';
import { SITE_CONFIG } from '../config/siteConfig';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export function TermsPage({ onNavigate }: TermsPageProps) {
  return (
    <div id="terms-page" className="space-y-12 pb-16">
      <SeoHead
        title={`Terms of Service - ${SITE_CONFIG.siteName}`}
        description={`Review the terms and conditions for using ${SITE_CONFIG.siteName}' free online PDF utilities.`}
        canonical={`${SITE_CONFIG.canonicalUrl}/terms`}
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
            <span className="text-slate-800 font-semibold">Terms of Service</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500">Last updated: August 20, 2026</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using PDFSmart Tools, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the website immediately.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">2. Description of Service</h2>
            <p>
              PDFSmart Tools provides client-side browser utilities for manipulating, converting, compressing, and protecting digital documents. The service is provided free of charge on an "as is" and "as available" basis.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">3. User Responsibilities & Prohibited Uses</h2>
            <p>
              You agree to use our tools only for lawful purposes. You agree not to attempt to reverse engineer, disrupt, overload, or exploit any portion of the service infrastructure.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">4. Intellectual Property</h2>
            <p>
              All code, website branding, user interface design, logos, and written documentation on PDFSmart Tools are proprietary and protected by copyright and intellectual property laws. You retain full and exclusive ownership over all documents and files processed through the tools.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">5. Disclaimer of Warranties</h2>
            <p>
              We make no representations or warranties regarding the absolute accuracy, completeness, or suitability of any converted or processed file. Users are advised to retain backup copies of all original source documents prior to processing.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, {SITE_CONFIG.siteName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use the service.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">7. Contact Information</h2>
            <p>
              For inquiries regarding these Terms of Service, please contact {SITE_CONFIG.contactName} at{' '}
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
