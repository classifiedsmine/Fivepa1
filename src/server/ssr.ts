/**
 * Full HTML & Schema.org JSON-LD Server-Side Renderer (SSR) Engine
 * Produces complete, semantic, crawler-optimized HTML responses for public marketplace routes.
 */

import { db } from './db';

export function renderPublicPageHTML(urlPath: string, appHtml: string = ''): string {
  const url = new URL(urlPath, 'https://worksphere.io');
  const pathname = url.pathname;

  let title = 'WorkSphere - Global Freelance Marketplace';
  let description = 'Hire elite vetted freelancers, post projects, order multi-tier services, and work with 14-day escrow buyer protection on WorkSphere.';
  let ogType = 'website';
  let jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WorkSphere',
    url: 'https://worksphere.io',
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://worksphere.io/find-projects?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  let contentHtml = '';

  // 1. Homepage Route
  if (pathname === '/' || pathname === '') {
    title = 'WorkSphere - Hire Freelancers & Order Services with 14-Day Escrow Protection';
    description = 'Connect with top-rated developers, designers, and AI engineers. Unified buyer & seller accounts with double-entry ledger security.';
    
    contentHtml = `
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header class="text-center max-w-3xl mx-auto mb-16">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            The Global Marketplace for <span class="text-emerald-600">Serious Builders</span>
          </h1>
          <p class="text-lg text-slate-600 leading-relaxed">
            Hire vetted freelancers, publish customized service packages, and manage contracts protected by an immutable double-entry ledger and 14-day client escrow protection.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/find-projects" class="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition">Browse Projects</a>
            <a href="/offers" class="px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition">Explore Offers</a>
            <a href="/find-freelancers" class="px-6 py-3 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-50 transition">Find Freelancers</a>
          </div>
        </header>

        <section class="mb-16">
          <div class="flex justify-between items-end mb-8">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Explore Top Categories</h2>
              <p class="text-slate-500 text-sm mt-1">Discover expert talent across high-demand disciplines</p>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${db.categories.map(c => `
              <article class="p-6 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 transition">
                <h3 class="text-xl font-bold text-slate-900 mb-2">
                  <a href="/category/${c.slug}" class="hover:text-emerald-600">${c.name}</a>
                </h3>
                <p class="text-slate-600 text-sm mb-4 leading-normal">${c.description}</p>
                <div class="text-xs text-slate-500 font-medium mb-3">
                  ${c.subcategories.map(s => `<span class="inline-block mr-2 mb-1 text-slate-600 font-normal">${s.name} (${s.jobCount})</span>`).join('· ')}
                </div>
                <div class="text-xs text-emerald-600 font-semibold">
                  Popular: ${c.popularSkills.slice(0, 4).join(', ')}
                </div>
              </article>
            `).join('')}
          </div>
        </section>

        <section class="mb-16 bg-slate-900 text-white p-8 sm:p-12 rounded-2xl">
          <div class="max-w-3xl">
            <h2 class="text-2xl sm:text-3xl font-bold mb-4">14-Day Escrow Protection Guarantee</h2>
            <p class="text-slate-300 text-base leading-relaxed mb-6">
              When a milestone deliverable is accepted, funds transition into a 14-day buyer protection period. Freelancers have guaranteed payout certainty while clients maintain full arbitration safety against non-conforming deliverables.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800 text-sm">
              <div>
                <strong class="text-emerald-400 block text-lg font-bold">1. Funded Escrow</strong>
                <span class="text-slate-400">Client payments locked safely prior to work initiation.</span>
              </div>
              <div>
                <strong class="text-emerald-400 block text-lg font-bold">2. Milestone Review</strong>
                <span class="text-slate-400">Unlimited versioning & deliverable file feedback.</span>
              </div>
              <div>
                <strong class="text-emerald-400 block text-lg font-bold">3. 14-Day Clearance</strong>
                <span class="text-slate-400">Automatic release to wallet with multi-tier dispute support.</span>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-16">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">Featured Fixed-Price Offers</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${db.offers.map(o => `
              <article class="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition">
                <img src="${o.images[0]}" alt="${o.title}" class="w-full h-48 object-cover" loading="lazy" />
                <div class="p-5">
                  <div class="flex items-center gap-2 mb-2 text-xs text-slate-500">
                    <span>${o.category}</span>
                    <span>·</span>
                    <span>★ ${o.rating} (${o.reviewCount})</span>
                  </div>
                  <h3 class="font-bold text-slate-900 text-base mb-3 line-clamp-2">
                    <a href="/offers/${o.slug}" class="hover:text-emerald-600">${o.title}</a>
                  </h3>
                  <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                    <span class="text-slate-500">From <strong>$${o.price || o.packages?.basic?.price || 75}</strong></span>
                    <span class="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">${o.deliveryDays || o.packages?.basic?.deliveryDays || 3}d delivery</span>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        </section>
      </main>
    `;
  }

  // 2. Freelancer Profile Route
  else if (pathname.startsWith('/freelancers/')) {
    const username = pathname.replace('/freelancers/', '');
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase()) || db.users[1];
    
    title = `${user.name} – ${user.title} | WorkSphere`;
    description = `${user.bio.slice(0, 150)}... Hire ${user.name} for $${user.hourlyRate}/hr on WorkSphere with 14-day escrow protection.`;
    ogType = 'profile';

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: user.name,
      jobTitle: user.title,
      description: user.bio,
      image: user.avatar,
      address: {
        '@type': 'PostalAddress',
        addressLocality: user.city,
        addressCountry: user.country,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: user.rating,
        reviewCount: user.reviewCount,
      },
    };

    contentHtml = `
      <main class="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div class="bg-white border border-slate-200 rounded-2xl p-8 mb-8">
          <div class="flex flex-col md:flex-row gap-8 items-start">
            <img src="${user.avatar}" alt="${user.name}" class="w-32 h-32 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm" />
            <div class="flex-1">
              <div class="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div>
                  <h1 class="text-3xl font-bold text-slate-900">${user.name}</h1>
                  <p class="text-emerald-700 font-medium">${user.title}</p>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-black text-slate-900">$${user.hourlyRate} <span class="text-sm font-normal text-slate-500">/ hr</span></div>
                  <span class="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-semibold">100% Job Success</span>
                </div>
              </div>
              <p class="text-slate-500 text-sm mb-4">${user.city}, ${user.country} · ${user.rating} ★ (${user.reviewCount} verified reviews) · Response time: ~${user.responseTimeHours}h</p>
              <p class="text-slate-700 text-base leading-relaxed mb-6">${user.bio}</p>
              <div class="flex flex-wrap gap-2">
                ${user.skills.map(s => `<span class="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded font-medium">${s}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </main>
    `;
  }

  // 3. Project Detail Route
  else if (pathname.startsWith('/projects/')) {
    const slug = pathname.replace('/projects/', '');
    const project = db.projects.find(p => p.slug === slug) || db.projects[0];

    title = `${project.title} | WorkSphere Project`;
    description = `${project.description.slice(0, 150)}... Budget: $${project.budget} (${project.pricingModel}).`;

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: project.title,
      description: project.description,
      datePosted: project.createdAt,
      validThrough: '2027-01-01',
      employmentType: 'CONTRACTOR',
      hiringOrganization: {
        '@type': 'Organization',
        name: project.client.name,
      },
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          value: project.budget,
          unitText: project.pricingModel === 'HOURLY' ? 'HOUR' : 'TOTAL',
        },
      },
    };

    contentHtml = `
      <main class="max-w-4xl mx-auto px-4 py-10">
        <div class="bg-white border border-slate-200 rounded-2xl p-8">
          <div class="mb-4 text-xs font-semibold text-emerald-600 uppercase tracking-wide">${project.category} / ${project.subcategory}</div>
          <h1 class="text-3xl font-bold text-slate-900 mb-4">${project.title}</h1>
          <div class="flex items-center gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
            <span>Posted by <strong>${project.client.name}</strong> (${project.client.country})</span>
            <span>·</span>
            <span>Budget: <strong>$${project.budget}</strong> (${project.pricingModel})</span>
            <span>·</span>
            <span>Experience: <strong>${project.experienceLevel}</strong></span>
          </div>
          <div class="prose max-w-none text-slate-700 leading-relaxed mb-8">
            <p>${project.description}</p>
          </div>
          <h3 class="font-bold text-slate-900 mb-3">Required Skills</h3>
          <div class="flex flex-wrap gap-2 mb-8">
            ${project.skills.map(s => `<span class="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded font-medium">${s}</span>`).join('')}
          </div>
        </div>
      </main>
    `;
  }

  // 4. Offer / Service Detail Route
  else if (pathname.startsWith('/offers/')) {
    const slug = pathname.replace('/offers/', '');
    const offer = db.offers.find(o => o.slug === slug) || db.offers[0];

    const offerPrice = offer.price || offer.packages?.basic?.price || 150;
    const offerDays = offer.deliveryDays || offer.packages?.basic?.deliveryDays || 3;

    title = `${offer.title} | WorkSphere Service`;
    description = `${offer.description.slice(0, 150)}... Price: $${offerPrice}.`;

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: offer.title,
      description: offer.description,
      offers: [
        {
          '@type': 'Offer',
          name: 'Core Service Package',
          price: offerPrice,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      ],
    };

    contentHtml = `
      <main class="max-w-5xl mx-auto px-4 py-10">
        <h1 class="text-3xl font-bold text-slate-900 mb-6">${offer.title}</h1>
        <div class="border border-slate-200 rounded-xl bg-white p-8 shadow-sm">
          <div class="text-3xl font-black text-slate-900 mb-3">$${offerPrice}</div>
          <p class="text-base text-slate-600 mb-6 leading-relaxed">${offer.description}</p>
          <div class="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span>⏱ ${offerDays} Days Turnaround</span>
            <span>✓ 14-Day Buyer Protection</span>
          </div>
        </div>
      </main>
    `;
  }

  // 5. General Fallback with full semantic frame
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="https://worksphere.io${pathname}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <link rel="canonical" href="https://worksphere.io${pathname}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">
    <script type="application/ld+json">
      ${JSON.stringify(jsonLd)}
    </script>
    <link rel="stylesheet" href="/src/index.css">
  </head>
  <body class="bg-slate-50 text-slate-900 antialiased font-sans selection:bg-emerald-500 selection:text-white min-h-screen flex flex-col">
    <div id="root">${appHtml || contentHtml}</div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}
