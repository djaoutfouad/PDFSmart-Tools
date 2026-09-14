import { RouteObject, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import App from './App';
import { HomePage } from './pages/HomePage';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { GuidesPage } from './pages/GuidesPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';

function HomePageRoute() {
  const navigate = useNavigate();
  return <HomePage onNavigate={(path) => navigate(path)} />;
}

function ToolsDirectoryPageRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  return (
    <ToolsDirectoryPage
      initialCategory={searchParams.get('category') || 'all'}
      onNavigate={(path) => navigate(path)}
    />
  );
}

function ToolDetailPageRoute() {
  const navigate = useNavigate();
  const params = useParams<{ slug: string }>();
  return (
    <ToolDetailPage
      toolSlug={params.slug || ''}
      onNavigate={(path) => navigate(path)}
    />
  );
}

function GuidesPageRoute() {
  const navigate = useNavigate();
  return <GuidesPage onNavigate={(path) => navigate(path)} />;
}

function GuideDetailPageRoute() {
  const navigate = useNavigate();
  const params = useParams<{ slug: string }>();
  return (
    <GuideDetailPage
      guideSlug={params.slug || ''}
      onNavigate={(path) => navigate(path)}
    />
  );
}

function AboutPageRoute() {
  const navigate = useNavigate();
  return <AboutPage onNavigate={(path) => navigate(path)} />;
}

function ContactPageRoute() {
  const navigate = useNavigate();
  return <ContactPage onNavigate={(path) => navigate(path)} />;
}

function PrivacyPolicyPageRoute() {
  const navigate = useNavigate();
  return <PrivacyPolicyPage onNavigate={(path) => navigate(path)} />;
}

function TermsPageRoute() {
  const navigate = useNavigate();
  return <TermsPage onNavigate={(path) => navigate(path)} />;
}

function CookiePolicyPageRoute() {
  const navigate = useNavigate();
  return <CookiePolicyPage onNavigate={(path) => navigate(path)} />;
}

function DisclaimerPageRoute() {
  const navigate = useNavigate();
  return <DisclaimerPage onNavigate={(path) => navigate(path)} />;
}

function NotFoundRoute() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
      <h1 className="text-3xl font-extrabold text-slate-900">404 - Page Not Found</h1>
      <p className="text-slate-600 text-sm">
        The requested URL does not match any PDF tool or document page.
      </p>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
      >
        Return to Homepage
      </button>
    </div>
  );
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePageRoute /> },
      { path: 'tools', element: <ToolsDirectoryPageRoute /> },
      { path: 'tools/:slug', element: <ToolDetailPageRoute /> },
      { path: 'guides', element: <GuidesPageRoute /> },
      { path: 'guides/:slug', element: <GuideDetailPageRoute /> },
      { path: 'about', element: <AboutPageRoute /> },
      { path: 'contact', element: <ContactPageRoute /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPageRoute /> },
      { path: 'terms', element: <TermsPageRoute /> },
      { path: 'cookie-policy', element: <CookiePolicyPageRoute /> },
      { path: 'disclaimer', element: <DisclaimerPageRoute /> },
      { path: '*', element: <NotFoundRoute /> },
    ],
  },
];
