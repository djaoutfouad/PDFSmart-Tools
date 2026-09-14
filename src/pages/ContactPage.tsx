import { useState, useEffect, useRef, FormEvent } from 'react';
import { 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  Home, 
  ChevronRight, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  User,
  AtSign,
  FileText,
  MessageSquare
} from 'lucide-react';
import { SeoHead } from '../components/common/SeoHead';
import { SITE_CONFIG } from '../config/siteConfig';
import emailjs from 'emailjs-com';

const EMAILJS_CONFIG = {
  serviceId: 'service_wria35t',
  templateId: 'template_d8gh5j7',
  publicKey: 'KkOaLV5ja-W7kDfXv',
};

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [copied, setCopied] = useState(false);
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    try {
      emailjs.init(EMAILJS_CONFIG.publicKey);
    } catch (_) {}
  }, []);

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(SITE_CONFIG.contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedName = fromName.trim();
    const trimmedEmail = fromEmail.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields before submitting.');
      return;
    }

    setIsSending(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const templateParams = {
        from_name: trimmedName,
        from_email: trimmedEmail,
        reply_to: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      console.log('EmailJS response status:', result.status, result.text);

      setStatus('success');
      setFromName('');
      setFromEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('EmailJS submission error:', err);
      setStatus('error');
      setErrorMessage(
        err?.text || err?.message || 'Failed to send your message. Please check your connection or email us directly.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const mailtoFallbackUrl = subject || message
    ? `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    : `mailto:${SITE_CONFIG.contactEmail}`;

  return (
    <div id="contact-page" className="space-y-12 pb-16">
      <SeoHead
        title={`Contact & Support - ${SITE_CONFIG.siteName}`}
        description={`Get in touch with ${SITE_CONFIG.contactName} for technical assistance, questions, or bug reports via ${SITE_CONFIG.contactEmail}.`}
        canonical={`${SITE_CONFIG.canonicalUrl}/contact`}
      />

      {/* Breadcrumb & Header */}
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
            <span className="text-slate-800 font-semibold">Contact</span>
          </nav>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Contact & Support
            </h1>
            <p className="text-base text-slate-600 max-w-2xl">
              Have questions, feedback, or need help with a PDF tool? Fill out the form below and we will get back to you promptly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Direct Email Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-200 flex items-center justify-center text-blue-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {SITE_CONFIG.contactName}
                </h2>
                <p className="text-xs text-slate-500">
                  Official Technical Support & General Inquiries
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                id="contact-email-us-btn"
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Email Us Directly</span>
              </a>

              <button
                id="copy-email-btn"
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                title="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-500 block mb-0.5">Direct Support Inbox</span>
              <a
                id="contact-email-link"
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="font-mono font-semibold text-blue-600 hover:text-blue-800 hover:underline text-base sm:text-lg break-all"
              >
                {SITE_CONFIG.contactEmail}
              </a>
            </div>
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 shrink-0"
            >
              <span>Open Mail App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* EmailJS Contact Form */}
          <div className="pt-2 space-y-5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Send Us a Direct Message</span>
            </div>

            {/* Success Alert */}
            {status === 'success' && (
              <div
                id="contact-form-success"
                className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-900 animate-fadeIn"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-emerald-900">Message Sent Successfully!</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Thank you for reaching out. Your message has been received by our support team and we will respond to your email as soon as possible.
                  </p>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {status === 'error' && (
              <div
                id="contact-form-error"
                className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-900 animate-fadeIn"
              >
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-sm text-rose-900">Unable to Send Message</h4>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    {errorMessage || 'Something went wrong while sending your message.'}
                  </p>
                  <p className="text-xs text-rose-700 pt-1">
                    You can also email us directly at{' '}
                    <a href={mailtoFallbackUrl} className="underline font-semibold hover:text-rose-900">
                      {SITE_CONFIG.contactEmail}
                    </a>.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label 
                    htmlFor="contact-from-name" 
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Your Name <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    id="contact-from-name"
                    name="from_name"
                    type="text"
                    required
                    disabled={isSending}
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 disabled:opacity-60 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label 
                    htmlFor="contact-from-email" 
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                  >
                    <AtSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>Your Email <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    id="contact-from-email"
                    name="from_email"
                    type="email"
                    required
                    disabled={isSending}
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 disabled:opacity-60 transition-colors"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label 
                  htmlFor="contact-subject" 
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Subject <span className="text-rose-500">*</span></span>
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  disabled={isSending}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question about Merge PDF / Bug Report"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 disabled:opacity-60 transition-colors"
                />
              </div>

              {/* Message Content */}
              <div>
                <label 
                  htmlFor="contact-message" 
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Message Content <span className="text-rose-500">*</span></span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  disabled={isSending}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your question, issue, or suggestion in detail..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400 disabled:opacity-60 transition-colors resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={isSending}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message via EmailJS</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Privacy Note */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Your communication is sent directly and securely to our support inbox. We respect your privacy and never sell or share your contact information.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
