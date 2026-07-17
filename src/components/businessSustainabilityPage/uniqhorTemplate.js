export const uniqhorTemplate = (dynamic) => {
  const uiUrl = dynamic?.UI_URL || '';
  const brandName = (dynamic?.companyName || 'uniqohr').toLowerCase();
  const certCount = dynamic?.certData?.length || 0;
  const img = (name) => `${uiUrl}/assets/images/sustainability/${name}`;

  const publishedDppPages = (dynamic?.dppProducts || [])
    .filter((p) => p?.isPublic === true && p?.status !== 2)
    .map((p) => {
      const pub = p?.published || {};
      const businessSlug = p?.businessSlugName || brandName;
      const slug = p?.slug || '';
      const pageUrl = slug ? `${uiUrl}/dpp/${businessSlug}/${slug}` : '#';
      const image = pub?.productImages?.[0] || p?.productImages?.[0] || img('eco-wind2.jpg');
      const title = pub?.formalName || pub?.name || p?.name || 'Digital Product Passport';
      const text = pub?.shortDescription || pub?.Category || 'View digital product passport';
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(pageUrl)}`;
      return { pageUrl, image, title, text, qrUrl, alt: title };
    });

  const offsetTons = (() => {
    const fromDynamic = Number(dynamic?.totalOffset);
    if (Number.isFinite(fromDynamic) && fromDynamic > 0) return Math.round(fromDynamic);
    return (dynamic?.certData || []).reduce((sum, c) => sum + (Number(c?.quantity) || 0), 0);
  })();

  // Carbon-neutrality proof pillars (left hover → right image; keep 4 items for CSS nth-child rules)
  const projectCollections = [
    {
      title: 'Digital Passports',
      count: publishedDppPages.length,
      img: img('pillar-digital-passport.jpg'),
      alt: 'Digital product passport for uniqohr mens long sleeve on phone',
      href: '#technology',
    },
    {
      title: 'Offsets Purchased',
      count: offsetTons,
      img: img('pillar-offsets-retired.jpg'),
      alt: 'Ecostance offsets purchased dashboard with project purchases',
      href: '#chain',
    },
    {
      title: 'Registry Certificates',
      count: certCount,
      img: img('pillar-registry-certificate.jpg'),
      alt: 'Ecostance sustainability certificate presented to uniqohr Ottawa Canada',
      href: '#chain',
    },
    {
      title: 'Projects Supported',
      count: Number(dynamic?.totalProjects) || 0,
      img: img('pillar-projects-supported.jpg'),
      alt: 'Ecostance certified projects: Nitrous Gas Removal, Piedra Wind Farm, Solar Cooker CORSIA, KARIBA REDD+',
      href: '#chain',
    },

  ];

  const formatChainDescription = (text) => {
    const clean = (text || '')
      .replace(/<[^>]*>/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
    if (!clean) return '';

    const words = clean.split(' ');
    const maxWords = 15;

    if (words.length <= maxWords) return clean;
    return `${words.slice(0, maxWords).join(' ')}...`;
  };

  const fallbackCerts = [
    { id: '100000002043', date: '2026-07-01', tons: '1', title: 'Piedra Wind Farm', description: 'Utility-scale wind farm displacing fossil-fuel electricity on the Mexican national grid.', image: img('eco-wind2.jpg'), alt: 'Piedra Wind Farm', url: '#' },
    { id: '100000002044', date: '2026-07-01', tons: '2', title: 'Coastal Plastic Recovery', description: 'Removes ocean-bound plastic from coastal waterways and funds local collector livelihoods.', image: img('eco-ocean.jpg'), alt: 'Coastal Plastic Recovery', url: '#' },
    { id: '100000002045', date: '2026-07-01', tons: '3', title: 'Atlantic Reforestation', description: 'Native-species planting that restores degraded Atlantic Forest and rebuilds habitat corridors.', image: img('eco-sapling.jpg'), alt: 'Atlantic Reforestation', url: '#' },
    { id: '100000002046', date: '2026-07-01', tons: '2', title: 'Rajasthan Solar Array', description: 'Grid-connected solar generation displacing coal-fired power across northern India.', image: img('eco-wind2.jpg'), alt: 'Rajasthan Solar Array', url: '#' },
    { id: '100000002047', date: '2026-07-01', tons: '4', title: 'Sundarbans Mangrove Restoration', description: 'Community-led mangrove replanting that sequesters blue carbon and protects coastal villages.', image: img('eco-hero.jpg'), alt: 'Sundarbans Mangrove Restoration', url: '#' },
    { id: '100000002048', date: '2026-07-01', tons: '1', title: 'Efficient Cookstoves Programme', description: 'High-efficiency cookstoves that cut wood use, indoor smoke, and household carbon footprints.', image: img('eco-methane.jpg'), alt: 'Efficient Cookstoves Programme', url: '#' },
  ];

  const chainItems = (dynamic?.certData?.length ? dynamic.certData : []).map((cert) => ({
    id: cert?.originNumber || '',
    date: cert?.createdAt ? new Date(cert.createdAt).toISOString().split('T')[0] : '',
    tons: cert?.quantity ? String(cert.quantity) : '',
    title: cert?.product?.name || 'Certificate',
    description: formatChainDescription(cert?.product?.shortDescription || cert?.product?.description || ''),
    image: cert?.product?.thumbImage?.[0] || '',
    alt: cert?.product?.name || 'Certificate',
    url: cert?.certificate?.certificateURL || '#',
  }));

  const displayChain = chainItems.length > 0
    ? chainItems
    : fallbackCerts.map((c) => ({
        ...c,
        description: formatChainDescription(c.description),
      }));
  const companyLabel = dynamic?.companyName || 'Uniqohr';
  const defaultLogoUrl = 'https://www.uniqohr.com/cdn/shop/files/LogoUniqohrSquareW.png?height=31&v=1774282937';
  const logoUrl = dynamic?.logo || defaultLogoUrl;
  const brandLogo = `<img src="${logoUrl}" alt="${companyLabel}" class="uq-brand-logo" width="131" height="31" />`;
  const footerLogo = `<img src="${logoUrl}" alt="${companyLabel}" class="uq-footer-logo" width="131" height="29" />`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${dynamic?.title || 'EcoStance Page'}</title>
  <meta name="description" content="${dynamic?.description || ''}">
  <meta property="og:title" content="${dynamic?.ogTitle || dynamic?.title || 'EcoStance Page'}">
  <meta property="og:description" content="${dynamic?.ogDescription || dynamic?.description || ''}">
  <meta property="og:type" content="website">
  ${dynamic?.ogImage ? `<meta property="og:image" content="${dynamic.ogImage}">` : ''}
  ${dynamic?.ogUrl ? `<meta property="og:url" content="${dynamic.ogUrl}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Inter+Tight:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --ink: #0e1319;
      --ink-soft: #565c61;
      --canvas: #f7f7f7;
      --canvas-alt: #ffffff;
      --section-alt: #f7f7f7;
      --hairline: #e5e5e5;
      --muted: #565c61;
      --ann-bg: #0f1318;
      --header-bg: #2d3339;
      --footer-bg: #2d3339;
      --uq-cream: #f9f8f5;
      --uq-divider: #707070;
      --uq-nav-font: 'Poppins', ui-sans-serif, system-ui, sans-serif;
      --uq-logo-height: 31px;
      --uq-logo-width: 131px;
      --uq-logo-width-mobile: 119px;
      --uq-logo-height-mobile: 28px;
      --uq-icon-stroke: 1.5px;
      --cream: #f9f8f5;
      --accent-green: #10b981;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      overflow-y: auto;
      height: auto;
      background: var(--canvas);
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      overflow-y: visible;
      height: auto;
      background: var(--canvas);
      color: var(--ink);
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      font-feature-settings: "ss01", "cv11";
    }

    .font-display {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1.02;
    }

    .eyebrow {
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 500;
      color: var(--muted);
    }

    .eyebrow-light {
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 500;
      color: rgba(255,255,255,0.6);
    }

    /* Announcement + Header — Uniqohr (matches uniqohr.com/pages/about) */
    .uq-announcement {
      width: 100%;
      background: var(--ann-bg);
      color: var(--uq-cream);
      font-family: 'Archivo', var(--uq-nav-font);
      font-size: 0.75rem;
      font-weight: 400;
      line-height: 1;
      letter-spacing: 0;
      padding: 15px 24px;
      text-align: center;
      border-bottom: 1px solid var(--uq-divider);
    }

    .uq-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--header-bg);
      color: var(--uq-cream);
      font-family: var(--uq-nav-font);
    }

    .uq-header-inner {
      position: relative;
      max-width: 1600px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(max-content, 1fr) auto minmax(max-content, 1fr);
      grid-template-areas: 'left center right';
      align-items: center;
      gap: 24px;
      padding: 11px 40px;
      min-height: 66px;
    }

    .uq-header-left {
      grid-area: left;
      display: flex;
      align-items: center;
      justify-self: start;
      gap: 0;
      min-width: 0;
    }

    .uq-header-center {
      grid-area: center;
      justify-self: center;
    }

    .uq-header-right {
      grid-area: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0;
      justify-self: end;
    }

    .uq-nav-brand {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      color: var(--uq-cream);
      line-height: 0;
      flex-shrink: 0;
    }

    .uq-brand-logo {
      display: block;
      width: auto;
      height: var(--uq-logo-height);
      max-width: var(--uq-logo-width);
      object-fit: contain;
      object-position: left center;
    }

    .uq-nav-brand-text {
      font-family: var(--uq-nav-font);
      font-size: 16px;
      font-weight: 400;
      color: var(--uq-cream);
      text-transform: lowercase;
      line-height: 1.2;
    }

    .uq-nav-menu-btn {
      display: none;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--uq-cream);
      cursor: pointer;
      padding: 16px;
      line-height: 0;
    }

    .uq-nav-menu-btn svg {
      width: 14px;
      height: 14px;
      display: block;
    }

    .uq-nav-links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 32px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .uq-nav-links a {
      font-family: var(--uq-nav-font);
      font-size: 0.875rem;
      font-weight: 400;
      line-height: calc(1.1 + 0.5 * min(16 / 14));
      color: rgba(249, 248, 245, 0.7);
      text-decoration: none;
      transition: color 0.2s ease;
      white-space: nowrap;
    }

    .uq-nav-links a:hover,
    .uq-nav-links a.uq-nav-active {
      color: var(--uq-cream);
    }

    .uq-nav-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0;
    }

    .uq-nav-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--uq-cream);
      background: none;
      border: none;
      cursor: pointer;
      padding: 16px;
      line-height: 0;
      transition: opacity 0.2s ease;
    }

    .uq-nav-icon:hover { opacity: 0.7; }

    .uq-nav-icon svg {
      width: 20px;
      height: 20px;
      display: block;
    }

    .uq-nav-icon--account svg {
      width: 15px;
      height: 17px;
    }

    .uq-mobile-nav {
      display: none;
      background: var(--ann-bg);
      border-top: 1px solid rgba(249, 248, 245, 0.08);
      padding: 8px 20px 20px;
    }

    .uq-mobile-nav.is-open { display: block; }

    .uq-mobile-nav ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .uq-mobile-nav li + li { margin-top: 4px; }

    .uq-mobile-nav a {
      display: block;
      padding: 14px 0;
      font-family: var(--uq-nav-font);
      font-size: 1.75rem;
      font-weight: 400;
      line-height: 1.1;
      color: var(--uq-cream);
      text-decoration: none;
    }

    @media (max-width: 989px) {
      .uq-header-inner {
        grid-template-columns: 1fr auto;
        gap: 12px;
        padding: 11px 20px;
      }

      .uq-nav-menu-btn { display: inline-flex; }

      .uq-header-center { display: none; }

      .uq-brand-logo {
        width: auto;
        height: var(--uq-logo-height-mobile);
        max-width: var(--uq-logo-width-mobile);
      }
    }

    @media (min-width: 990px) {
      .uq-nav-menu-btn { display: none; }
      .uq-mobile-nav { display: none !important; }
    }

    /* Hero */
    .uq-hero {
      position: relative;
      height: 88vh;
      min-height: 560px;
      width: 100%;
      overflow: hidden;
    }

    .uq-hero-img {
      position: absolute;
      inset: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .uq-hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
    }

    .uq-hero-content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 24px 64px;
    }

    .uq-hero-title {
      font-family: 'Archivo', 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: clamp(2.25rem, 4.8vw, 3rem);
      font-weight: 300;
      letter-spacing: 0;
      line-height: 1;
      color: #fff;
    }

    .uq-hero-desc {
      margin-top: 24px;
      max-width: 100%;
      font-family: 'Archivo', 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.55;
      color: rgba(255,255,255,0.95);
    }

    @media (min-width: 768px) {
      .uq-hero-content { padding: 0 48px 96px; }
    }

    /* Built from the Ground Up */
    .uq-about {
      background: var(--canvas);
    }

    .uq-about-inner {
      max-width: 1600px;
      margin: 0 auto;
      padding: 96px 24px;
    }

    @media (min-width: 768px) {
      .uq-about-inner { padding: 100px 48px; }
    }

    .uq-about-title {
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
      font-size: 32px;
      font-weight: 400;
      letter-spacing: 0;
      line-height: 1.05;
      color: #0e1319;
      margin: 0 0 12px;
      max-width: 19.5em;
    }

    @media (max-width: 767px) {
      .uq-about-title { font-size: 28px; }
    }

    .uq-about-grid {
      display: grid;
      gap: 56px;
      align-items: center;
    }

    @media (min-width: 768px) {
      .uq-about-grid {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: max(24px, 3.125rem);
      }
    }

    .uq-about-copy {
      max-width: 471px;
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
    }

    .uq-about-text { max-width: 100%; }

    .uq-about-media {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 0;
    }

    @media (max-width: 767px) {
      .uq-about-grid { align-items: start; }
    }

    .uq-about-text p {
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #565c61;
      margin-top: 20px;
    }

    .uq-about-text p:first-child { margin-top: 0; }

    .uq-about-text p.uq-about-highlight,
    .uq-about-text p strong {
      color: #0e1319;
      font-weight: 500;
    }

    .uq-about-link {
      display: inline-block;
      margin-top: 25px;
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #2c333a;
      text-decoration: underline;
      text-underline-offset: 3px;
      transition: opacity 0.2s;
    }

    .uq-about-link:hover {
      opacity: 0.7;
      text-decoration: none;
    }

    .uq-about-img {
      width: 100%;
      aspect-ratio: 4 / 5;
      object-fit: cover;
    }

    /* Digital Product Passports — matches uniqohr Verified Supply Chain */
    .uq-verified {
      background: var(--canvas);
    }

    .uq-verified-inner {
      max-width: 1600px;
      margin: 0 auto;
      padding: 25px 24px 0;
    }

    @media (min-width: 768px) {
      .uq-verified-inner { padding: 25px 48px 0; }
    }

    .uq-verified-top {
      display: grid;
      gap: 32px;
      align-items: center;
      margin-bottom: 35px;
    }

    @media (min-width: 768px) {
      .uq-verified-top {
        grid-template-columns: 45% 55%;
        gap: 0;
        margin-bottom: 0;
      }
    }

    .uq-verified-intro {
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
    }

    @media (min-width: 768px) {
      .uq-verified-body {
        padding-left: 50px;
        padding-bottom: 0;
      }
    }

    .uq-verified-title {
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
      font-size: 32px;
      font-weight: 400;
      letter-spacing: 0;
      line-height: 1.05;
      color: #0e1319;
      margin: 0 0 10px;
      max-width: none;
    }

    @media (max-width: 767px) {
      .uq-verified-title { font-size: 28px; }
    }

    .uq-verified-sub {
      margin: 0;
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      line-height: 1.3;
      color: #2c333a;
      text-decoration: none;
    }

    .uq-verified-body {
      max-width: none;
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
    }

    .uq-verified-body p {
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #565c61;
      margin-top: 20px;
    }

    .uq-verified-body p:first-child {
      color: #565c61;
      margin-top: 0;
    }

    .uq-verified-cta {
      display: inline-flex;
      align-items: center;
      margin-top: 25px;
      margin-bottom: 64px;
      background: #0e1319;
      color: #fff;
      padding: 21px 45px;
      border: 1px solid #0e1319;
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: normal;
      text-transform: uppercase;
      text-decoration: none;
      transition: background 0.2s, color 0.2s;
    }

    .uq-verified-cta:hover {
      background: transparent;
      color: #0e1319;
    }

    .uq-verified-strip-wrap {
      position: relative;
      margin: 0 -24px;
      padding-top: 35px;
      padding-bottom: 48px;
    }

    @media (min-width: 768px) {
      .uq-verified-strip-wrap {
        margin: 0 -48px;
        padding-top: 48px;
        padding-bottom: 48px;
      }
    }

    /* Scroll affordance: minimal black → on hover when more content exists */
    .uq-verified-strip-wrap::after {
      content: '';
      position: absolute;
      right: 24px;
      top: calc(35px + 38%);
      width: 22px;
      height: 14px;
      z-index: 3;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.25s ease;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 14' fill='none'%3E%3Cpath d='M1 7h16M13 2l6 5-6 5' stroke='%23fff' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / contain no-repeat;
    }

    @media (min-width: 768px) {
      .uq-verified-strip-wrap::after { top: calc(48px + 38%); right: 32px; }
    }

    .uq-verified-strip-wrap.has-more:hover::after {
      opacity: 1;
    }

    .uq-verified-strip {
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      cursor: grab;
    }

    .uq-verified-strip a {
      cursor: pointer;
    }

    .uq-verified-strip.is-dragging {
      scroll-snap-type: none;
      scroll-behavior: auto;
    }

    .uq-verified-strip.is-dragging,
    .uq-verified-strip.is-dragging a {
      cursor: grabbing;
      user-select: none;
    }

    .uq-verified-strip.is-dragging a {
      pointer-events: none;
    }

    .uq-verified-strip::-webkit-scrollbar { display: none; }

    .uq-verified-strip-track {
      display: flex;
      gap: 8px;
      padding: 0 24px;
    }

    @media (min-width: 768px) {
      .uq-verified-strip-track { gap: 12px; padding: 0 48px; }
    }

    .uq-verified-strip-item {
      flex-shrink: 0;
      scroll-snap-align: start;
      width: min(75vw, 456px);
    }

    @media (min-width: 640px) {
      .uq-verified-strip-item { width: min(48vw, 456px); }
    }

    @media (min-width: 768px) {
      .uq-verified-strip-item { width: 456px; }
    }

    .uq-dpp-card {
      --uq-dpp-ease: cubic-bezier(0.22, 1, 0.36, 1);
      --uq-dpp-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      height: auto;
      aspect-ratio: 456 / 646;
      background: #fff;
      border: 1px solid var(--hairline);
      text-decoration: none;
      color: inherit;
      isolation: isolate;
      transition:
        box-shadow 0.55s var(--uq-dpp-ease),
        transform 0.55s var(--uq-dpp-ease),
        border-color 0.55s var(--uq-dpp-ease);
    }

    .uq-dpp-card:focus-visible {
      outline: 2px solid var(--ink);
      outline-offset: 3px;
    }

    .uq-dpp-card-image {
      position: relative;
      flex: 2 1 0;
      min-height: 0;
      width: 100%;
      overflow: hidden;
      background: var(--canvas-alt);
    }

    .uq-dpp-card-image::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(20, 24, 28, 0) 45%,
        rgba(20, 24, 28, 0.28) 100%
      );
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.6s var(--uq-dpp-ease);
      z-index: 1;
    }

    .uq-dpp-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
      transform: scale(1) translate3d(0, 0, 0);
      transform-origin: center center;
      transition: transform 0.9s var(--uq-dpp-ease-out), filter 0.7s var(--uq-dpp-ease);
      will-change: transform;
    }

    .uq-dpp-card-divider {
      flex-shrink: 0;
      height: 1px;
      background: var(--hairline);
      transform: scaleX(1);
      transform-origin: center;
      transition:
        background 0.5s var(--uq-dpp-ease),
        transform 0.55s var(--uq-dpp-ease);
    }

    .uq-dpp-card-meta {
      flex: 1 1 0;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 20px 52px;
      box-sizing: border-box;
      transform: translate3d(0, 0, 0);
      transition: transform 0.55s var(--uq-dpp-ease);
    }

    .uq-dpp-card-qr {
      flex-shrink: 0;
      width: 72px;
      height: 72px;
      background: #fff;
      box-shadow: 0 0 0 0 rgba(44, 51, 58, 0);
      transform: scale(1) translate3d(0, 0, 0);
      transition:
        transform 0.55s var(--uq-dpp-ease) 0.04s,
        box-shadow 0.55s var(--uq-dpp-ease) 0.04s;
    }

    .uq-dpp-card-qr img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .uq-dpp-card-text {
      flex: 0 1 auto;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transform: translate3d(0, 0, 0);
      transition: transform 0.55s var(--uq-dpp-ease) 0.08s;
    }

    .uq-dpp-card-title {
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      line-height: 1.3;
      color: #2c333a;
      text-decoration: underline;
      text-underline-offset: 3px;
      margin: 0;
      transition: opacity 0.45s var(--uq-dpp-ease) 0.08s, color 0.45s var(--uq-dpp-ease);
    }

    .uq-dpp-card-product-name {
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      line-height: 1.3;
      color: #565c61;
      text-decoration: none;
      margin: 4px 0 0;
      transition:
        color 0.45s var(--uq-dpp-ease) 0.1s,
        letter-spacing 0.55s var(--uq-dpp-ease) 0.1s,
        transform 0.55s var(--uq-dpp-ease) 0.1s;
    }

    @media (hover: hover) and (pointer: fine) {
      .uq-dpp-card:hover {
        box-shadow:
          0 4px 12px rgba(0, 0, 0, 0.04),
          0 22px 48px rgba(0, 0, 0, 0.12);
        transform: translate3d(0, -8px, 0);
        border-color: rgba(44, 51, 58, 0.28);
      }

      .uq-dpp-card:hover .uq-dpp-card-image::after {
        opacity: 1;
      }

      .uq-dpp-card:hover .uq-dpp-card-image img {
        transform: scale(1.1) translate3d(0, -2.5%, 0);
        filter: brightness(1.03) contrast(1.02);
      }

      .uq-dpp-card:hover .uq-dpp-card-divider {
        background: rgba(44, 51, 58, 0.42);
        transform: scaleX(0.92);
      }

      .uq-dpp-card:hover .uq-dpp-card-meta {
        transform: translate3d(0, -2px, 0);
      }

      .uq-dpp-card:hover .uq-dpp-card-qr {
        transform: scale(1.06) translate3d(0, -1px, 0);
        box-shadow: 0 0 0 1px rgba(44, 51, 58, 0.14);
      }

      .uq-dpp-card:hover .uq-dpp-card-text {
        transform: translate3d(0, -1px, 0);
      }

      .uq-dpp-card:hover .uq-dpp-card-title {
        opacity: 0.72;
        text-decoration: none;
      }

      .uq-dpp-card:hover .uq-dpp-card-product-name {
        color: #2c333a;
        letter-spacing: 0.11em;
        transform: translate3d(0, -1px, 0);
      }

      .uq-dpp-card:active {
        transform: translate3d(0, -3px, 0);
        transition-duration: 0.18s;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .uq-dpp-card,
      .uq-dpp-card-image img,
      .uq-dpp-card-image::after,
      .uq-dpp-card-qr,
      .uq-dpp-card-text,
      .uq-dpp-card-title,
      .uq-dpp-card-product-name,
      .uq-dpp-card-divider,
      .uq-dpp-card-meta {
        transition: none !important;
      }

      .uq-dpp-card:hover,
      .uq-dpp-card:active {
        transform: none;
      }

      .uq-dpp-card:hover .uq-dpp-card-image img,
      .uq-dpp-card:hover .uq-dpp-card-qr,
      .uq-dpp-card:hover .uq-dpp-card-text,
      .uq-dpp-card:hover .uq-dpp-card-meta,
      .uq-dpp-card:hover .uq-dpp-card-product-name,
      .uq-dpp-card:hover .uq-dpp-card-divider {
        transform: none;
        filter: none;
      }

      .uq-dpp-card:hover .uq-dpp-card-product-name {
        letter-spacing: 0.08em;
      }
    }

    .uq-dpp-card-desc {
      font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #565c61;
      margin: 4px 0 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .uq-verified-strip-img {
      aspect-ratio: 4 / 5;
      width: 100%;
      overflow: hidden;
      background: var(--canvas-alt);
    }

    .uq-verified-strip-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Founder Quote */
    .uq-quote {
      background: var(--canvas);
    }

    .uq-quote-inner {
      max-width: 896px;
      margin: 0 auto;
      padding: 112px 24px 64px;
      text-align: center;
    }

    @media (min-width: 768px) {
      .uq-quote-inner { padding: 160px 48px 96px; }
    }

    .uq-quote-text {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 24px;
      font-weight: 500;
      line-height: 1.25;
      letter-spacing: -0.02em;
      color: var(--ink);
    }

    @media (min-width: 768px) {
      .uq-quote-text { font-size: 36px; }
    }

    .uq-quote-author {
      margin-top: 40px;
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .uq-quote-banner {
      width: 100%;
      aspect-ratio: 21 / 9;
      object-fit: cover;
    }

    /* Chain of Custody — matches uniqo-style-showcase.lovable.app */
    .uq-chain {
      --chain-ink: #0e1319;
      --chain-ink-soft: #3d4349;
      --chain-canvas: #ffffff;
      --chain-canvas-alt: var(--canvas);
      --chain-hairline: #c8c8c8;
      --chain-muted: #565c61;
      background: var(--canvas);
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      color: var(--chain-ink);
    }

    .uq-chain-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 80px 24px;
    }

    @media (min-width: 768px) {
      .uq-chain-inner { padding: 96px 24px; }
    }

    .uq-chain-header {
      max-width: 48rem;
    }

    .uq-chain .eyebrow {
      font-size: 11px;
      font-weight: 400;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--chain-muted);
    }

    .uq-chain-title {
      margin-top: 12px;
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      font-size: 1.875rem;
      font-weight: 400;
      letter-spacing: -0.025em;
      line-height: 1.05;
      color: var(--chain-ink);
    }

    @media (min-width: 768px) {
      .uq-chain-title { font-size: 3rem; }
    }

    .uq-chain-subtitle {
      margin-top: 20px;
      max-width: 36rem;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.625;
      color: var(--chain-muted);
    }

    .uq-chain-list {
      position: relative;
      list-style: none;
      margin-top: 64px;
    }

    .uq-chain-line {
      position: absolute;
      left: 0.3125rem;
      top: 8px;
      bottom: 8px;
      width: 1px;
      background: var(--chain-hairline);
      pointer-events: none;
    }

    .uq-chain-item {
      position: relative;
      padding-left: 32px;
    }

    .uq-chain-item + .uq-chain-item {
      margin-top: 56px;
    }

    @media (min-width: 768px) {
      .uq-chain-item { padding-left: 48px; }
    }

    .uq-chain-diamond {
      position: absolute;
      left: 0;
      top: 8px;
      width: 10px;
      height: 10px;
      transform: rotate(45deg);
      border: 1px solid var(--chain-ink);
      background: var(--chain-canvas-alt);
      z-index: 1;
    }

    .uq-chain-card {
      display: grid;
      gap: 24px;
      align-items: start;
      text-decoration: none;
      color: inherit;
    }

    @media (min-width: 768px) {
      .uq-chain-card {
        grid-template-columns: 1fr 240px;
        gap: 40px;
      }
    }

    .uq-chain-cert-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--chain-hairline);
      background: var(--chain-canvas);
      padding: 6px 12px;
      font-size: 10px;
      font-weight: 400;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--chain-ink-soft);
    }

    .uq-chain-cert-tag svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }

    .uq-chain-date {
      margin-top: 16px;
      font-size: 13px;
      font-weight: 400;
      color: var(--chain-muted);
    }

    .uq-chain-qty {
      margin-top: 4px;
      font-size: 13px;
      font-weight: 400;
      color: var(--chain-muted);
    }

    .uq-chain-qty span { color: var(--chain-ink); }

    .uq-chain-project {
      margin-top: 20px;
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      font-size: 1.5rem;
      font-weight: 400;
      letter-spacing: -0.025em;
      line-height: 1.2;
      color: var(--chain-ink);
      text-transform: uppercase;
    }

    @media (min-width: 768px) {
      .uq-chain-project { font-size: 1.875rem; }
    }

    .uq-chain-card:hover .uq-chain-project {
      text-decoration: underline;
      text-underline-offset: 4px;
    }

    .uq-chain-desc {
      margin-top: 12px;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.625;
      color: var(--chain-ink-soft);
      max-width: 36rem;
    }

    .uq-chain-img-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      overflow: hidden;
      background: var(--chain-canvas);
      border-radius: 0;
    }

    @media (min-width: 768px) {
      .uq-chain-img-wrap { width: 240px; }
    }

    .uq-chain-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
      transform: scale(1);
      transform-origin: center center;
      transition: transform 0.7s ease-out;
    }

    .uq-chain-card:hover .uq-chain-img {
      transform: scale(1.04);
    }

    /* Project Grid */
    .uq-projects {
      background: var(--canvas);
    }

    .uq-projects-inner {
      max-width: 1600px;
      margin: 0 auto;
      padding: 96px 24px;
    }

    @media (min-width: 768px) {
      .uq-projects-inner { padding: 144px 48px; }
    }

    .uq-projects-grid {
      display: grid;
      gap: 56px;
      align-items: center;
    }

    @media (min-width: 768px) {
      .uq-projects-grid { grid-template-columns: 1fr 1fr; gap: 80px; }
    }

    .uq-projects-list {
      list-style: none;
    }

    .uq-projects-list li + li { margin-top: 24px; }

    @media (min-width: 768px) {
      .uq-projects-list li + li { margin-top: 32px; }
    }

    .uq-projects-link {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: -0.02em;
      color: rgba(0, 0, 0, 0.35);
      text-decoration: none;
      transition: color 0.3s;
    }

    @media (min-width: 768px) {
      .uq-projects-link { font-size: 48px; }
    }

    .uq-projects-link sup {
      margin-left: 8px;
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      font-size: 11px;
      font-weight: 400;
      vertical-align: super;
      color: var(--muted);
    }

    .uq-projects-link.uq-active,
    .uq-projects-link:hover { color: var(--ink); }

    .uq-projects-visual {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 5;
      overflow: hidden;
      background: var(--canvas-alt);
    }

    .uq-projects-visual img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      z-index: 0;
      transition: opacity 0.5s;
    }

    .uq-projects-visual img.uq-img-hidden { opacity: 0; z-index: 0; }
    .uq-projects-visual img.uq-img-visible { opacity: 1; z-index: 1; }

    .uq-projects-grid:has(.uq-projects-link:hover) .uq-projects-visual img.uq-img-visible,
    .uq-projects-grid:has(.uq-projects-link:focus-visible) .uq-projects-visual img.uq-img-visible {
      opacity: 0;
      z-index: 0;
    }

    .uq-projects-grid:has(.uq-projects-list li:nth-child(1) .uq-projects-link:hover) .uq-projects-visual img[data-img="0"],
    .uq-projects-grid:has(.uq-projects-list li:nth-child(1) .uq-projects-link:focus-visible) .uq-projects-visual img[data-img="0"],
    .uq-projects-grid:has(.uq-projects-list li:nth-child(2) .uq-projects-link:hover) .uq-projects-visual img[data-img="1"],
    .uq-projects-grid:has(.uq-projects-list li:nth-child(2) .uq-projects-link:focus-visible) .uq-projects-visual img[data-img="1"],
    .uq-projects-grid:has(.uq-projects-list li:nth-child(3) .uq-projects-link:hover) .uq-projects-visual img[data-img="2"],
    .uq-projects-grid:has(.uq-projects-list li:nth-child(3) .uq-projects-link:focus-visible) .uq-projects-visual img[data-img="2"],
    .uq-projects-grid:has(.uq-projects-list li:nth-child(4) .uq-projects-link:hover) .uq-projects-visual img[data-img="3"],
    .uq-projects-grid:has(.uq-projects-list li:nth-child(4) .uq-projects-link:focus-visible) .uq-projects-visual img[data-img="3"] {
      opacity: 1;
      z-index: 1;
    }

    /* Join Community — Uniqohr footer-group */
    .uq-join {
      background: var(--canvas);
    }

    .uq-join-inner {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 40px 65px;
    }

    @media (max-width: 768px) {
      .uq-join-inner { padding: 0 20px 65px; }
    }

    .uq-join-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;
    }

    .uq-join-copy,
    .uq-join-form-wrap {
      flex: 1 1 280px;
      min-width: 0;
    }

    .uq-join-title {
      margin: 0;
      font-family: var(--uq-nav-font);
      font-size: 24px;
      font-weight: 400;
      line-height: 40px;
      color: #565c61;
    }

    .uq-join-title strong {
      font-size: 40px;
      font-weight: 400;
      line-height: 40px;
      color: #0e1319;
    }

    @media (max-width: 749px) {
      .uq-join-title {
        font-size: 20px;
        line-height: 30px;
        text-align: center;
      }

      .uq-join-title strong {
        font-size: 32px;
        line-height: 1.1;
      }
    }

    .uq-join-form-wrap {
      width: 100%;
      min-width: 0;
    }

    .uq-join-form {
      width: 100%;
    }

    .uq-join-input-group {
      display: flex;
      align-items: stretch;
      width: 100%;
      background: transparent;
      border: none;
    }

    .uq-join-input {
      flex: 1;
      min-width: 0;
      border: none;
      border-radius: 0;
      background: #fff;
      padding: 16px 28px;
      font-size: 14px;
      font-family: var(--uq-nav-font);
      color: #333;
      outline: none;
      height: 60px;
      line-height: 22.4px;
    }

    .uq-join-input:focus {
      outline: 1px solid #2d3339;
      outline-offset: -1px;
    }

    .uq-join-input::placeholder {
      color: rgba(51, 51, 51, 0.55);
    }

    .uq-join-submit {
      flex-shrink: 0;
      width: 65px;
      height: 60px;
      margin-left: 12px;
      background: #2d333a;
      color: #fff;
      border: none;
      border-radius: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .uq-join-submit:hover { background: #b0b4b7; }

    .uq-join-submit svg {
      width: 32px;
      height: 32px;
      display: block;
    }

    /* Footer — Uniqohr (matches uniqohr.com/pages/about footer-group) */
    .uq-footer {
      background: #2d3339;
      color: #f9f8f5;
      font-family: var(--uq-nav-font);
    }

    .uq-footer-main {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 40px;
    }

    @media (max-width: 768px) {
      .uq-footer-main { padding: 0 20px; }
    }

    .uq-footer-top {
      display: flex;
      align-items: flex-start;
      gap: 0;
    }

    @media (max-width: 989px) {
      .uq-footer-top {
        flex-direction: column;
      }
    }

    .uq-footer-brand-col {
      flex: 1 1 50%;
      min-width: 0;
      padding-top: 20px;
    }

    @media (max-width: 989px) {
      .uq-footer-brand-col { padding-top: 0; }
    }

    .uq-footer-brand {
      display: inline-flex;
      align-items: center;
      padding-top: 20px;
      text-decoration: none;
      max-width: 230px;
    }

    @media (max-width: 989px) {
      .uq-footer-brand { padding-top: 20px; }
    }

    .uq-footer-logo {
      max-width: 230px;
      width: auto;
      height: auto;
      max-height: 29px;
      display: block;
      object-fit: contain;
      object-position: left center;
    }

    .uq-footer-nav-col {
      flex: 1 1 50%;
      min-width: 0;
      padding-top: 20px;
    }

    @media (max-width: 989px) {
      .uq-footer-nav-col { padding-top: 0; }
    }

    .uq-footer-nav {
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      gap: 12px;
      width: 100%;
    }

    @media (max-width: 989px) {
      .uq-footer-nav {
        justify-content: flex-start;
        flex-direction: column;
        gap: 0;
        padding-top: 15px;
      }
    }

    .uq-footer-col {
      flex: 1 1 0;
      min-width: 0;
      padding: 20px;
      text-align: left;
    }

    @media (max-width: 989px) {
      .uq-footer-col {
        flex: 1 1 100%;
        padding: 10px 0 0;
      }
    }

    .uq-footer-col h4 {
      font-family: 'Archivo', sans-serif;
      font-size: 16px;
      font-weight: 700;
      line-height: 17.6px;
      padding-top: 11.2px;
      margin: 0 0 12px;
      color: #f9f8f5;
      letter-spacing: 0;
    }

    .uq-footer-col ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .uq-footer-col li { margin: 0 0 8px; }

    .uq-footer-col li:last-child { margin-bottom: 0; }

    .uq-footer-col a {
      display: inline;
      font-family: var(--uq-nav-font);
      font-size: 16px;
      font-weight: 400;
      color: #f9f8f5;
      text-decoration: none;
      line-height: 25.6px;
    }

    .uq-footer-col a:hover { text-decoration: underline; }

    .uq-footer-divider {
      max-width: 1440px;
      margin: 0 auto;
      padding: 16px 40px;
    }

    @media (max-width: 768px) {
      .uq-footer-divider { padding: 16px 20px; }
    }

    .uq-footer-divider-line {
      display: block;
      height: 1px;
      background: #f9f8f5;
      border: 0;
    }

    .uq-footer-utilities {
      max-width: 1440px;
      margin: 0 auto;
      padding: 20px 40px 16px;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      justify-items: stretch;
      gap: 24px;
      color: rgba(249, 248, 245, 0.6);
      font-family: var(--uq-nav-font);
      font-size: 12px;
      font-weight: 400;
      line-height: 19.2px;
    }

    @media (max-width: 749px) {
      .uq-footer-utilities {
        padding: 20px 20px 12px;
        grid-template-columns: 1fr;
        text-align: center;
        justify-items: center;
      }
    }

    .uq-footer-copy {
      color: rgba(249, 248, 245, 0.6);
      font-size: 12px;
      line-height: 19.2px;
      justify-self: start;
    }

    @media (max-width: 749px) {
      .uq-footer-copy { justify-self: center; }
    }

    .uq-footer-copy a {
      color: rgba(249, 248, 245, 0.6);
      text-decoration: none;
      transition: color 0.2s;
    }

    .uq-footer-copy a:hover { color: #f9f8f5; }

    .uq-footer-policies {
      font-size: 12px;
      line-height: 19.2px;
      color: rgba(249, 248, 245, 0.6);
      text-align: center;
      justify-self: center;
    }

    .uq-footer-policies a {
      color: rgba(249, 248, 245, 0.6);
      text-decoration: none;
      letter-spacing: 0.04em;
      transition: color 0.2s;
    }

    .uq-footer-policies a:hover { color: #f9f8f5; }

    .uq-footer-policies button {
      appearance: none;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      font: inherit;
      font-size: 12px;
      line-height: 19.2px;
      color: rgba(249, 248, 245, 0.6);
      cursor: pointer;
      transition: color 0.2s;
    }

    .uq-footer-policies button:hover { color: #f9f8f5; }

    .uq-footer-powered {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      padding: 8px 40px 40px;
      font-family: var(--uq-nav-font);
      font-size: 12px;
      line-height: 19.2px;
      color: rgba(249, 248, 245, 0.45);
    }

    .uq-footer-powered a {
      color: rgba(249, 248, 245, 0.45);
      text-decoration: none;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      transition: color 0.2s;
    }

    .uq-footer-powered a:hover { color: #f9f8f5; }

    .uq-footer-powered-heart {
      display: inline-flex;
      width: 11px;
      height: 11px;
      color: inherit;
      flex-shrink: 0;
    }

    .uq-footer-powered-heart svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .uq-footer-socials {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      justify-self: end;
      gap: 11.2px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .uq-footer-socials { justify-content: center; }
    }

    .uq-footer-socials a {
      display: block;
      color: rgba(249, 248, 245, 0.6);
      text-decoration: none;
      transition: color 0.2s;
      line-height: 0;
    }

    .uq-footer-socials a:hover { color: #f9f8f5; }

    .uq-footer-socials svg {
      width: 24px;
      height: 24px;
      display: block;
    }

    .uq-sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Social Links */
    .uq-social-section {
      padding: 40px 24px;
      background: var(--canvas);
      text-align: center;
    }

    .uq-social-links {
      display: flex;
      justify-content: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    .uq-social-links a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 40px;
      color: var(--muted);
      text-decoration: none;
      transition: color 0.2s;
    }

    .uq-social-links a:hover { color: var(--ink); }

    .uq-social-links img {
      max-height: 32px;
      max-width: 32px;
    }

    /* Contact Info */
    .uq-contact {
      padding: 24px;
      background: var(--canvas);
      text-align: center;
    }

    .uq-contact p {
      font-size: 14px;
      color: var(--muted);
      margin-bottom: 4px;
    }

    .uq-contact a {
      color: var(--ink);
      text-decoration: none;
    }

    .uq-contact a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <!-- Announcement Bar -->
  <div class="uq-announcement">
    Verified Carbon Neutral Business &mdash; Powered by EcoStance
  </div>

  <!-- Header -->
  <header class="uq-header">
    <div class="uq-header-inner">
      <div class="uq-header-left">
        <button type="button" class="uq-nav-menu-btn" id="uqNavMenuBtn" aria-label="Menu" aria-expanded="false" aria-controls="uqMobileNav">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 3.5H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
            <path d="M1 10.5H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
          </svg>
        </button>
        <a href="#top" class="uq-nav-brand" aria-label="${companyLabel} - Home">
          ${brandLogo}
        </a>
      </div>
      <nav class="uq-header-center" aria-label="Main">
        <ul class="uq-nav-links">
          <li><a href="#about" class="uq-nav-active">About</a></li>
          <li><a href="#technology">Passports</a></li>
          <li><a href="#chain">Certificates</a></li>
          <li><a href="#gallery">Projects</a></li>
        </ul>
      </nav>
      <div class="uq-header-right">
        <div class="uq-nav-actions">
          <button type="button" aria-label="Search" class="uq-nav-icon">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="4.75" stroke="currentColor" stroke-width="1.5"></circle>
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m12.5 12.5 3.25 3.25"></path>
            </svg>
          </button>
          <button type="button" aria-label="Account" class="uq-nav-icon uq-nav-icon--account">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 17" fill="none" aria-hidden="true">
              <path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M10.375 3.813a3.063 3.063 0 1 1-6.125 0 3.063 3.063 0 0 1 6.125 0ZM7.313 9.5c-3.667 0-6.24 2.691-6.563 6.125h13.125C13.552 12.191 10.979 9.5 7.312 9.5Z"></path>
            </svg>
          </button>
          <button type="button" aria-label="Cart" class="uq-nav-icon">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.392 6.875h13.216v8.016c0 .567-.224 1.112-.624 1.513-.4.402-.941.627-1.506.627H5.522a2.13 2.13 0 0 1-1.506-.627 2.15 2.15 0 0 1-.624-1.513zM8.818 2.969h2.333c.618 0 1.211.247 1.649.686a2.35 2.35 0 0 1 .683 1.658v1.562H6.486V5.313c0-.622.246-1.218.683-1.658a2.33 2.33 0 0 1 1.65-.686"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="uq-mobile-nav" id="uqMobileNav">
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#technology">Passports</a></li>
        <li><a href="#chain">Certificates</a></li>
        <li><a href="#gallery">Projects</a></li>
      </ul>
    </div>
  </header>

  <!-- Hero -->
  <section class="uq-hero" id="top">
    <img src="${img('eco-adventure.jpg')}" alt="Mountain bikers descending a rocky alpine trail with snow-capped peaks" class="uq-hero-img" />
    <div class="uq-hero-overlay"></div>
    <div class="uq-hero-content">
      <h1 class="uq-hero-title" style="text-transform: uppercase;">${dynamic?.title && dynamic.title !== '' ? dynamic.title : 'Carbon,<br/>Accounted For.'}</h1>
      <p class="uq-hero-desc">Three decades of environmental expertise. Every tonne measured, retired and verifiable.</p>
    </div>
  </section>

  <!-- Built from the Ground Up -->
  <section class="uq-about" id="about">
    <div class="uq-about-inner">
      <div class="uq-about-grid">
        <div class="uq-about-copy">
          <h2 class="uq-about-title">Built from the Ground Up</h2>
          <div class="uq-about-text">
            ${dynamic?.aboutUs && dynamic.aboutUs !== '' ? `<p>${dynamic.aboutUs}</p>` : `
            <p>For more than 30 years, the Ecostance team has worked at the source of environmental accounting — developing carbon measurement frameworks, building transparent supply chains, and helping establish the standards that now define responsible offsetting.</p>
            <p>Long before net zero became a category, we were exploring how natural sequestration and engineered removal could work together to deliver verifiable climate outcomes. The concept was proven. The industry wasn't ready.</p>
            <p class="uq-about-highlight">Today, it is.</p>
            <p>Ecostance brings together decades of measurement, verification and retirement expertise to create a new generation of carbon accounting. Every credit is tracked from source project to retired certificate, guided by a simple belief: <strong>Impact is proven, not claimed.</strong></p>
            `}
            <a href="#technology" class="uq-about-link">Learn About the technology</a>
          </div>
        </div>
        <div class="uq-about-media">
          <img src="${img('eco-product-wool.jpg')}" alt="Uniqohr black technical jacket with signature blue seam" loading="lazy" class="uq-about-img" />
        </div>
      </div>
    </div>
  </section>

  <!-- Digital Product Passports -->
  <section class="uq-verified" id="technology">
    <div class="uq-verified-inner">
      <div class="uq-verified-top">
        <div class="uq-verified-intro">
          <h2 class="uq-verified-title">Digital Product<br/>Passports</h2>
          <p class="uq-verified-sub">Transparency built into every product.</p>
        </div>
        <div class="uq-verified-body">
          ${dynamic?.description && dynamic.description !== '' && dynamic.description !== 'undefined'
            ? `<p>${dynamic.description}</p>`
            : `
          <p>Verified product data begins long before a garment is sold. It starts at the source.</p>
          <p>Every published passport brings together material specifications, environmental reporting, and supply chain records in one place — creating a transparent record that can be independently verified, not simply claimed. Scan the QR code on any product below to open its full digital passport.</p>
          <p>We believe accountability matters more than marketing. That's why we document progress openly, continue working toward higher-integrity product data, and avoid making claims that cannot be verified. Because trust should be earned through evidence.</p>
          `}
          <a href="#dpp-passports" class="uq-verified-cta">Access the passports</a>
        </div>
      </div>
      ${publishedDppPages.length ? `
      <div class="uq-verified-strip-wrap" id="dpp-passports">
        <div class="uq-verified-strip uq-gallery-scroll">
          <div class="uq-verified-strip-track">
            ${publishedDppPages.map((item) => `
            <div class="uq-verified-strip-item">
              <a href="${item.pageUrl}" class="uq-dpp-card" target="_blank" rel="noopener noreferrer" aria-label="Open ${item.title} digital product passport">
                <div class="uq-dpp-card-image">
                  <img src="${item.image}" alt="${item.alt}" loading="lazy" />
                </div>
                <div class="uq-dpp-card-divider" aria-hidden="true"></div>
                <div class="uq-dpp-card-meta">
                  <div class="uq-dpp-card-qr">
                    <img src="${item.qrUrl}" alt="" width="72" height="72" loading="lazy" />
                  </div>
                  <div class="uq-dpp-card-text">
                    <p class="uq-dpp-card-title">DIGITAL PASSPORT</p>
                    <p class="uq-dpp-card-product-name">${item.title}</p>
                  </div>
                </div>
              </a>
            </div>`).join('')}
            <div style="flex-shrink:0;width:24px;" aria-hidden="true"></div>
          </div>
        </div>
      </div>` : ''}
    </div>
  </section>

  <!-- Founder Quote -->
  <section class="uq-quote">
    <div class="uq-quote-inner">
      <p class="uq-quote-text">&ldquo;Being early in systemic change can be indistinguishable from being wrong — but timing does not invalidate principle.&rdquo;</p>
      <p class="uq-quote-author">Elena Marsh, Founder</p>
    </div>
    <img src="${img('eco-meadow.jpg')}" alt="Flock of sheep grazing in a green mountain valley" loading="lazy" class="uq-quote-banner" />
  </section>

  <!-- Chain of Custody -->
  <section class="uq-chain" id="chain">
    <div class="uq-chain-inner">
      <div class="uq-chain-header">
        <p class="eyebrow">Chain of Custody</p>
        <h2 class="uq-chain-title">Carbon Offset Chain of Custody Certificates</h2>
        <p class="uq-chain-subtitle">Every offset we retire is issued a unique certificate that eliminates double counting. Click any project to see the full record.</p>
      </div>
      <div class="uq-chain-list-wrap">
        <ol class="uq-chain-list">
          <div class="uq-chain-line" aria-hidden="true"></div>
          ${displayChain.map((c) => `
          <li class="uq-chain-item">
            <span class="uq-chain-diamond" aria-hidden="true"></span>
            <a href="${c.url}" class="uq-chain-card" ${c.url !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''}>
              <div>
                <div class="uq-chain-cert-tag">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.5 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v6"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="m14 20 2 2 4-4"/></svg>
                  Certificate &middot; ${c.id}
                </div>
                <p class="uq-chain-date">${c.date}</p>
                <p class="uq-chain-qty">Carbon Offset Quantity: <span>${c.tons} Tons</span></p>
                <h3 class="uq-chain-project">${c.title}</h3>
                <p class="uq-chain-desc">${c.description}</p>
              </div>
              ${c.image ? `
              <div class="uq-chain-img-wrap">
                <img src="${c.image}" alt="${c.alt}" loading="lazy" class="uq-chain-img" />
              </div>` : ''}
            </a>
          </li>`).join('')}
        </ol>
      </div>
    </div>
  </section>

  <!-- Project Grid -->
  <section class="uq-projects" id="gallery">
    <div class="uq-projects-inner">
      <div class="uq-projects-grid">
        <ul class="uq-projects-list" id="uq-project-list">
          ${projectCollections.map((item, i) => `
          <li>
            <a href="${item.href}" class="uq-projects-link ${i === 0 ? 'uq-active' : ''}" data-index="${i}" tabindex="0">${item.title}<sup>${item.count}</sup></a>
          </li>`).join('')}
        </ul>
        <div class="uq-projects-visual">
          ${projectCollections.map((item, i) => `
          <img src="${item.img}" alt="${item.alt}" loading="lazy" class="${i === 0 ? 'uq-img-visible' : 'uq-img-hidden'}" data-img="${i}" />`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- Join the Community -->
  <section class="uq-join">
    <div class="uq-join-inner">
      <div class="uq-join-row">
        <div class="uq-join-copy">
          <p class="uq-join-title"><strong>Join the Community</strong><br/>Get updates, offers and invites</p>
        </div>
        <div class="uq-join-form-wrap">
          <form class="uq-join-form" onsubmit="event.preventDefault()">
            <div class="uq-join-input-group">
              <input type="email" required placeholder="Email address" aria-label="Email address" class="uq-join-input" />
              <button type="submit" aria-label="Sign up" class="uq-join-submit">
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
                  <path clip-rule="evenodd" d="m11.246 5.31759c.0322-.07821.0833-.14723.1486-.20093.0654-.0537.143-.09041.2259-.10686.083-.01645.1688-.01214.2497.01257.0808.0247.1544.06902.214.12902l4.104 4.104c.0478.04765.0857.10426.1115.16659.0259.06232.0392.12913.0392.19661 0 .06747-.0133.13429-.0392.19661-.0258.06233-.0637.11893-.1115.16659l-4.104 4.10401c-.0963.0963-.227.1504-.3632.1504s-.2669-.0541-.3632-.1504-.1504-.227-.1504-.3632.0541-.2669.1504-.3632l3.2288-3.2278h-11.0736c-.13606 0-.26654-.0541-.36275-.15027-.0962-.0962-.15025-.22669-.15025-.36274 0-.13606.05405-.26654.15025-.36275.09621-.0962.22669-.15025.36275-.15025h11.0736l-3.2288-3.2278c-.0721-.07178-.1212-.16335-.1411-.2631s-.0097-.20316.0293-.2971z" fill="currentColor" fill-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  ${dynamic?.showSocial ? `
  <section class="uq-social-section">
    <div class="uq-social-links">
      ${dynamic?.showTwitter && dynamic?.twitter ? dynamic.showSocial('', dynamic.twitter, dynamic.showTwitter) : ''}
      ${dynamic?.showFacebook && dynamic?.facebook ? dynamic.showSocial('', dynamic.facebook, dynamic.showFacebook) : ''}
      ${dynamic?.showLinkedin && dynamic?.linkedin ? dynamic.showSocial('', dynamic.linkedin, dynamic.showLinkedin) : ''}
      ${dynamic?.showInstagram && dynamic?.instagram ? dynamic.showSocial('', dynamic.instagram, dynamic.showInstagram) : ''}
    </div>
  </section>` : ''}

  <!-- Footer -->
  <footer class="uq-footer">
    <div class="uq-footer-main">
      <div class="uq-footer-top">
        <div class="uq-footer-brand-col">
          <a href="https://www.uniqohr.com/" class="uq-footer-brand" target="_blank" rel="noopener noreferrer">
            ${footerLogo}
          </a>
        </div>
        <div class="uq-footer-nav-col">
          <div class="uq-footer-nav">
            <div class="uq-footer-col">
              <h4>Our Story</h4>
              <ul>
                <li><a href="https://www.uniqohr.com/pages/about" target="_blank" rel="noopener noreferrer">About Us</a></li>
                <li><a href="https://www.uniqohr.com/pages/technology" target="_blank" rel="noopener noreferrer">Technology</a></li>
                <li><a href="https://www.uniqohr.com/pages/journal" target="_blank" rel="noopener noreferrer">Journal</a></li>
              </ul>
            </div>
            <div class="uq-footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="https://www.uniqohr.com/pages/faq" target="_blank" rel="noopener noreferrer">FAQ</a></li>
                <li><a href="https://www.uniqohr.com/pages/contact" target="_blank" rel="noopener noreferrer">Contact</a></li>
                <li><a href="https://www.uniqohr.com/pages/fit-guide" target="_blank" rel="noopener noreferrer">Fit Guide</a></li>
                <li><a href="https://www.uniqohr.com/pages/garment-care" target="_blank" rel="noopener noreferrer">Garment Care</a></li>
              </ul>
            </div>
            <div class="uq-footer-col">
              <h4>Shop</h4>
              <ul>
                <li><a href="https://www.uniqohr.com/collections/all" target="_blank" rel="noopener noreferrer">Bestsellers</a></li>
                <li><a href="https://www.uniqohr.com/collections/all" target="_blank" rel="noopener noreferrer">Men</a></li>
                <li><a href="https://www.uniqohr.com/collections/all" target="_blank" rel="noopener noreferrer">Women</a></li>
                <li><a href="https://www.uniqohr.com/collections/all" target="_blank" rel="noopener noreferrer">Accessories</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="uq-footer-divider">
      <span class="uq-footer-divider-line" aria-hidden="true"></span>
    </div>
    <div class="uq-footer-utilities">
      <div class="uq-footer-copy">
        <span>&copy; ${new Date().getFullYear()} ${companyLabel}</span>
      </div>
      <div class="uq-footer-policies">
        <button type="button" class="uq-footer-policy-btn" onclick="window.open('https://www.uniqohr.com/policies/privacy-policy','_blank')">Terms and Policies</button>
      </div>
      <div class="uq-footer-socials">
        ${dynamic?.showFacebook && dynamic?.facebook ? `
        <a href="${dynamic.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <span class="uq-sr-only">Facebook</span>
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M18 10.049C18 5.603 14.419 2 10 2c-4.419 0-8 3.603-8 8.049C2 14.067 4.925 17.396 8.75 18v-5.624H6.719V10.5h2.031V8.844c0-2 1.194-3.104 3.016-3.104.874 0 1.79.156 1.79.156v1.969h-1.008c-.993 0-1.303.616-1.303 1.25v1.485h2.219l-.355 2.875H10.75V18c3.825-.604 6.75-3.933 6.75-7.951Z"/></svg>
        </a>` : `
        <a href="https://www.facebook.com/profile.php?id=61579275997604" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <span class="uq-sr-only">Facebook</span>
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M18 10.049C18 5.603 14.419 2 10 2c-4.419 0-8 3.603-8 8.049C2 14.067 4.925 17.396 8.75 18v-5.624H6.719V10.5h2.031V8.844c0-2 1.194-3.104 3.016-3.104.874 0 1.79.156 1.79.156v1.969h-1.008c-.993 0-1.303.616-1.303 1.25v1.485h2.219l-.355 2.875H10.75V18c3.825-.604 6.75-3.933 6.75-7.951Z"/></svg>
        </a>`}
        ${dynamic?.showInstagram && dynamic?.instagram ? `
        <a href="${dynamic.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <span class="uq-sr-only">Instagram</span>
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.23 3.492c-.84-.037-1.096-.046-3.23-.046-2.144 0-2.39.01-3.238.055-.776.027-1.168.197-1.633.325-.457.128-.79.292-1.088.52-.298.228-.536.5-.714.816-.178.316-.267.66-.267 1.032v8.782c0 .372.089.716.267 1.032.178.316.416.588.714.816.298.228.631.392 1.088.52.457.128.978.298 1.633.325.848.045 1.094.055 3.238.055 2.134 0 2.39-.01 3.23-.055.655-.027 1.176-.197 1.633-.325.457-.128.79-.292 1.088-.52.298-.228.536-.5.714-.816.178-.316.267-.66.267-1.032V6.185c0-.372-.089-.716-.267-1.032a2.07 2.07 0 0 0-.714-.816 2.382 2.382 0 0 0-1.088-.52c-.457-.128-.978-.298-1.633-.325ZM10 6.808a4.192 4.192 0 1 0 0 8.384 4.192 4.192 0 0 0 0-8.384Zm0 1.5a2.692 2.692 0 1 1 0 5.384 2.692 2.692 0 0 1 0-5.384Zm4.423-2.577a.98.98 0 1 0 0 1.96.98.98 0 0 0 0-1.96Z"/></svg>
        </a>` : `
        <a href="https://www.instagram.com/uniqohr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <span class="uq-sr-only">Instagram</span>
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.23 3.492c-.84-.037-1.096-.046-3.23-.046-2.144 0-2.39.01-3.238.055-.776.027-1.168.197-1.633.325-.457.128-.79.292-1.088.52-.298.228-.536.5-.714.816-.178.316-.267.66-.267 1.032v8.782c0 .372.089.716.267 1.032.178.316.416.588.714.816.298.228.631.392 1.088.52.457.128.978.298 1.633.325.848.045 1.094.055 3.238.055 2.134 0 2.39-.01 3.23-.055.655-.027 1.176-.197 1.633-.325.457-.128.79-.292 1.088-.52.298-.228.536-.5.714-.816.178-.316.267-.66.267-1.032V6.185c0-.372-.089-.716-.267-1.032a2.07 2.07 0 0 0-.714-.816 2.382 2.382 0 0 0-1.088-.52c-.457-.128-.978-.298-1.633-.325ZM10 6.808a4.192 4.192 0 1 0 0 8.384 4.192 4.192 0 0 0 0-8.384Zm0 1.5a2.692 2.692 0 1 1 0 5.384 2.692 2.692 0 0 1 0-5.384Zm4.423-2.577a.98.98 0 1 0 0 1.96.98.98 0 0 0 0-1.96Z"/></svg>
        </a>`}
        <a href="https://www.youtube.com/unioqhr" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
          <span class="uq-sr-only">Youtube</span>
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M18.16 5.87c.34 1.309.34 4.08.34 4.08s0 2.771-.34 4.08a2.125 2.125 0 0 1-1.53 1.53c-1.309.34-6.63.34-6.63.34s-5.321 0-6.63-.34a2.125 2.125 0 0 1-1.53-1.53c-.34-1.309-.34-4.08-.34-4.08s0-2.771.34-4.08a2.125 2.125 0 0 1 1.53-1.53c1.309-.34 6.63-.34 6.63-.34s5.321 0 6.63.34a2.125 2.125 0 0 1 1.53 1.53ZM8.3 12.96V7.04L13.3 10l-5 2.96Z"/></svg>
        </a>
        <a href="https://www.tiktok.com/unioqhr" target="_blank" rel="noopener noreferrer" aria-label="Tiktok">
          <span class="uq-sr-only">Tiktok</span>
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.511 1.705h2.74s-.157 3.51 3.795 3.768v2.711s-2.114.129-3.796-1.158l.028 5.606A5.073 5.073 0 1 1 8.437 9.35v-2.74a2.333 2.333 0 1 0 2.074 2.095V1.705Z"/></svg>
        </a>
        ${dynamic?.showTwitter && dynamic?.twitter ? `
        <a href="${dynamic.twitter}" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <span class="uq-sr-only">Twitter</span>
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.273 2.8 10.8 7.822l4.418-5.022h1.768l-5.4 6.142 5.686 7.336h-3.132l-4.4-5.693-5.032 5.693H2.4l5.786-6.57L2.8 2.8h3.473Zm-.815 1.35H4.332l8.818 11.7h1.126L6.458 4.15Z"/></svg>
        </a>` : `
        <a href="https://x.com/unioqhr" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <span class="uq-sr-only">Twitter</span>
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.273 2.8 10.8 7.822l4.418-5.022h1.768l-5.4 6.142 5.686 7.336h-3.132l-4.4-5.693-5.032 5.693H2.4l5.786-6.57L2.8 2.8h3.473Zm-.815 1.35H4.332l8.818 11.7h1.126L6.458 4.15Z"/></svg>
        </a>`}
      </div>
    </div>
    <div class="uq-footer-powered">
      <span>Powered By</span>
      <span class="uq-footer-powered-heart" aria-hidden="true"><svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 14.25S1.5 10.2 1.5 5.9C1.5 3.4 3.35 1.75 5.55 1.75c1.25 0 2.2.6 2.45 1.45C8.25 2.35 9.2 1.75 10.45 1.75 12.65 1.75 14.5 3.4 14.5 5.9c0 4.3-6.5 8.35-6.5 8.35z"/></svg></span>
      <a href="${uiUrl || 'https://ecostance.com'}" target="_blank" rel="noopener noreferrer">ECOSTANCE</a>
    </div>
  </footer>

  <script>
    window.initUniqhorProjectHover = function() {
      var list = document.getElementById('uq-project-list');
      if (!list || list.dataset.hoverBound === 'true') return;
      var items = list.querySelectorAll('.uq-projects-link');
      var images = document.querySelectorAll('.uq-projects-visual img');
      if (!items.length || !images.length) return;
      list.dataset.hoverBound = 'true';

      function activate(link) {
        var idx = link.getAttribute('data-index');
        items.forEach(function(el) { el.classList.remove('uq-active'); });
        link.classList.add('uq-active');
        images.forEach(function(img) {
          if (img.getAttribute('data-img') === idx) {
            img.classList.remove('uq-img-hidden');
            img.classList.add('uq-img-visible');
          } else {
            img.classList.remove('uq-img-visible');
            img.classList.add('uq-img-hidden');
          }
        });
      }

      items.forEach(function(item) {
        item.addEventListener('mouseenter', function() { activate(item); });
        item.addEventListener('focus', function() { activate(item); });
      });
    };

    window.initUniqhorProjectHover();

      var menuBtn = document.getElementById('uqNavMenuBtn');
      var mobileNav = document.getElementById('uqMobileNav');
      if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', function() {
          var isOpen = mobileNav.classList.toggle('is-open');
          menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
      }

      // Active navigation link highlighting on click and scroll (Scroll Spy)
      var navLinks = document.querySelectorAll('.uq-nav-links a');
      var sections = document.querySelectorAll('section[id]');
      
      navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
          var targetId = link.getAttribute('href');
          if (targetId && targetId.startsWith('#')) {
            var targetSection = document.getElementById(targetId.substring(1));
            if (targetSection) {
              e.preventDefault();
              targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
          navLinks.forEach(function(el) { el.classList.remove('uq-nav-active'); });
          link.classList.add('uq-nav-active');
        });
      });

      var mobileLinks = document.querySelectorAll('.uq-mobile-nav a');
      mobileLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
          var targetId = link.getAttribute('href');
          if (targetId && targetId.startsWith('#')) {
            var targetSection = document.getElementById(targetId.substring(1));
            if (targetSection) {
              e.preventDefault();
              targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
          if (mobileNav) mobileNav.classList.remove('is-open');
          if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        });
      });

      window.addEventListener('scroll', function() {
        var scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        var activeSectionId = null;
        
        sections.forEach(function(section) {
          var offsetTop = section.offsetTop - 120;
          var offsetHeight = section.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            activeSectionId = '#' + section.getAttribute('id');
          }
        });

        if (activeSectionId) {
          navLinks.forEach(function(el) {
            if (el.getAttribute('href') === activeSectionId) {
              el.classList.add('uq-nav-active');
            } else {
              el.classList.remove('uq-nav-active');
            }
          });
        }
      });

      document.querySelectorAll('.uq-gallery-scroll').forEach(function(slider) {
        var wrap = slider.closest('.uq-verified-strip-wrap');
        var dragging = false;
        var moved = false;
        var startX = 0;
        var startScroll = 0;
        var lastX = 0;
        var lastTime = 0;
        var velocity = 0;
        var momentumId = 0;

        function updateScrollHint() {
          if (!wrap) return;
          wrap.classList.toggle(
            'has-more',
            slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 2
          );
        }

        function stopMomentum() {
          if (momentumId) cancelAnimationFrame(momentumId);
          momentumId = 0;
        }

        function glide() {
          if (Math.abs(velocity) < 0.15) {
            momentumId = 0;
            return;
          }
          slider.scrollLeft -= velocity;
          velocity *= 0.92;
          momentumId = requestAnimationFrame(glide);
        }

        slider.addEventListener('wheel', function(e) {
          if (!e.shiftKey) return;
          if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
          e.preventDefault();
          stopMomentum();
          slider.scrollLeft += e.deltaY;
        }, { passive: false });

        slider.addEventListener('mousedown', function(e) {
          if (e.button !== 0) return;
          stopMomentum();
          dragging = true;
          moved = false;
          startX = lastX = e.clientX;
          startScroll = slider.scrollLeft;
          lastTime = performance.now();
          velocity = 0;
        });

        window.addEventListener('mousemove', function(e) {
          if (!dragging) return;
          var now = performance.now();
          var dx = e.clientX - startX;
          if (Math.abs(dx) > 4) {
            moved = true;
            slider.classList.add('is-dragging');
          }
          var dt = now - lastTime || 16;
          velocity = (e.clientX - lastX) / dt * 16;
          lastX = e.clientX;
          lastTime = now;
          if (moved) slider.scrollLeft = startScroll - dx;
        });

        window.addEventListener('mouseup', function() {
          if (!dragging) return;
          dragging = false;
          slider.classList.remove('is-dragging');
          if (moved && Math.abs(velocity) > 0.5) glide();
        });

        slider.addEventListener('click', function(e) {
          if (!moved) return;
          e.preventDefault();
          e.stopPropagation();
        }, true);

        slider.addEventListener('scroll', updateScrollHint, { passive: true });
        window.addEventListener('resize', updateScrollHint);
        updateScrollHint();
      });
  </script>
</body>
</html>

`;
};
