import { ShieldCheck, Home, ChevronRight } from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';
import { SITE_CONFIG } from '../config/siteConfig';

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void;
}

export function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  return (
    <div id="privacy-policy-page" className="space-y-12 pb-16">
      <SeoHead
        title="Privacy Policy - PDFSmart Tools"
        description="Read our comprehensive privacy policy. PDFSmart Tools processes files client-side without storing or viewing your documents."
        canonical={`${SITE_CONFIG.canonicalUrl}/privacy-policy`}
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
            <span className="text-slate-800 font-semibold">Privacy Policy</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">Last updated: August 20, 2026</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-emerald-900">
              <strong>Core Privacy Practice:</strong> Our tools are designed to process files locally in your browser memory without transmitting document contents to our servers. Because processing depends on client-side browser environments, users should always maintain backup copies of their original documents.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">1. Document Processing (Local in Browser Memory)</h2>
            <p>
              PDFSmart Tools is built to manipulate and convert documents directly inside your browser memory using WebAssembly and client-side JavaScript libraries. In standard operation, your PDF, DOCX, JPG, or PNG files are not uploaded to or stored on our servers. However, because local execution relies entirely on client hardware, browser capabilities, and available memory, results and behavior may vary depending on the file and browser. Users should always maintain copies of their original files.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">2. External Assets & Service Delivery</h2>
            <p>
              To deliver a fast, responsive user interface without hosting large static bundles locally, our application loads certain operational assets from trusted third-party providers:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
              <li>
                <strong>Google Fonts:</strong> Web fonts are loaded from Google CDN servers to ensure clear, consistent typography.
              </li>
              <li>
                <strong>PDF.js Worker CDN (unpkg.com):</strong> The open-source Mozilla PDF.js rendering worker script runs client-side threads in your browser. Your document contents are never transmitted to unpkg.
              </li>
              <li>
                <strong>EmailJS Contact API:</strong> When you voluntarily submit a message through our Contact & Support page, only the information you enter (your name, email address, subject, and message) is sent to EmailJS to deliver your inquiry to our support team.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">3. Cookies, Analytics & Advertising</h2>
            <p>
              We prioritize minimal tracking and honest disclosure:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
              <li>
                <strong>Current Status:</strong> Our website does not currently display third-party advertisements or use a Consent Management Platform (CMP). We do not claim implementation of IAB Europe TCF frameworks or active ad tracking mechanisms at this time.
              </li>
              <li>
                <strong>Future Advertising Partners:</strong> If third-party advertising partners (such as Google AdSense) are introduced following relevant platform approvals, this policy will be updated with full details on cookies, device identifiers, and opt-out mechanisms before any ad scripts are activated.
              </li>
              <li>
                <strong>Browser Storage:</strong> Local storage or session cookies may be used purely to preserve non-sensitive UI settings, such as selected categories or display preferences.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">4. Limitation of Warranty & Backup Reminder</h2>
            <p>
              The utilities and documentation on PDFSmart Tools are provided on an "as is" and "as available" basis without any express or implied warranty. We do not provide an absolute guarantee of privacy or error-free execution. Always retain original backup copies of your files before performing conversion, compression, or modification routines.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">5. Technical & Analytic Data</h2>
            <p>
              When you visit our website, standard web server logs and privacy-preserving analytics may record anonymous technical details such as your browser type, operating system, referring URL, and pages visited. This data is aggregated and used solely to diagnose technical issues and optimize performance.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">6. Third-Party Links</h2>
            <p>
              Our website may contain links to external reference resources or documentation. We are not responsible for the privacy practices or content of third-party websites.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">7. Updates to This Policy</h2>
            <p>
              We reserve the right to periodically modify this Privacy Policy. Any modifications will be posted directly on this page with an updated revision date.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">8. Contact Information</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please contact {SITE_CONFIG.contactName} by email at{' '}
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
