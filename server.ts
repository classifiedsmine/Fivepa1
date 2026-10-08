/**
 * Full-Stack Express Server with Vite Dev Middleware & SSR Engine for Google Cloud Run
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './src/server/api.ts';
import { renderPublicPageHTML } from './src/server/ssr.ts';
import { MigrationRunner } from './src/server/db/migration.ts';
import { BackgroundJobService } from './src/server/services/BackgroundJobService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Flag to track database readiness
let isDatabaseReady = false;

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Middleware to ensure DB is initialized before responding to API/SSR
  app.use(async (req, res, next) => {
    if (!isDatabaseReady && (req.path.startsWith('/api') || req.headers.accept?.includes('text/html'))) {
      // If DB not ready yet, return a 503 Service Unavailable or just a JSON error
      if (req.path.startsWith('/api')) {
        return res.status(503).json({ error: 'System initializing. Please try again in a few seconds.' });
      }
    }
    next();
  });

  // Mount Authoritative API Routes
  app.use('/api', apiRouter);

  // Health check endpoint for Google Cloud Run
  app.get('/healthz', (req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy', uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  // Robots.txt & Sitemap.xml endpoints for search engine crawlers
  app.get('/robots.txt', (req: Request, res: Response) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /wallet\nDisallow: /messages\n\nSitemap: https://worksphere.io/sitemap.xml`);
  });

  app.get('/sitemap.xml', (req: Request, res: Response) => {
    res.type('application/xml');
    const urls = [
      'https://worksphere.io/',
      'https://worksphere.io/find-projects',
      'https://worksphere.io/offers',
      'https://worksphere.io/find-freelancers',
      'https://worksphere.io/category/development-it',
      'https://worksphere.io/category/ai-machine-learning',
      'https://worksphere.io/category/design-creative',
      'https://worksphere.io/category/writing-translation',
      'https://worksphere.io/category/sales-marketing',
      'https://worksphere.io/faq',
      'https://worksphere.io/terms',
      'https://worksphere.io/privacy',
      'https://worksphere.io/escrow-policy',
      'https://worksphere.io/dispute-policy',
    ];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(u => `<url><loc>${u}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`).join('\n  ')}
</urlset>`;
    res.send(sitemap);
  });

  let vite: any;
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
  }

  // SSR / HTML Handler for Public Routes & Googlebot
  app.use('*', async (req: Request, res: Response, next) => {
    const url = req.originalUrl;
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(req.headers['user-agent'] || '');
    const isPublicRoute =
      url === '/' ||
      url.startsWith('/find-projects') ||
      url.startsWith('/offers') ||
      url.startsWith('/find-freelancers') ||
      url.startsWith('/category/') ||
      url.startsWith('/freelancers/') ||
      url.startsWith('/projects/') ||
      url.startsWith('/faq') ||
      url.startsWith('/terms') ||
      url.startsWith('/privacy') ||
      url.startsWith('/escrow-policy') ||
      url.startsWith('/dispute-policy');

    try {
      if (isBot || (isPublicRoute && req.headers.accept?.includes('text/html'))) {
        const fullHtml = renderPublicPageHTML(url);
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(fullHtml);
      }

      if (!isProd && vite) {
        let template = await vite.transformIndexHtml(url, `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WorkSphere - Global Freelance Marketplace</title>
    <meta name="description" content="High-performance global freelance marketplace with 14-day escrow protection, unified accounts, and multi-tier services." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-slate-50 text-slate-900 antialiased font-sans selection:bg-emerald-500 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } else {
        res.sendFile(path.resolve(__dirname, 'dist/index.html'));
      }
    } catch (e: any) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(e);
      }
      next(e);
    }
  });

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 WorkSphere Server running on port ${PORT} (Cloud Run compatible)`);
    
    // Trigger migrations in the background so the server starts immediately
    MigrationRunner.runMigrations()
      .then(() => {
        isDatabaseReady = true;
        console.log('✅ Database migrations and seeding completed.');
        BackgroundJobService.startScheduler();
      })
      .catch((err) => {
        console.error('❌ Database migration failed:', err);
      });
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
