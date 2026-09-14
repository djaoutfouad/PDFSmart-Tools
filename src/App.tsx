import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SideAdLayout } from './components/common/SideAdLayout';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname || '/';

  const handleNavigate = (pathWithQuery: string) => {
    navigate(pathWithQuery);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  // Determine whether this route should render the side desktop advertisements
  const shouldShowSideAds = false;

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Header currentPath={currentPath} onNavigate={handleNavigate} />
        <main className="flex-1">
          <SideAdLayout enabled={shouldShowSideAds}>
            <Outlet />
          </SideAdLayout>
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    </ErrorBoundary>
  );
}
