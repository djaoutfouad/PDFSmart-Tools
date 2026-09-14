import { ShieldCheck, Zap, Heart, CheckCircle2, Home, ChevronRight, Mail } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';
import { SITE_CONFIG } from '../config/siteConfig';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div id="about-page" className="space-y-12 pb-16">
      <SeoHead
        title={`About ${SITE_CONFIG.siteName} - Fast, Private & Free In-Browser PDF Suite`}
        description={`Learn more about ${SITE_CONFIG.siteName}, our privacy-first philosophy, and our modern client-side WebAssembly architecture.`}
        canonical={`${SITE_CONFIG.canonicalUrl}/about`}
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
            <span className="text-slate-800 font-semibold">About Us</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About {SITE_CONFIG.siteName}
          </h1>
          <p className="text-base text-slate-600">
            Empowering individuals and teams with high-speed, client-side PDF utilities designed for local processing.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 leading-relaxed">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
          <p>
            {SITE_CONFIG.siteName} was created to solve a fundamental privacy problem on the modern web: the unnecessary transmission of personal and confidential documents over the internet.
          </p>
          <p>
            Most traditional online PDF converters force users to upload sensitive files—such as financial statements, tax records, identification scans, and proprietary contracts—to remote servers. Even when servers promise automatic deletion, data in transit remains vulnerable.
          </p>
          <p>
            By leveraging modern WebAssembly and client-side browser engines, {SITE_CONFIG.siteName} executes file manipulation routines directly on your own device's CPU and RAM during standard operation. Document contents are designed to process locally in your browser memory rather than being transmitted to our servers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Client Privacy</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Designed for local in-memory execution without remote document storage or tracking of document contents.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant Performance</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              No upload or download queues. Files are processed at local hardware speeds.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Free to Use</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              All 15 tools are free to use with no required accounts, watermarks, or hidden paywalls.
            </p>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Have Questions or Feedback?
            </h3>
            <p className="text-sm text-slate-600">
              Reach out to {SITE_CONFIG.contactName} anytime at{' '}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="text-blue-600 hover:underline font-semibold"
              >
                {SITE_CONFIG.contactEmail}
              </a>.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/contact')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Support</span>
          </button>
        </div>
      </section>
    </div>
  );
}
