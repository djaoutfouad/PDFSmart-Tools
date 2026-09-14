import './lib/fetchPolyfill';
import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';
import './index.css';

// Pre-router bootstrap: Immediately guard and guarantee presence of global SSG state objects
// before ViteReactSSG factory invokes router creation, loader transforms, or hydration.
if (typeof window !== 'undefined') {
  const win = window as any;
  if (!win.__VITE_REACT_SSG_STATIC_LOADER_DATA__) {
    win.__VITE_REACT_SSG_STATIC_LOADER_DATA__ = {};
  }
  if (!win.__VITE_REACT_SSG_STATIC_LOADER_MANIFEST__) {
    win.__VITE_REACT_SSG_STATIC_LOADER_MANIFEST__ = {};
  }
  if (!win.__INITIAL_STATE__) {
    win.__INITIAL_STATE__ = {};
  }
}

export const createRoot = ViteReactSSG(
  {
    routes,
  },
  ({ isClient, initialState }) => {
    // Robust pre-router client initialization
    if (isClient && typeof window !== 'undefined') {
      const win = window as any;
      win.__VITE_REACT_SSG_STATIC_LOADER_DATA__ = win.__VITE_REACT_SSG_STATIC_LOADER_DATA__ || {};
      win.__VITE_REACT_SSG_STATIC_LOADER_MANIFEST__ = win.__VITE_REACT_SSG_STATIC_LOADER_MANIFEST__ || {};
      win.__INITIAL_STATE__ = win.__INITIAL_STATE__ || {};

      // Ensure context initial state is also safe and non-null
      if (!initialState || typeof initialState !== 'object') {
        win.__INITIAL_STATE__ = {};
      }
    }
  },
  {
    // Provide safe transformState to handle any missing or malformed state objects gracefully
    transformState(state) {
      return state && typeof state === 'object' ? state : {};
    },
  }
);

export const createApp = createRoot;

