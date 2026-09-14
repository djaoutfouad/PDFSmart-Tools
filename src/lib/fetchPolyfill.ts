// Polyfill and protect fetch & SSR/Node globals across all environments and prototype chains
(function setupGlobalsAndFetchProxy() {
  const root: any = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : global);

  // 1. SSR / Node Polyfill for DOMMatrix, Path2D, ImageData
  if (root && typeof root.DOMMatrix === 'undefined') {
    class DOMMatrixPolyfill {
      a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
      m11 = 1; m12 = 0; m13 = 0; m14 = 0;
      m21 = 0; m22 = 1; m23 = 0; m24 = 0;
      m31 = 0; m32 = 0; m33 = 1; m34 = 0;
      m41 = 0; m42 = 0; m43 = 0; m44 = 1;
      is2D = true;
      isIdentity = true;
      constructor() {}
      multiply() { return this; }
      translate() { return this; }
      scale() { return this; }
      rotate() { return this; }
      inverse() { return this; }
      transformPoint(p: any) { return p; }
    }
    root.DOMMatrix = DOMMatrixPolyfill;
    if (typeof window !== 'undefined') {
      (window as any).DOMMatrix = DOMMatrixPolyfill;
    }
  }

  if (root && typeof root.Path2D === 'undefined') {
    class Path2DPolyfill {
      constructor() {}
      addPath() {}
      closePath() {}
      moveTo() {}
      lineTo() {}
      bezierCurveTo() {}
      quadraticCurveTo() {}
      arc() {}
      rect() {}
    }
    root.Path2D = Path2DPolyfill;
  }

  // 2. Fetch Protection & Writable Setters with Static Loader Data Protection
  try {
    const nativeFetch = (root && root.fetch) ? root.fetch.bind(root) : undefined;
    const safeFetch = (input: any, init?: any) => {
      const urlStr = typeof input === 'string' ? input : (input && input.url ? input.url : '');
      let isJsonOrConfigReq = false;
      if (urlStr) {
        const cleanUrl = urlStr.split('?')[0].split('#')[0];
        isJsonOrConfigReq = (
          cleanUrl.includes('static-loader-data') ||
          cleanUrl.endsWith('.json') ||
          cleanUrl.includes('/config') ||
          cleanUrl.includes('/api/')
        );
      }

      if (!nativeFetch) {
        if (isJsonOrConfigReq) {
          return Promise.resolve(new Response('{}', {
            status: 200,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          }));
        }
        return Promise.reject(new Error('Fetch not available'));
      }

      return nativeFetch(input, init).then((res: Response) => {
        if (isJsonOrConfigReq) {
          const ctype = res.headers ? (res.headers.get('content-type') || '') : '';
          // If 404, non-ok, or returning HTML fallback instead of JSON, gracefully return empty JSON object
          if (!res.ok || ctype.includes('text/html')) {
            return new Response('{}', {
              status: 200,
              statusText: 'OK (Synthetic Fallback)',
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
            });
          }
        }
        return res;
      }).catch((err: any) => {
        if (isJsonOrConfigReq) {
          return new Response('{}', {
            status: 200,
            statusText: 'OK (Synthetic Fallback)',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          });
        }
        throw err;
      });
    };

    let currentFetch = nativeFetch ? safeFetch : undefined;

    const makeFetchWritable = (target: any) => {
      if (!target) return;
      try {
        const desc = Object.getOwnPropertyDescriptor(target, 'fetch');
        if (!desc || !desc.set || !desc.writable) {
          Object.defineProperty(target, 'fetch', {
            get() {
              return currentFetch;
            },
            set(newFetch) {
              currentFetch = newFetch;
            },
            configurable: true,
            enumerable: true,
          });
        }
      } catch (_) {
        // Ignore if restricted
      }
    };

    if (typeof Window !== 'undefined' && Window.prototype) {
      makeFetchWritable(Window.prototype);
    }
    if (typeof window !== 'undefined') {
      makeFetchWritable(window);
      window.addEventListener('error', (event) => {
        if (event.message && event.message.includes('Cannot set property fetch of #<Window>')) {
          event.preventDefault();
        }
      });
    }
    if (typeof globalThis !== 'undefined') {
      makeFetchWritable(globalThis);
    }
    if (typeof window !== 'undefined') {
      const win = window as any;
      win.__VITE_REACT_SSG_STATIC_LOADER_DATA__ = win.__VITE_REACT_SSG_STATIC_LOADER_DATA__ || {};
      win.__VITE_REACT_SSG_STATIC_LOADER_MANIFEST__ = win.__VITE_REACT_SSG_STATIC_LOADER_MANIFEST__ || {};
      win.__INITIAL_STATE__ = win.__INITIAL_STATE__ || {};
    }
  } catch (_) {}
})();

export {};
