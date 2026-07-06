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
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${encodeURIComponent(pageUrl)}`;
      return { pageUrl, image, title, text, qrUrl, alt: title };
    });

  const projectCollections = [
    { title: 'Nature-Based Removal', count: dynamic?.totalProjects || 12, img: img('eco-sapling.jpg'), alt: 'Sapling planted at reforestation site' },
    { title: 'Shop Projects', count: dynamic?.dppProducts?.length || 8, img: img('eco-wind2.jpg'), alt: 'Solar farm at golden hour' },
    { title: 'Registry Certified', count: certCount || 5, img: img('uniqhor.jpg'), alt: 'Verified digital carbon certificate' },
    { title: 'Renewable Energy', count: 3, img: img('eco-wind2.jpg'), alt: 'Wind turbines at dawn' },
  ];

  const formatChainDescription = (text) => {
    const words = (text || '').trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '';
    const excerpt = words.slice(0, 50).join(' ');
    return excerpt.endsWith('...') ? excerpt : `${excerpt}...`;
  };

  const fallbackCerts = [
    { id: '100000002043', date: '2026-07-01', tons: '1 Tons', title: 'Piedra Wind Farm', description: 'Utility-scale wind farm displacing fossil-fuel electricity on the Mexican national grid. Each retired tonne is independently verified through a registry-issued certificate, ensuring no double counting and full traceability from project to retirement. The facility generates renewable electricity for communities while reducing greenhouse gas emissions across the region...', image: img('eco-wind2.jpg'), alt: 'Wind turbine at sunrise', url: '#' },
    { id: '100000002044', date: '2026-07-01', tons: '2 Tons', title: 'Coastal Plastic Recovery', description: 'Removes ocean-bound plastic from coastal waterways and funds local collector livelihoods. Recovered material is sorted, processed, and redirected away from marine ecosystems while creating fair-wage employment for coastal communities. Every certificate represents verified environmental benefit with transparent chain-of-custody documentation from collection through final processing...', image: img('eco-ocean.jpg'), alt: 'Hands collecting plastic from the ocean', url: '#' },
    { id: '100000002045', date: '2026-07-01', tons: '3 Tons', title: 'Boreal Reforestation', description: 'Nature-based removal restoring degraded boreal forest with native species and long-term monitoring. Seedlings are planted across previously disturbed land, rebuilding habitat, improving soil health, and sequestering carbon over decades. Independent auditors verify survival rates and growth milestones before credits are issued to the registry...', image: img('eco-sapling.jpg'), alt: 'Sapling planted in dark soil', url: '#' },
    { id: '100000002046', date: '2026-07-01', tons: '1 Tons', title: 'Dairy Methane Capture', description: 'Anaerobic digester capturing methane from dairy operations and converting it into renewable energy. Methane that would otherwise enter the atmosphere is destroyed or repurposed as biogas, reducing the climate impact of agricultural waste. Each tonne retired is backed by metered data and third-party verification on the public registry...', image: img('eco-methane.jpg'), alt: 'Methane capture facility', url: '#' },
  ];

  const chainItems = (dynamic?.certData?.length ? dynamic.certData : []).map((cert) => ({
    id: cert?.originNumber || '',
    date: cert?.createdAt ? new Date(cert.createdAt).toISOString().split('T')[0] : '',
    tons: cert?.quantity ? `${cert.quantity} Tons` : '',
    title: cert?.product?.name || 'Certificate',
    description: formatChainDescription(cert?.product?.shortDescription || cert?.product?.description || ''),
    image: cert?.product?.thumbImage?.[0] || '',
    alt: cert?.product?.name || 'Certificate',
    url: cert?.certificate?.certificateURL || '#',
  }));

  const displayChain = chainItems.length > 0 ? chainItems : fallbackCerts;
  const companyLabel = dynamic?.companyName || 'Uniqohr';
  const brandLogo = dynamic?.logo
    ? `<img src="${dynamic.logo}" alt="${companyLabel}" class="uq-brand-logo" width="131" height="31" />`
    : '';

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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Inter+Tight:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --ink: oklch(0.18 0.005 80);
      --ink-soft: oklch(0.35 0.005 80);
      --canvas: oklch(0.955 0.004 80);
      --canvas-alt: oklch(0.93 0.005 80);
      --section-alt: oklch(0.96 0.004 80);
      --hairline: oklch(0.86 0.006 80);
      --muted: oklch(0.45 0.008 80);
      --ann-bg: #0f1318;
      --header-bg: #2d3339;
      --footer-bg: #2d3339;
      --uq-cream: #f9f8f5;
      --uq-divider: #707070;
      --uq-nav-font: 'Poppins', ui-sans-serif, system-ui, sans-serif;
      --uq-logo-height: 31px;
      --uq-logo-width: 131px;
      --uq-logo-width-mobile: 119px;
      --cream: #f9f8f5;
      --accent-green: #10b981;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      background: var(--canvas);
      color: var(--ink);
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      font-feature-settings: "ss01", "cv11";
      scroll-behavior: smooth;
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

    /* Announcement + Header — Uniqohr */
    .uq-announcement {
      width: 100%;
      background: var(--ann-bg);
      color: var(--uq-cream);
      font-family: var(--uq-nav-font);
      font-size: 16px;
      font-weight: 400;
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
      max-width: 1600px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 16px;
      padding: 11px 24px;
      min-height: 66px;
    }

    @media (min-width: 768px) {
      .uq-header-inner { padding: 11px 40px; }
    }

    .uq-nav-brand {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      color: var(--uq-cream);
      justify-self: start;
    }

    .uq-brand-logo {
      display: block;
      width: var(--uq-logo-width);
      height: var(--uq-logo-height);
      max-width: 100%;
      object-fit: contain;
      object-position: left center;
    }

    @media (max-width: 989px) {
      .uq-brand-logo {
        width: var(--uq-logo-width-mobile);
      }
    }

    .uq-nav-brand .uq-brand-logo {
      object-position: center center;
    }

    .uq-nav-brand-text {
      font-family: var(--uq-nav-font);
      font-size: 16px;
      font-weight: 400;
      color: var(--uq-cream);
      text-transform: lowercase;
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
      justify-self: start;
    }

    .uq-nav-menu-btn svg {
      width: 14px;
      height: 14px;
      display: block;
    }

    .uq-nav-links {
      display: none;
      justify-content: center;
      gap: 32px;
      list-style: none;
      font-size: 14px;
      font-weight: 400;
    }

    @media (min-width: 990px) {
      .uq-nav-links { display: flex; }
    }

    .uq-nav-links a {
      color: rgba(249, 248, 245, 0.7);
      text-decoration: none;
      transition: color 0.2s;
      white-space: nowrap;
    }

    .uq-nav-links a:hover,
    .uq-nav-links a.uq-nav-active {
      color: var(--uq-cream);
    }

    .uq-nav-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 4px;
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
      transition: opacity 0.2s;
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

    .uq-header nav {
      display: block;
    }

    @media (max-width: 989px) {
      .uq-header-inner {
        grid-template-columns: auto 1fr auto;
        padding: 11px 20px;
      }
      .uq-nav-menu-btn { display: inline-flex; }
      .uq-header nav { display: none; }
      .uq-nav-brand { justify-self: center; }
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
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 42px;
      font-weight: 500;
      letter-spacing: -0.04em;
      line-height: 1;
      color: #fff;
      text-transform: uppercase;
    }

    .uq-hero-desc {
      margin-top: 24px;
      max-width: 100%;
      font-size: 16px;
      line-height: 1.7;
      color: rgba(255,255,255,0.9);
    }

    @media (min-width: 768px) {
      .uq-hero-content { padding: 0 48px 96px; }
      .uq-hero-title { font-size: 96px; }
      .uq-hero-desc { font-size: 18px; }
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
      .uq-about-inner { padding: 144px 48px; }
    }

    .uq-about-title {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 36px;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1;
      color: var(--ink);
      margin-bottom: 64px;
      max-width: 768px;
    }

    @media (min-width: 768px) {
      .uq-about-title { font-size: 60px; margin-bottom: 96px; }
    }

    .uq-about-grid {
      display: grid;
      gap: 56px;
      align-items: start;
    }

    @media (min-width: 768px) {
      .uq-about-grid { grid-template-columns: 1fr 1fr; gap: 96px; }
    }

    .uq-about-text { max-width: 520px; }

    .uq-about-text p {
      font-size: 15px;
      line-height: 1.7;
      color: var(--ink-soft);
      margin-top: 24px;
    }

    .uq-about-text p:first-child { margin-top: 0; }

    .uq-about-text p.uq-about-highlight,
    .uq-about-text p strong { color: var(--ink); font-weight: 500; }

    .uq-about-link {
      display: inline-block;
      margin-top: 16px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--ink);
      text-decoration: none;
      border-bottom: 1px solid var(--ink);
      padding-bottom: 4px;
      transition: opacity 0.2s;
    }

    .uq-about-link:hover { opacity: 0.7; }

    .uq-about-img {
      width: 100%;
      aspect-ratio: 4 / 5;
      object-fit: cover;
    }

    /* Verified Chain */
    .uq-verified {
      background: var(--section-alt);
      border-top: 1px solid var(--hairline);
    }

    .uq-verified-inner {
      max-width: 1600px;
      margin: 0 auto;
      padding: 96px 24px;
    }

    @media (min-width: 768px) {
      .uq-verified-inner { padding: 144px 48px; }
    }

    .uq-verified-top {
      display: grid;
      gap: 48px;
      margin-bottom: 64px;
    }

    @media (min-width: 768px) {
      .uq-verified-top {
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        margin-bottom: 96px;
      }
    }

    .uq-verified-title {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 36px;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1;
      color: var(--ink);
      max-width: 448px;
    }

    @media (min-width: 768px) {
      .uq-verified-title { font-size: 60px; }
    }

    .uq-verified-sub {
      margin-top: 24px;
      font-size: 15px;
      line-height: 1.7;
      color: var(--muted);
    }

    .uq-verified-body { max-width: 520px; }

    @media (min-width: 768px) {
      .uq-verified-body { justify-self: end; }
    }

    .uq-verified-body p {
      font-size: 15px;
      line-height: 1.7;
      color: var(--muted);
      margin-top: 24px;
    }

    .uq-verified-body p:first-child {
      color: var(--ink);
      margin-top: 0;
    }

    .uq-verified-cta {
      display: inline-flex;
      align-items: center;
      margin-top: 16px;
      background: var(--ink);
      color: var(--canvas);
      padding: 16px 32px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .uq-verified-cta:hover { opacity: 0.9; }

    .uq-verified-strip-wrap {
      position: relative;
      margin: 0 -24px;
    }

    @media (min-width: 768px) {
      .uq-verified-strip-wrap { margin: 0 -48px; }
    }

    .uq-verified-strip {
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
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
      width: 80vw;
      max-width: 280px;
    }

    @media (min-width: 640px) {
      .uq-verified-strip-item { width: 45vw; max-width: 300px; }
    }

    @media (min-width: 768px) {
      .uq-verified-strip-item { width: calc((100vw - 6rem - 2.25rem) / 4); max-width: 320px; }
    }

    .uq-dpp-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 320px;
      background: #fff;
      border: 1px solid var(--hairline);
      text-decoration: none;
      color: inherit;
      transition: box-shadow 0.2s, transform 0.2s;
    }

    .uq-dpp-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .uq-dpp-card-image {
      flex: 2;
      min-height: 0;
      overflow: hidden;
      background: var(--canvas-alt);
    }

    .uq-dpp-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .uq-dpp-card-divider {
      flex-shrink: 0;
      height: 1px;
      background: var(--hairline);
    }

    .uq-dpp-card-meta {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      min-height: 0;
    }

    .uq-dpp-card-qr {
      flex-shrink: 0;
      width: 56px;
      height: 56px;
      background: #fff;
    }

    .uq-dpp-card-qr img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .uq-dpp-card-text {
      flex: 1;
      min-width: 0;
    }

    .uq-dpp-card-title {
      font-family: var(--uq-nav-font);
      font-size: 13px;
      font-weight: 600;
      line-height: 1.35;
      color: var(--ink);
      margin: 0;
    }

    .uq-dpp-card-desc {
      font-family: var(--uq-nav-font);
      font-size: 11px;
      font-weight: 400;
      line-height: 1.45;
      color: var(--muted);
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
      border-top: 1px solid var(--hairline);
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

    /* Chain of Custody — diamond timeline */
    .uq-chain {
      background: var(--section-alt);
      border-top: 1px solid var(--hairline);
    }

    .uq-chain-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 96px 24px;
    }

    @media (min-width: 768px) {
      .uq-chain-inner { padding: 144px 48px; }
    }

    .uq-chain-title {
      margin-top: 24px;
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 36px;
      font-weight: 400;
      letter-spacing: -0.03em;
      line-height: 1;
      color: var(--ink);
      max-width: 768px;
    }

    @media (min-width: 768px) {
      .uq-chain-title { font-size: 60px; }
    }

    .uq-chain-subtitle {
      margin-top: 24px;
      max-width: 576px;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.7;
      color: var(--muted);
    }

    .uq-chain .eyebrow {
      font-weight: 400;
      letter-spacing: 0.24em;
    }

    .uq-chain-list {
      position: relative;
      list-style: none;
      margin-top: 64px;
    }

    @media (min-width: 768px) {
      .uq-chain-list { margin-top: 96px; }
    }

    .uq-chain-line {
      position: absolute;
      left: 7px;
      top: 8px;
      bottom: 8px;
      width: 1px;
      background: var(--hairline);
    }

    @media (min-width: 768px) {
      .uq-chain-line { left: 9px; }
    }

    .uq-chain-item {
      position: relative;
      padding-left: 32px;
      padding-bottom: 64px;
    }

    @media (min-width: 768px) {
      .uq-chain-item { padding-left: 56px; padding-bottom: 96px; }
    }

    .uq-chain-item:last-child { padding-bottom: 0; }

    .uq-chain-diamond {
      position: absolute;
      left: 0;
      top: 4px;
      width: 15px;
      height: 15px;
      transform: rotate(45deg);
      border: 1px solid var(--ink);
      background: var(--canvas);
      z-index: 1;
    }

    @media (min-width: 768px) {
      .uq-chain-diamond { width: 19px; height: 19px; }
    }

    .uq-chain-card {
      display: grid;
      gap: 32px;
      align-items: start;
    }

    @media (min-width: 768px) {
      .uq-chain-card { grid-template-columns: 1fr auto; gap: 64px; }
    }

    .uq-chain-content { max-width: 576px; }

    .uq-chain-cert-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--hairline);
      background: var(--canvas);
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 400;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--ink);
      text-decoration: none;
      transition: background 0.2s, color 0.2s;
    }

    .uq-chain-cert-tag:hover {
      background: var(--ink);
      color: var(--canvas);
    }

    .uq-chain-date {
      margin-top: 24px;
      font-size: 13px;
      font-weight: 400;
      color: var(--muted);
    }

    .uq-chain-qty {
      margin-top: 4px;
      font-size: 13px;
      font-weight: 400;
      color: var(--muted);
    }

    .uq-chain-qty strong { color: var(--ink); font-weight: 400; }

    .uq-chain-project {
      margin-top: 16px;
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 24px;
      font-weight: 400;
      letter-spacing: -0.02em;
      color: var(--ink);
    }

    @media (min-width: 768px) {
      .uq-chain-project { font-size: 36px; }
    }

    .uq-chain-desc {
      margin-top: 16px;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.7;
      color: var(--muted);
      max-width: 576px;
    }

    .uq-chain-img-wrap {
      width: 100%;
      aspect-ratio: 1;
      overflow: hidden;
      background: var(--canvas-alt);
    }

    @media (min-width: 768px) {
      .uq-chain-img-wrap { width: 320px; }
    }

    @media (min-width: 1024px) {
      .uq-chain-img-wrap { width: 380px; }
    }

    .uq-chain-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Project Grid */
    .uq-projects {
      background: var(--canvas);
      border-top: 1px solid var(--hairline);
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
      transition: opacity 0.5s;
    }

    .uq-projects-visual img.uq-img-hidden { opacity: 0; }
    .uq-projects-visual img.uq-img-visible { opacity: 1; }

    /* Join Community — Uniqohr */
    .uq-join {
      background: #f7f7f7;
    }

    .uq-join-inner {
      max-width: 1600px;
      margin: 0 auto;
      padding: 70px 40px 40px;
    }

    @media (max-width: 749px) {
      .uq-join-inner { padding: 40px 20px; }
    }

    .uq-join-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 16px;
    }

    @media (max-width: 749px) {
      .uq-join-row {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }

    .uq-join-title {
      margin: 0 0 12px;
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: clamp(2.25rem, 4vw, 3rem);
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: #2d3339;
    }

    .uq-join-sub {
      margin: 0;
      font-family: var(--uq-nav-font);
      font-size: 15px;
      font-weight: 400;
      line-height: 1.5;
      color: rgba(45, 51, 57, 0.65);
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
    }

    .uq-join-input {
      flex: 1;
      min-width: 0;
      border: 1px solid #dfdfdf;
      border-radius: 0;
      background: #fff;
      padding: 16px 20px;
      font-size: 16px;
      font-family: var(--uq-nav-font);
      color: #333;
      outline: none;
    }

    .uq-join-input:focus {
      border-color: #2d3339;
    }

    .uq-join-input::placeholder {
      color: rgba(51, 51, 51, 0.55);
    }

    .uq-join-submit {
      flex-shrink: 0;
      width: 56px;
      background: #2d3339;
      color: #f9f8f5;
      border: none;
      border-radius: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }

    .uq-join-submit:hover { opacity: 0.85; }

    .uq-join-submit svg {
      width: 24px;
      height: 24px;
      display: block;
    }

    /* Footer — Uniqohr */
    .uq-footer {
      background: var(--footer-bg);
      color: var(--uq-cream);
      font-family: var(--uq-nav-font);
    }

    .uq-footer-main {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 40px;
    }

    @media (max-width: 768px) {
      .uq-footer-main { padding: 0 20px; }
    }

    .uq-footer-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 48px;
      padding: 48px 0 24px;
    }

    @media (max-width: 989px) {
      .uq-footer-top {
        flex-direction: column;
        gap: 32px;
        padding: 40px 0 20px;
      }
    }

    .uq-footer-brand-col {
      flex: 0 0 auto;
      padding-top: 9px;
    }

    .uq-footer-brand {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      max-width: 230px;
    }

    .uq-footer-brand .uq-brand-logo {
      width: var(--uq-logo-width);
      height: var(--uq-logo-height);
      object-position: left center;
    }

    .uq-footer-brand-text {
      font-family: var(--uq-nav-font);
      font-size: clamp(1.75rem, 3vw, 2rem);
      font-weight: 500;
      color: var(--uq-cream);
      text-transform: lowercase;
      line-height: 1.1;
    }

    .uq-footer-nav-col {
      flex: 1 1 auto;
      min-width: 0;
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
        flex-wrap: wrap;
        gap: 32px 48px;
      }
    }

    .uq-footer-col {
      flex: 1 1 0;
      min-width: 140px;
      max-width: 240px;
      padding: 23px;
    }

    @media (max-width: 989px) {
      .uq-footer-col {
        flex: 1 1 160px;
        max-width: none;
        padding: 0;
      }
    }

    .uq-footer-col h4 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--uq-cream);
      margin: 0 0 16px;
      line-height: 1.2;
      letter-spacing: -0.01em;
    }

    @media (max-width: 768px) {
      .uq-footer-col h4 { font-size: 1.5rem; }
    }

    .uq-footer-col ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .uq-footer-col li { margin-bottom: 0; }

    .uq-footer-col a {
      display: inline-block;
      font-size: 1rem;
      font-weight: 400;
      color: var(--uq-cream);
      text-decoration: none;
      padding: 6px 0;
      line-height: 1.6;
      transition: opacity 0.2s;
    }

    .uq-footer-col a:hover { opacity: 0.7; }

    .uq-footer-divider {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 40px;
    }

    @media (max-width: 768px) {
      .uq-footer-divider { padding: 0 20px; }
    }

    .uq-footer-divider-line {
      display: block;
      height: 1px;
      background: #fff;
      border: 0;
    }

    .uq-footer-utilities {
      max-width: 1600px;
      margin: 0 auto;
      padding: 20px 40px 48px;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 24px;
      color: rgba(249, 248, 245, 0.6);
      font-size: 12px;
      font-weight: 400;
      line-height: 1.5;
    }

    @media (max-width: 749px) {
      .uq-footer-utilities {
        padding: 20px 20px 40px;
        grid-template-columns: 1fr;
        text-align: center;
        justify-items: center;
      }
    }

    .uq-footer-copy {
      color: rgba(249, 248, 245, 0.6);
      font-size: 12px;
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

    .uq-footer-copy a:hover { color: var(--uq-cream); }

    .uq-footer-policies {
      font-size: 12px;
      color: rgba(249, 248, 245, 0.6);
      text-align: center;
    }

    .uq-footer-policies a {
      color: rgba(249, 248, 245, 0.6);
      text-decoration: none;
      transition: color 0.2s;
    }

    .uq-footer-policies a:hover { color: var(--uq-cream); }

    .uq-footer-socials {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 16px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .uq-footer-socials { justify-content: center; }
    }

    .uq-footer-socials a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: rgba(249, 248, 245, 0.6);
      text-decoration: none;
      transition: color 0.2s;
      line-height: 0;
    }

    .uq-footer-socials a:hover { color: var(--uq-cream); }

    .uq-footer-socials svg {
      width: 20px;
      height: 20px;
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
      border-top: 1px solid var(--hairline);
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
    Advanced orders begin 07.01.2026
  </div>

  <!-- Header -->
  <header class="uq-header">
    <div class="uq-header-inner">
      <button type="button" class="uq-nav-menu-btn" aria-label="Menu">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 3.5H13" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"></path>
          <path d="M1 10.5H13" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"></path>
        </svg>
      </button>
      <a href="#top" class="uq-nav-brand">
        ${brandLogo || `<span class="uq-nav-brand-text">${brandName}</span>`}
      </a>
      <nav aria-label="Main">
        <ul class="uq-nav-links">
          <li><a href="#gallery">Shop</a></li>
          <li><a href="#technology">Technology</a></li>
          <li><a href="#gallery">Journal</a></li>
          <li><a href="#about" class="uq-nav-active">About</a></li>
        </ul>
      </nav>
      <div class="uq-nav-actions">
        <button type="button" aria-label="Search" class="uq-nav-icon">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="4.75" stroke="currentColor" stroke-width="1.25"></circle>
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="m12.5 12.5 3.25 3.25"></path>
          </svg>
        </button>
        <button type="button" aria-label="Account" class="uq-nav-icon uq-nav-icon--account">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 17" fill="none">
            <path stroke="currentColor" stroke-linejoin="round" stroke-width="1.25" d="M10.375 3.813a3.063 3.063 0 1 1-6.125 0 3.063 3.063 0 0 1 6.125 0ZM7.313 9.5c-3.667 0-6.24 2.691-6.563 6.125h13.125C13.552 12.191 10.979 9.5 7.312 9.5Z"></path>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Hero -->
  <section class="uq-hero" id="top">
    <img src="${img('eco-hero.jpg')}" alt="Aerial view of misty boreal forest at dawn" class="uq-hero-img" />
    <div class="uq-hero-overlay"></div>
    <div class="uq-hero-content">
      <h1 class="uq-hero-title">${dynamic?.title && dynamic.title !== '' ? dynamic.title : 'Carbon,<br/>accounted for.'}</h1>
      ${dynamic?.description && dynamic.description !== '' ? `<p class="uq-hero-desc">${dynamic.description}</p>` : `<p class="uq-hero-desc">Three decades of environmental expertise.<br/>One verified system.</p>`}
    </div>
  </section>

  <!-- Built from the Ground Up -->
  <section class="uq-about" id="about">
    <div class="uq-about-inner">
      <h2 class="uq-about-title">Built from the Ground Up</h2>
      <div class="uq-about-grid">
        <div class="uq-about-text">
          ${dynamic?.aboutUs && dynamic.aboutUs !== '' ? `<p>${dynamic.aboutUs}</p>` : `
          <p>For more than 30 years, the Ecostance team has worked at the source of environmental accounting — developing carbon measurement frameworks, building transparent supply chains, and helping establish the standards that now define responsible offsetting.</p>
          <p>Long before net zero became a category, we were exploring how natural sequestration and engineered removal could work together to deliver verifiable climate outcomes. The concept was proven. The industry wasn't ready.</p>
          <p class="uq-about-highlight">Today, it is.</p>
          <p>Ecostance brings together decades of measurement, verification and retirement expertise to create a new generation of carbon accounting. Every credit is tracked from source project to retired certificate, guided by a simple belief: <strong>Impact is proven, not claimed.</strong></p>
          `}
          <a href="#technology" class="uq-about-link">Learn about the technology &rarr;</a>
        </div>
        <div>
          <img src="${img('eco-founder.jpg')}" alt="Ecostance field team documenting a reforestation site" loading="lazy" class="uq-about-img" />
        </div>
      </div>
    </div>
  </section>

  <!-- Digital Product Passports -->
  <section class="uq-verified" id="technology">
    <div class="uq-verified-inner">
      <div class="uq-verified-top">
        <div>
          <h2 class="uq-verified-title">Digital Product<br/>Passports</h2>
          <p class="uq-verified-sub">Transparency built into every product.</p>
        </div>
        <div class="uq-verified-body">
          <p>Verified product data begins long before a garment is sold. It starts at the source.</p>
          <p>Every published passport brings together material specifications, environmental reporting, and supply chain records in one place — creating a transparent record that can be independently verified, not simply claimed. Scan the QR code on any product below to open its full digital passport.</p>
          <p>We believe accountability matters more than marketing. That's why we document progress openly, continue working toward higher-integrity product data, and avoid making claims that cannot be verified. Because trust should be earned through evidence.</p>
          <a href="#dpp-passports" class="uq-verified-cta">Access the passports &rarr;</a>
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
                    <img src="${item.qrUrl}" alt="" width="56" height="56" loading="lazy" />
                  </div>
                  <div class="uq-dpp-card-text">
                    <p class="uq-dpp-card-title">${item.title}</p>
                    <p class="uq-dpp-card-desc">${item.text}</p>
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
    <img src="${img('eco-hero.jpg')}" alt="Aerial view of protected forest at dawn" loading="lazy" class="uq-quote-banner" />
  </section>

  <!-- Chain of Custody -->
  <section class="uq-chain" id="chain">
    <div class="uq-chain-inner">
      <p class="eyebrow">Chain of Custody</p>
      <h2 class="uq-chain-title">Carbon Offset Chain of Custody Certificates</h2>
      <p class="uq-chain-subtitle">Every offset we retire is issued a unique certificate that eliminates double counting.<br/>Click any project to see the full record.</p>
      <ol class="uq-chain-list">
        <div class="uq-chain-line" aria-hidden="true"></div>
        ${displayChain.map((c) => `
        <li class="uq-chain-item">
          <span class="uq-chain-diamond" aria-hidden="true"></span>
          <div class="uq-chain-card">
            <div class="uq-chain-content">
              <a href="${c.url}" class="uq-chain-cert-tag" ${c.url !== '#' ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>
                Certificate &ndash; ${c.id}
              </a>
              <p class="uq-chain-date">${c.date}</p>
              <p class="uq-chain-qty">Carbon Offset Quantity: <strong>${c.tons}</strong></p>
              <h3 class="uq-chain-project">${c.title}</h3>
              <p class="uq-chain-desc">${c.description}</p>
            </div>
            ${c.image ? `
            <div class="uq-chain-img-wrap">
              <img src="${c.image}" alt="${c.alt}" loading="lazy" class="uq-chain-img" />
            </div>` : ''}
          </div>
        </li>`).join('')}
      </ol>
    </div>
  </section>

  <!-- Project Grid -->
  <section class="uq-projects" id="gallery">
    <div class="uq-projects-inner">
      <div class="uq-projects-grid">
        <ul class="uq-projects-list" id="uq-project-list">
          ${projectCollections.map((item, i) => `
          <li>
            <a href="#chain" class="uq-projects-link ${i === 1 ? 'uq-active' : ''}" data-index="${i}" tabindex="0">${item.title}<sup>${item.count}</sup></a>
          </li>`).join('')}
        </ul>
        <div class="uq-projects-visual">
          ${projectCollections.map((item, i) => `
          <img src="${item.img}" alt="${item.alt}" loading="lazy" class="${i === 1 ? 'uq-img-visible' : 'uq-img-hidden'}" data-img="${i}" />`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- Join the Community -->
  <section class="uq-join">
    <div class="uq-join-inner">
      <div class="uq-join-row">
        <div class="uq-join-copy">
          <h2 class="uq-join-title">Join the Community</h2>
          <p class="uq-join-sub">Get updates, offers and invites</p>
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
          <a href="#top" class="uq-footer-brand">
            ${brandLogo || `<span class="uq-footer-brand-text">${brandName}</span>`}
          </a>
        </div>
        <div class="uq-footer-nav-col">
          <div class="uq-footer-nav">
            <div class="uq-footer-col">
              <h4>Our Story</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#technology">Technology</a></li>
                <li><a href="#gallery">Journal</a></li>
              </ul>
            </div>
            <div class="uq-footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="${dynamic?.contactPageURL || '#contact'}">Contact</a></li>
                <li><a href="#fit-guide">Fit Guide</a></li>
                <li><a href="#garment-care">Garment Care</a></li>
              </ul>
            </div>
            <div class="uq-footer-col">
              <h4>Shop</h4>
              <ul>
                <li><a href="#gallery">Bestsellers</a></li>
                <li><a href="#gallery">Men</a></li>
                <li><a href="#gallery">Women</a></li>
                <li><a href="#gallery">Accessories</a></li>
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
        &copy; ${new Date().getFullYear()} <a href="#top">${companyLabel}</a>
      </div>
      <div class="uq-footer-policies">
        <a href="#terms">Terms and Policies</a>
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
  </footer>

  <script>
    (function() {
      function bindHover(listId, imageSelector, linkSelector) {
        var items = document.querySelectorAll(listId + ' ' + linkSelector);
        var images = document.querySelectorAll(imageSelector);
        if (!items.length || !images.length) return;
        items.forEach(function(item) {
          function activate() {
            var idx = item.getAttribute('data-index');
            items.forEach(function(el) { el.classList.remove('uq-active'); });
            item.classList.add('uq-active');
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
          item.addEventListener('mouseenter', activate);
          item.addEventListener('focus', activate);
        });
      }
      bindHover('#uq-project-list', '.uq-projects-visual img', '.uq-projects-link');

      document.querySelectorAll('.uq-gallery-scroll').forEach(function(slider) {
        slider.addEventListener('wheel', function(e) {
          if (!e.shiftKey) return;
          if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
          e.preventDefault();
          slider.scrollLeft += e.deltaY;
        }, { passive: false });
      });
    })();
  </script>
</body>
</html>

`;
};
