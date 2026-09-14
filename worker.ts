// worker.ts - Cloudflare Workers Static Assets & Route Handler
export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Exact static asset fetch from Cloudflare Assets binding
    let response = await env.ASSETS.fetch(request);

    // 2. Explicit handling for static-loader-data files if direct fetch missed
    if (response.status === 404 && (pathname.startsWith('/static-loader-data/') || pathname.startsWith('/static-loader-data-manifest-'))) {
      const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
      const assetUrl = new URL(`/${cleanPath}`, request.url);
      const assetResponse = await env.ASSETS.fetch(new Request(assetUrl.toString(), request));
      if (assetResponse.status === 200) {
        response = assetResponse;
      }
    }

    // 3. Prevent static JSON configuration files from ever returning HTML fallback
    if (response.status === 404 && (
      pathname.endsWith('.json') ||
      pathname.startsWith('/static-loader-data/') ||
      pathname.startsWith('/static-loader-data-manifest-') ||
      pathname.includes('static-loader-data')
    )) {
      return new Response('{}', {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // 4. If 404 and route has no file extension (e.g. /tools/merge-pdf), try /tools/merge-pdf/index.html
    if (response.status === 404 && !pathname.includes('.')) {
      const cleanPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
      const htmlUrl = new URL(`${cleanPath}/index.html`, request.url);
      const htmlRequest = new Request(htmlUrl.toString(), request);
      const htmlResponse = await env.ASSETS.fetch(htmlRequest);

      if (htmlResponse.status === 200) {
        response = htmlResponse;
      } else {
        // Fallback to root index.html
        const rootIndexRequest = new Request(new URL('/index.html', request.url).toString(), request);
        response = await env.ASSETS.fetch(rootIndexRequest);
      }
    }

    // 5. Set optimal SEO, Content-Type, and Cache-Control headers
    const newHeaders = new Headers(response.headers);

    if (pathname.startsWith('/assets/')) {
      // Hashed assets - cache for 1 year immutable
      newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (pathname.endsWith('.json') || pathname.startsWith('/static-loader-data')) {
      newHeaders.set('Content-Type', 'application/json; charset=utf-8');
      newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (pathname.endsWith('.html') || (!pathname.includes('.') && response.status === 200)) {
      // HTML files - revalidate
      newHeaders.set('Cache-Control', 'public, max-age=0, must-revalidate');
      newHeaders.set('Content-Type', 'text/html; charset=utf-8');
    }

    newHeaders.set('X-Content-Type-Options', 'nosniff');
    newHeaders.set('X-Frame-Options', 'SAMEORIGIN');
    newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};

