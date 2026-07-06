export const uniqhorTemplate = (dynamic) => {
  const uniqueProducts = [];
  const productNamesSeen = new Set();
  if (dynamic?.certData) {
    for (const cert of dynamic.certData) {
      if (cert?.product?.name && !productNamesSeen.has(cert.product.name)) {
        productNamesSeen.add(cert.product.name);
        uniqueProducts.push(cert.product);
      }
    }
  }

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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Inter+Tight:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --ink: oklch(0.18 0.005 80);
      --ink-soft: oklch(0.35 0.005 80);
      --canvas: oklch(0.955 0.004 80);
      --canvas-alt: oklch(0.93 0.005 80);
      --hairline: oklch(0.86 0.006 80);
      --muted: oklch(0.45 0.008 80);
      --nav: oklch(0.24 0.005 80);
      --nav-deep: oklch(0.20 0.005 80);
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

    /* Announcement Bar */
    .uq-announcement {
      width: 100%;
      background: var(--nav-deep);
      color: #fff;
      font-size: 13px;
      padding: 10px 0;
      text-align: center;
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    /* Header */
    .uq-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--nav);
      color: #fff;
    }

    .uq-header-inner {
      max-width: 1600px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
    }

    .uq-nav-brand {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 24px;
      font-weight: 500;
      letter-spacing: -0.03em;
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      text-transform: lowercase;
    }

    .uq-nav-logo {
      height: 36px;
      width: auto;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }

    .uq-nav-links {
      display: flex;
      justify-content: center;
      gap: 40px;
      list-style: none;
      font-size: 15px;
      font-weight: 500;
    }

    .uq-nav-links a {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .uq-nav-links a:hover { opacity: 0.7; }

    .uq-nav-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 20px;
    }

    .uq-nav-actions a {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .uq-nav-actions a:hover { opacity: 0.7; }

    @media (max-width: 768px) {
      .uq-header-inner { padding: 16px; }
      .uq-nav-links { display: none; }
      .uq-nav-actions { display: none; }
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

    /* About Founder Section */
    .uq-about {
      background: var(--canvas);
    }

    .uq-about-inner {
      max-width: 1600px;
      margin: 0 auto;
      display: grid;
      gap: 40px;
      padding: 96px 24px;
      align-items: center;
    }

    .uq-about-img {
      width: 100%;
      aspect-ratio: 3 / 4;
      object-fit: cover;
    }

    .uq-about-text {
      max-width: 520px;
    }

    .uq-about-text h2 {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1.02;
      color: var(--ink);
    }

    .uq-about-text p {
      margin-top: 24px;
      font-size: 15px;
      line-height: 1.7;
      color: var(--ink-soft);
    }

    .uq-about-text p.uq-about-highlight {
      color: var(--ink);
      font-weight: 500;
    }

    .uq-about-link {
      display: inline-block;
      margin-top: 24px;
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

    .uq-about-img-wrap {
      order: 1;
    }
    .uq-about-text {
      order: 2;
    }

    @media (min-width: 768px) {
      .uq-about-inner {
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        padding: 144px 48px;
      }
      .uq-about-img-wrap { order: 2; }
      .uq-about-text { order: 1; }
      .uq-about-text h2 { font-size: 48px; }
    }

    /* Stats Band */
    .uq-stats {
      border-top: 1px solid var(--hairline);
      border-bottom: 1px solid var(--hairline);
      background: var(--canvas);
    }

    .uq-stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      max-width: 1600px;
      margin: 0 auto;
    }

    .uq-stat-item {
      padding: 48px 24px;
      text-align: center;
      border-right: 1px solid var(--hairline);
    }

    .uq-stat-item:last-child { border-right: none; }

    .uq-stat-value {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 48px;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: var(--ink);
    }

    .uq-stat-label {
      margin-top: 12px;
      font-size: 11px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--muted);
    }

    @media (max-width: 768px) {
      .uq-stats-grid { grid-template-columns: 1fr; }
      .uq-stat-item { border-right: none; border-bottom: 1px solid var(--hairline); padding: 32px 16px; }
      .uq-stat-item:last-child { border-bottom: none; }
      .uq-stat-value { font-size: 40px; }
    }

    /* Product Gallery */
    .uq-gallery {
      background: var(--canvas);
      border-top: 1px solid var(--hairline);
      padding: 96px 0;
    }

    .uq-gallery-header {
      max-width: 1600px;
      margin: 0 auto 56px;
      padding: 0 24px;
    }

    .uq-gallery-header h2 {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1.02;
      margin-top: 16px;
      color: var(--ink);
    }

    .uq-gallery-header p {
      margin-top: 16px;
      font-size: 15px;
      line-height: 1.7;
      color: var(--muted);
      max-width: 520px;
    }

    @media (min-width: 768px) {
      .uq-gallery { padding: 128px 0; }
      .uq-gallery-header { padding: 0 48px; margin-bottom: 56px; }
      .uq-gallery-header h2 { font-size: 48px; }
    }

    .uq-gallery-scroll {
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      overscroll-behavior-x: contain;
      cursor: grab;
      user-select: none;
    }

    .uq-gallery-scroll::-webkit-scrollbar { display: none; }

    .uq-gallery-track {
      display: flex;
      gap: 16px;
      padding: 0 24px 8px;
    }

    @media (min-width: 768px) {
      .uq-gallery-track { gap: 24px; padding: 0 48px 8px; }
    }

    .uq-gallery-card {
      flex-shrink: 0;
      scroll-snap-align: start;
      width: 75vw;
      text-decoration: none;
      color: inherit;
      display: block;
    }

    @media (min-width: 640px) { .uq-gallery-card { width: 45vw; } }
    @media (min-width: 768px) { .uq-gallery-card { width: 32vw; } }
    @media (min-width: 1024px) { .uq-gallery-card { width: 24vw; max-width: 420px; } }

    .uq-gallery-img-wrap {
      aspect-ratio: 3 / 4;
      width: 100%;
      overflow: hidden;
      background: var(--canvas-alt);
      position: relative;
    }

    .uq-gallery-img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .uq-gallery-card:hover .uq-gallery-img {
      transform: scale(1.04);
    }

    .uq-gallery-card-title {
      margin-top: 16px;
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 18px;
      font-weight: 500;
      letter-spacing: -0.03em;
      color: var(--ink);
    }

    .uq-gallery-card-type {
      margin-top: 4px;
      font-size: 12px;
      letter-spacing: 0.08em;
      color: var(--muted);
    }

    .uq-gallery-hint {
      max-width: 1600px;
      margin: 24px auto 0;
      padding: 0 24px;
      font-size: 12px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--muted);
    }

    @media (min-width: 768px) {
      .uq-gallery-hint { padding: 0 48px; }
    }

    /* Hover Story (Uniqohr Method) */
    .uq-method {
      background: oklch(0.16 0.005 80);
      color: #fff;
      padding: 96px 24px;
    }

    .uq-method-inner {
      max-width: 1600px;
      margin: 0 auto;
    }

    .uq-method-header {
      margin-bottom: 64px;
      max-width: 640px;
    }

    .uq-method-header h2 {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1.02;
      margin-top: 16px;
      color: #fff;
    }

    @media (min-width: 768px) {
      .uq-method { padding: 144px 48px; }
      .uq-method-header h2 { font-size: 48px; }
    }

    .uq-method-grid {
      display: grid;
      gap: 40px;
    }

    @media (min-width: 768px) {
      .uq-method-grid {
        grid-template-columns: 1fr 1fr;
        gap: 64px;
      }
    }

    .uq-method-list {
      list-style: none;
      border-top: 1px solid rgba(255,255,255,0.15);
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }

    .uq-method-item {
      padding: 32px 0;
      border-bottom: 1px solid rgba(255,255,255,0.15);
      cursor: pointer;
      transition: opacity 0.3s;
    }

    .uq-method-item:last-child { border-bottom: none; }

    .uq-method-item-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 24px;
    }

    .uq-method-item-label {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1.02;
      color: #fff;
    }

    .uq-method-item-num {
      font-size: 12px;
      letter-spacing: 0.16em;
      color: rgba(255,255,255,0.5);
    }

    .uq-method-item-copy {
      margin-top: 12px;
      font-size: 15px;
      line-height: 1.6;
      max-width: 480px;
      color: rgba(255,255,255,0.9);
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: max-height 0.5s, opacity 0.5s;
    }

    .uq-method-item.uq-active .uq-method-item-copy {
      max-height: 100px;
      opacity: 1;
    }

    .uq-method-item:not(.uq-active) {
      opacity: 0.4;
    }

    .uq-method-item:not(.uq-active):hover {
      opacity: 0.7;
    }

    @media (min-width: 768px) {
      .uq-method-item-label { font-size: 48px; }
      .uq-method-item { padding: 40px 0; }
    }

    .uq-method-visual {
      position: relative;
      aspect-ratio: 4 / 5;
      overflow: hidden;
      background: rgba(0,0,0,0.3);
    }

    @media (min-width: 768px) {
      .uq-method-visual {
        aspect-ratio: auto;
        min-height: 560px;
      }
    }

    .uq-method-visual img {
      position: absolute;
      inset: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      transition: opacity 0.7s;
    }

    .uq-method-visual img.uq-img-hidden {
      opacity: 0;
    }

    .uq-method-visual img.uq-img-visible {
      opacity: 1;
    }

    /* DPP Info Cards */
    .uq-dpp {
      background: var(--canvas);
      border-top: 1px solid var(--hairline);
      padding: 96px 24px;
    }
    .uq-dpp-inner {
      max-width: 1200px;
      margin: 0 auto;
    }
    .uq-dpp-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-top: 48px;
    }
    @media (min-width: 640px) {
      .uq-dpp-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 1024px) {
      .uq-dpp-grid { grid-template-columns: repeat(3, 1fr); }
    }
    .uq-dpp-card {
      background: #fff;
      border: 1px solid var(--hairline);
      border-radius: 8px;
      padding: 20px;
      transition: border-color 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .uq-dpp-card:hover {
      border-color: rgba(0,0,0,0.2);
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .uq-dpp-card-top {
      display: flex;
      gap: 16px;
    }
    .uq-dpp-card-img {
      width: 72px;
      height: 72px;
      flex-shrink: 0;
      border-radius: 6px;
      overflow: hidden;
      background: var(--canvas-alt);
    }
    .uq-dpp-card-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .uq-dpp-card-info {
      flex: 1;
      min-width: 0;
    }
    .uq-dpp-card-name {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: -0.02em;
      color: var(--ink);
      line-height: 1.3;
    }
    .uq-dpp-card-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 4px;
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 0.04em;
    }
    .uq-dpp-verified {
      color: var(--accent-green);
      font-weight: 500;
    }
    .uq-dpp-metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 10px;
    }
    .uq-dpp-metric {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      background: var(--canvas-alt);
      border-radius: 4px;
      padding: 4px 8px;
      min-width: 52px;
    }
    .uq-dpp-metric-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--muted);
    }
    .uq-dpp-metric-value {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: var(--ink);
      margin-top: 1px;
    }
    .uq-dpp-card-desc {
      font-size: 13px;
      line-height: 1.5;
      color: var(--muted);
    }
    .uq-dpp-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: auto;
      padding-top: 14px;
      border-top: 1px solid var(--hairline);
    }
    .uq-dpp-qr {
      width: 40px;
      height: 40px;
      border-radius: 3px;
      background: #fff;
      padding: 2px;
      border: 1px solid var(--hairline);
    }
    .uq-dpp-link {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink);
      text-decoration: none;
      border-bottom: 1px solid var(--hairline);
      padding-bottom: 2px;
      transition: border-color 0.2s;
    }
    .uq-dpp-link:hover {
      border-color: var(--ink);
    }

    /* Chain of Custody */
    .uq-chain {
      background: #ebebeb;
      border-top: 1px solid var(--hairline);
      padding: 96px 24px;
    }

    @media (max-width: 768px) {
      .uq-chain { padding: 56px 16px; }
    }

    .uq-chain-inner {
      max-width: 1400px;
      margin: 0 auto;
    }

    .uq-chain-label {
      font-size: 11px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .uq-chain-title {
      margin-top: 12px;
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 36px;
      font-weight: 300;
      line-height: 1.1;
      letter-spacing: -0.02em;
      color: var(--ink);
    }

    @media (min-width: 768px) {
      .uq-chain-title { font-size: 48px; }
    }

    .uq-chain-subtitle {
      margin-top: 16px;
      font-size: 15px;
      line-height: 1.7;
      color: var(--ink-soft);
      max-width: 640px;
    }

    .uq-chain-list {
      position: relative;
      margin-top: 64px;
      padding-left: 0;
      list-style: none;
    }

    .uq-chain-line {
      position: absolute;
      left: 16px;
      top: 12px;
      bottom: 12px;
      width: 1px;
      background: rgba(0, 0, 0, 0.15);
      transform: translateX(-50%);
    }

    .uq-chain-item {
      position: relative;
      padding-left: 40px;
      margin-bottom: 72px;
    }

    .uq-chain-item:last-child { margin-bottom: 0; }

    .uq-chain-dot {
      position: absolute;
      left: 16px;
      top: 10px;
      width: 9px;
      height: 9px;
      border: 1px solid rgba(0, 0, 0, 0.5);
      background: #ebebeb;
      transform: translate(-50%, 0) rotate(45deg);
      z-index: 2;
    }

    .uq-chain-card {
      display: grid;
      grid-template-columns: 1fr;
      align-items: start;
      gap: 24px;
    }

    .uq-chain-cert-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(0, 0, 0, 0.15);
      background: rgba(255, 255, 255, 0.7);
      padding: 5px 12px;
      font-size: 10px;
      font-family: monospace;
      font-weight: 500;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(0, 0, 0, 0.65);
      margin-bottom: 16px;
      width: fit-content;
    }

    .uq-chain-date {
      font-size: 13px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.5);
      margin-bottom: 6px;
    }

    .uq-chain-qty {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.75);
      margin-bottom: 24px;
    }

    .uq-chain-qty strong {
      color: #000;
      font-weight: 600;
    }

    .uq-chain-project {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 24px;
      font-weight: 400;
      letter-spacing: -0.02em;
      color: #000;
      margin-bottom: 16px;
    }

    .uq-chain-desc {
      font-size: 14px;
      line-height: 1.7;
      color: rgba(0, 0, 0, 0.65);
      margin-bottom: 24px;
      max-width: 620px;
    }

    .uq-chain-view-link {
      display: inline-block;
      padding: 10px 20px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(0, 0, 0, 0.85);
      border: 1px solid rgba(0, 0, 0, 0.2);
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .uq-chain-view-link:hover {
      background: #000;
      color: #fff;
      border-color: #000;
    }

    .uq-chain-img-wrap {
      position: relative;
      aspect-ratio: 4 / 3;
      width: 100%;
      overflow: hidden;
      background: #e2e0dc;
      border-radius: 2px;
    }

    .uq-chain-img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .uq-chain-card:hover .uq-chain-img {
      transform: scale(1.04);
    }

    @media (min-width: 768px) {
      .uq-chain-line {
        left: 28px;
      }
      .uq-chain-item {
        padding-left: 64px;
        margin-bottom: 80px;
      }
      .uq-chain-dot {
        left: 28px;
        top: 10px;
      }
      .uq-chain-card {
        grid-template-columns: 1fr 280px;
        gap: 48px;
      }
      .uq-chain-img-wrap {
        width: 280px;
      }
      .uq-chain-project {
        font-size: 30px;
      }
      .uq-chain-date {
        font-size: 14px;
      }
      .uq-chain-qty {
        font-size: 14px;
      }
    }

    /* Ledger Footer */
    .uq-ledger-footer {
      margin-top: 56px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      border-top: 1px solid var(--hairline);
      padding-top: 32px;
    }

    @media (min-width: 768px) {
      .uq-ledger-footer {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 80px;
        padding-top: 32px;
      }
    }

    .uq-ledger-footer-text {
      font-size: 12px;
      color: var(--muted);
      max-width: 480px;
    }

    .uq-ledger-cta {
      display: inline-block;
      background: var(--ink);
      color: #fff;
      padding: 16px 32px;
      font-size: 12px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 500;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .uq-ledger-cta:hover { opacity: 0.9; }

    /* Why Section */
    .uq-why {
      background: #fff;
      border-top: 1px solid var(--hairline);
      padding: 80px 24px;
    }

    .uq-why-inner {
      max-width: 1600px;
      margin: 0 auto;
      display: grid;
      gap: 48px;
    }

    @media (min-width: 768px) {
      .uq-why { padding: 128px 48px; }
      .uq-why-inner {
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        align-items: center;
      }
    }

    .uq-why h2 {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1.02;
      margin-top: 16px;
      color: var(--ink);
    }

    @media (min-width: 768px) {
      .uq-why h2 { font-size: 48px; }
    }

    .uq-why p {
      margin-top: 24px;
      font-size: 15px;
      line-height: 1.7;
      color: var(--ink-soft);
      max-width: 640px;
    }

    .uq-why-btn {
      margin-top: 40px;
      display: inline-flex;
      align-items: center;
      background: var(--ink);
      color: #fff;
      padding: 12px 24px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-decoration: none;
      text-transform: uppercase;
      transition: opacity 0.2s;
    }

    .uq-why-btn:hover { opacity: 0.9; }

    .uq-why-img-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 5;
      overflow: hidden;
    }

    .uq-why-img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    /* Newsletter */
    .uq-newsletter {
      background: var(--canvas);
      border-top: 1px solid var(--hairline);
      padding: 64px 24px;
    }

    .uq-newsletter-inner {
      max-width: 1600px;
      margin: 0 auto;
      display: grid;
      gap: 32px;
      align-items: center;
    }

    @media (min-width: 768px) {
      .uq-newsletter { padding: 80px 48px; }
      .uq-newsletter-inner {
        grid-template-columns: auto 1fr;
        gap: 32px;
      }
    }

    .uq-newsletter h3 {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 24px;
      font-weight: 500;
      letter-spacing: -0.03em;
      color: var(--ink);
    }

    .uq-newsletter-sub {
      margin-top: 8px;
      font-size: 14px;
      color: var(--muted);
    }

    .uq-newsletter-form {
      display: flex;
      width: 100%;
      max-width: 640px;
    }

    @media (min-width: 768px) {
      .uq-newsletter-form { justify-self: end; }
    }

    .uq-newsletter-input {
      flex: 1;
      border: 1px solid var(--hairline);
      background: var(--canvas);
      padding: 16px 20px;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      outline: none;
      transition: border-color 0.2s;
    }

    .uq-newsletter-input:focus {
      border-color: var(--ink);
    }

    .uq-newsletter-submit {
      background: var(--ink);
      color: #fff;
      padding: 16px 24px;
      border: none;
      font-size: 16px;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .uq-newsletter-submit:hover { opacity: 0.9; }

    /* About Us Section */
    .uq-aboutus {
      background: var(--canvas-alt);
      border-top: 1px solid var(--hairline);
      padding: 80px 24px;
    }

    .uq-aboutus-inner {
      max-width: 1600px;
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      .uq-aboutus { padding: 128px 48px; }
    }

    .uq-aboutus h2 {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1.02;
      margin-top: 12px;
      color: var(--ink);
    }

    @media (min-width: 768px) {
      .uq-aboutus h2 { font-size: 48px; }
    }

    .uq-aboutus p {
      margin-top: 24px;
      font-size: 15px;
      line-height: 1.8;
      color: var(--ink-soft);
      max-width: 640px;
    }

    /* Footer */
    .uq-footer {
      background: #2b2e34;
      color: #fff;
      padding: 64px 24px 32px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .uq-footer-inner {
      max-width: 1400px;
      margin: 0 auto;
    }
    .uq-footer-main {
      display: flex;
      flex-direction: column;
      gap: 40px;
    }
    @media (min-width: 768px) {
      .uq-footer-main {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
      }
    }
    .uq-footer-brand {
      font-family: 'Inter Tight', sans-serif;
      font-size: 26px;
      font-weight: 600;
      letter-spacing: -0.03em;
      color: #fff;
    }
    .uq-footer-cols {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 48px;
    }
    @media (max-width: 600px) {
      .uq-footer-cols {
        grid-template-columns: 1fr;
        gap: 32px;
      }
    }
    .uq-footer-col h4 {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: #fff;
      margin-bottom: 16px;
    }
    .uq-footer-col ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .uq-footer-col li {
      margin-bottom: 10px;
    }
    .uq-footer-col a {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.65);
      text-decoration: none;
      transition: color 0.2s;
    }
    .uq-footer-col a:hover {
      color: #fff;
    }
    .uq-footer-divider {
      width: 100%;
      height: 1px;
      background: rgba(255, 255, 255, 0.12);
      margin: 48px 0 24px;
    }
    .uq-footer-bottom {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      text-align: center;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }
    @media (min-width: 768px) {
      .uq-footer-bottom {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
    }
    .uq-footer-policies a {
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      transition: color 0.2s;
    }
    .uq-footer-policies a:hover {
      color: rgba(255, 255, 255, 0.85);
    }
    .uq-footer-socials {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .uq-footer-socials a {
      color: rgba(255, 255, 255, 0.65);
      transition: color 0.2s;
      font-size: 16px;
    }
    .uq-footer-socials a:hover {
      color: #fff;
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
    Verified carbon offsets &middot; Chain of custody live
  </div>

  <!-- Header -->
  <header class="uq-header">
    <div class="uq-header-inner">
      <a href="#" class="uq-nav-brand">
        ${dynamic?.logo ? `<img src="${dynamic.logo}" alt="Logo" class="uq-nav-logo" />` : ''}
      </a>
      <nav>
        <ul class="uq-nav-links">
          <li><a href="#uq-dpp">Projects</a></li>
          <li><a href="#technology">Technology</a></li>
          <li><a href="#chain">Chain of Custody</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>
      <div class="uq-nav-actions">
        <a href="#"><i class="fa-solid fa-magnifying-glass" style="font-size: 16px;"></i></a>
        <a href="#"><i class="fa-solid fa-user" style="font-size: 16px;"></i></a>
      </div>
    </div>
  </header>

  <!-- Hero -->
  <section class="uq-hero" id="top">
    <img
      src="${dynamic?.UI_URL || ''}/assets/images/sustainability/eco-hero.jpg"
      alt="Aerial view of misty boreal forest at dawn"
      class="uq-hero-img"
    />
    <div class="uq-hero-overlay"></div>
    <div class="uq-hero-content">
      <h1 class="uq-hero-title">${dynamic?.title && dynamic.title !== '' ? dynamic.title : 'Carbon,<br/>accounted for.'}</h1>
      ${dynamic?.description && dynamic.description !== '' ? `<p class="uq-hero-desc">${dynamic.description}</p>` : `<p class="uq-hero-desc">Three decades of environmental expertise. Every tonne measured, retired and verifiable.</p>`}
    </div>
  </section>

  <!-- About Founder -->
  <section class="uq-about" id="about-founder">
    <div class="uq-about-inner">
      <div class="uq-about-img-wrap">
        <img
          src="${dynamic?.UI_URL || ''}/assets/images/sustainability/eco-founder.jpg"
          alt="Ecostance founder portrait"
          loading="lazy"
          class="uq-about-img"
        />
      </div>
      <div class="uq-about-text">
        <h2>Built from the Ground Up</h2>
        ${dynamic?.aboutUs && dynamic.aboutUs !== '' ? `<p>${dynamic.aboutUs}</p>` : `
        <p>For more than 30 years, the Ecostance team has worked at the source of environmental accounting â€” developing carbon measurement frameworks, building transparent supply chains, and helping establish the standards that now define responsible offsetting.</p>
        <p>Long before net zero became a category, we were exploring how natural sequestration and engineered removal could work together to deliver verifiable climate outcomes. The concept was proven. The industry wasn't ready.</p>
        <p class="uq-about-highlight">Today, it is.</p>
        <p>Ecostance brings together decades of measurement, verification and retirement expertise to create a new generation of carbon accounting. Every credit is tracked from source project to retired certificate, guided by a simple belief: <strong>Impact is proven, not claimed.</strong></p>
        `}
        <a href="#technology" class="uq-about-link">Learn about the technology</a>
      </div>
    </div>
  </section>

  <!-- Stats Band -->
  <section class="uq-stats">
    <div class="uq-stats-grid">
      <div class="uq-stat-item">
        <div class="uq-stat-value">${dynamic?.totalOffset || '0'}</div>
        <div class="uq-stat-label">GHG Reduced (Metric Tons)</div>
      </div>
      <div class="uq-stat-item">
        <div class="uq-stat-value">${dynamic?.metricTons || '0'}</div>
        <div class="uq-stat-label">Trees Planted</div>
      </div>
      <div class="uq-stat-item">
        <div class="uq-stat-value">${dynamic?.totalProjects || '0'}</div>
        <div class="uq-stat-label">Projects Supported</div>
      </div>
    </div>
  </section>



  <!-- Digital Product Passport -->
  ${dynamic?.dppProducts && dynamic.dppProducts.length > 0 ? `
  <section class="uq-dpp" id="uq-dpp">
    <div class="uq-dpp-inner">
      <p class="eyebrow">Digital Product Passport</p>
      <h2 style="font-family:'Inter Tight',sans-serif;font-size:clamp(30px,4vw,48px);font-weight:500;letter-spacing:-0.03em;line-height:1.02;margin-top:16px;">Verified Product Passports</h2>
      <p style="color:var(--muted);font-size:15px;margin-top:16px;max-width:640px;">Each product carries a Digital Product Passport â€” transparent, auditable, and independently verified.</p>
      <div class="uq-dpp-grid">
        ${dynamic.dppProducts.map((dpp) => {
          const pub = dpp?.published || {};
          const isPublished = dpp?.isPublic === true;
          const dppImage = pub.productImages?.[0] || pub.thumbImage?.[0] || pub.image?.[0] || '';
          const dppName = pub.formalName || pub.name || dpp?.name || 'Product';
          const dppCategory = pub.Category || '';
          const dppDesc = pub.shortDescription || '';
          const dppUrl = isPublished ? '/dpp/' + (dpp?.businessSlugName || '') + '/' + (dpp?.slug || '') : '#';
          const qrCodeUrl = isPublished && dppUrl !== '#' ? 'https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=' + encodeURIComponent(dppUrl) : '';
          const metrics = [];
          if (pub.showCo2Emission && pub.co2Emission > 0) metrics.push({ label: 'COâ‚‚', value: pub.co2Emission + 'kg' });
          if (pub.showWaterConsuption && pub.waterConsuption > 0) metrics.push({ label: 'Hâ‚‚O', value: pub.waterConsuption + 'L' });
          if (pub.showPowerConsuption && pub.powerConsuption > 0) metrics.push({ label: 'Energy', value: pub.powerConsuption + 'kWh' });
          if (pub.showRecycleMaterial && pub.recycleMaterial > 0) metrics.push({ label: 'Recycled', value: pub.recycleMaterial + '%' });
          if (pub.showUpcycleMaterial && pub.upcycleMaterial > 0) metrics.push({ label: 'Upcycled', value: pub.upcycleMaterial + '%' });
          return `
        <div class="uq-dpp-card" style="${!isPublished ? 'opacity:0.55;' : ''}">
          <div class="uq-dpp-card-top">
            <div class="uq-dpp-card-img">
              ${dppImage ? `<img src="${dppImage}" alt="${dppName}">` : '<div style="width:100%;height:100%;background:var(--canvas-alt);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--muted);letter-spacing:0.1em;">DPP</div>'}
            </div>
            <div class="uq-dpp-card-info">
              <h3 class="uq-dpp-card-name">${dppName}</h3>
              <div class="uq-dpp-card-meta">
                ${dppCategory ? '<span>' + dppCategory + '</span>' : ''}
                ${isPublished ? '<span class="uq-dpp-verified">&#10003; Verified</span>' : '<span style="color:#999;">Draft</span>'}
              </div>
              ${metrics.length > 0 ? `
              <div class="uq-dpp-metrics">
                ${metrics.map(m => '<span class="uq-dpp-metric"><span class="uq-dpp-metric-label">' + m.label + '</span><span class="uq-dpp-metric-value">' + m.value + '</span></span>').join('')}
              </div>` : ''}
            </div>
          </div>
          ${dppDesc ? '<p class="uq-dpp-card-desc">' + (dppDesc.length > 140 ? dppDesc.substring(0, 140) + '...' : dppDesc) + '</p>' : ''}
          <div class="uq-dpp-card-footer">
            ${isPublished && qrCodeUrl ? '<img src="' + qrCodeUrl + '" alt="QR" class="uq-dpp-qr">' : ''}
            ${isPublished ? '<a href="' + dppUrl + '" target="_blank" rel="noopener noreferrer" class="uq-dpp-link">View Passport &rarr;</a>' : '<span class="uq-dpp-link" style="opacity:0.4;cursor:default;">Not published</span>'}
          </div>
        </div>`;
        }).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Hover Story / Method Section -->
  <section class="uq-method" id="technology">
    <div class="uq-method-inner">
      <div class="uq-method-header">
        <p class="eyebrow-light">Our Method</p>
        <h2>Four steps to verified impact.</h2>
      </div>
      <div class="uq-method-grid">
        <ul class="uq-method-list" id="uq-method-list">
          <li class="uq-method-item uq-active" data-index="0">
            <div class="uq-method-item-head">
              <h3 class="uq-method-item-label">Measure</h3>
              <span class="uq-method-item-num">01</span>
            </div>
            <p class="uq-method-item-copy">Every emission source quantified with lab-grade accuracy.</p>
          </li>
          <li class="uq-method-item" data-index="1">
            <div class="uq-method-item-head">
              <h3 class="uq-method-item-label">Reduce</h3>
              <span class="uq-method-item-num">02</span>
            </div>
            <p class="uq-method-item-copy">Cut what we can â€” renewable energy, efficiency, low-carbon design.</p>
          </li>
          <li class="uq-method-item" data-index="2">
            <div class="uq-method-item-head">
              <h3 class="uq-method-item-label">Remove</h3>
              <span class="uq-method-item-num">03</span>
            </div>
            <p class="uq-method-item-copy">Sequester what we can't â€” reforestation and engineered removal.</p>
          </li>
          <li class="uq-method-item" data-index="3">
            <div class="uq-method-item-head">
              <h3 class="uq-method-item-label">Retire</h3>
              <span class="uq-method-item-num">04</span>
            </div>
            <p class="uq-method-item-copy">Retire each credit against a single owner. No double counting, ever.</p>
          </li>
        </ul>
        <div class="uq-method-visual">
          <img src="${dynamic?.UI_URL || ''}/assets/images/sustainability/eco-methane.jpg" alt="Measure" class="uq-img-visible" data-img="0" />
          <img src="${dynamic?.UI_URL || ''}/assets/images/sustainability/eco-wind2.jpg" alt="Reduce" class="uq-img-hidden" data-img="1" />
          <img src="${dynamic?.UI_URL || ''}/assets/images/sustainability/eco-sapling.jpg" alt="Remove" class="uq-img-hidden" data-img="2" />
          <img src="${dynamic?.UI_URL || ''}/assets/images/sustainability/eco-ocean.jpg" alt="Retire" class="uq-img-hidden" data-img="3" />
        </div>
      </div>
    </div>
  </section>

  <!-- Chain of Custody -->
  ${dynamic?.certData && dynamic.certData.length > 0 ? `
  <section class="uq-chain" id="chain">
    <div class="uq-chain-inner">
      <div class="uq-chain-label">CHAIN OF CUSTODY</div>
      <h2 class="uq-chain-title" style="font-weight: 300;">Carbon Offset Chain of Custody Certificates</h2>
      <p class="uq-chain-subtitle">Every offset we retire is issued a unique certificate that eliminates double counting.</p>
      <div class="uq-chain-list">
        <div class="uq-chain-line" aria-hidden></div>
        ${dynamic.certData.map((cert) => `
          <div class="uq-chain-item">
            <div class="uq-chain-dot"></div>
            <div class="uq-chain-card">
              <div>
                <div class="uq-chain-cert-tag">
                  <i class="fa-regular fa-file-lines"></i>
                  CERTIFICATE &middot; ${cert?.originNumber || ''}
                </div>
                <div class="uq-chain-date">
                  ${cert?.createdAt ? new Date(cert.createdAt).toISOString().split('T')[0] : ''}
                </div>
                ${cert?.quantity ? `
                <div class="uq-chain-qty">
                  Carbon Offset Quantity: <strong>${cert.quantity} Tons</strong>
                </div>` : ''}
                <h3 class="uq-chain-project">${cert?.product?.name || 'Certificate'}</h3>
                <p class="uq-chain-desc">${(function() { const d = cert?.product?.shortDescription || cert?.product?.description || ''; const w = d.split(' '); return w.length > 25 ? w.slice(0, 25).join(' ') + '...' : d; })()}</p>
                ${cert?.certificate?.certificateURL ? `<a href="${cert.certificate.certificateURL}" target="_blank" class="uq-chain-view-link">View Certificate</a>` : ''}
              </div>
              ${cert?.product?.thumbImage?.[0] ? `
              <div class="uq-chain-img-wrap">
                <img src="${cert.product.thumbImage[0]}" alt="${cert?.product?.name || 'Certificate'}" class="uq-chain-img" />
              </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Why Carbon Offsets -->
  <section class="uq-why">
    <div class="uq-why-inner">
      <div>
        <p class="eyebrow">Why Carbon Offsets</p>
        <h2>To achieve NetZero &mdash; now.</h2>
        <p>Carbon offsets let individuals and businesses invest in environmental projects to balance out their greenhouse gas footprints &mdash; replacing fossil fuel with renewable energy, removing methane, cleaning oceans, restoring forests.</p>
        <p>We don't wait for 2030 or 2050. We act today, and we prove it.</p>
        <a href="#projects" class="uq-why-btn">Take Action <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 10px; margin-left: 6px;"></i></a>
      </div>
      <div class="uq-why-img-wrap">
        <img
          src="${dynamic?.UI_URL || ''}/assets/images/sustainability/eco-why.jpg"
          alt="Industrial smokestacks at sunset"
          class="uq-why-img"
        />
      </div>
    </div>
  </section>

  <!-- About Us -->
  ${dynamic?.aboutUs && dynamic.aboutUs !== '' ? `
  <section class="uq-aboutus" id="about">
    <div class="uq-aboutus-inner">
      <p class="eyebrow">About Us</p>
      <h2>We are not waiting for 2030 or 2050 for NetZero.</h2>
      <p>${dynamic.aboutUs}</p>
    </div>
  </section>` : ''}

  <!-- Newsletter -->
  <section class="uq-newsletter">
    <div class="uq-newsletter-inner">
      <div>
        <h3>Join the Community</h3>
        <p class="uq-newsletter-sub">Get updates, project releases and impact reports.</p>
      </div>
      <form class="uq-newsletter-form" onsubmit="event.preventDefault()">
        <input type="email" placeholder="Email address" class="uq-newsletter-input" />
        <button type="submit" aria-label="Subscribe" class="uq-newsletter-submit">&rarr;</button>
      </form>
    </div>
  </section>

  <!-- Social Links -->
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
    <div class="uq-footer-inner">
      <div class="uq-footer-main">
        <div class="uq-footer-brand">${dynamic?.logo ? `<img src="${dynamic.logo}" alt="Logo" style="max-height:36px;max-width:140px;">` : ''}</div>
        <div class="uq-footer-cols">
          <div class="uq-footer-col">
            <h4>Our Story</h4>
            <ul>
              <li><a href="${dynamic?.aboutUsURL || '#about'}">About Us</a></li>
              <li><a href="#method">Technology</a></li>
              <li><a href="#journal">Journal</a></li>
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
              <li><a href="#bestsellers">Bestsellers</a></li>
              <li><a href="#men">Men</a></li>
              <li><a href="#women">Women</a></li>
              <li><a href="#accessories">Accessories</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="uq-footer-divider"></div>
      <div class="uq-footer-bottom">
        <div>&copy; ${new Date().getFullYear()} ${dynamic?.companyName || 'Uniqohr'}</div>
        <div class="uq-footer-policies"><a href="#terms">Terms and Policies</a></div>
        <div class="uq-footer-socials">
          ${dynamic?.showFacebook && dynamic?.facebook ? `<a href="${dynamic.facebook}" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>` : `<a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>`}
          ${dynamic?.showInstagram && dynamic?.instagram ? `<a href="${dynamic.instagram}" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>` : `<a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>`}
          <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
          <a href="#" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
          ${dynamic?.showTwitter && dynamic?.twitter ? `<a href="${dynamic.twitter}" target="_blank" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>` : `<a href="#" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>`}
        </div>
      </div>
    </div>
  </footer>

  <!-- Hover Interaction & Drag-to-Scroll Script -->
  <script>
    (function() {
      // Hover/focus interaction for method items
      var items = document.querySelectorAll('#uq-method-list .uq-method-item');
      var images = document.querySelectorAll('.uq-method-visual img');
      if (items.length && images.length) {
        items.forEach(function(item) {
          item.addEventListener('mouseenter', function() {
            var idx = this.getAttribute('data-index');
            items.forEach(function(el) {
              el.classList.remove('uq-active');
            });
            this.classList.add('uq-active');
            images.forEach(function(img) {
              if (img.getAttribute('data-img') === idx) {
                img.classList.remove('uq-img-hidden');
                img.classList.add('uq-img-visible');
              } else {
                img.classList.remove('uq-img-visible');
                img.classList.add('uq-img-hidden');
              }
            });
          });

          item.addEventListener('focus', function() {
            var idx = this.getAttribute('data-index');
            items.forEach(function(el) {
              el.classList.remove('uq-active');
            });
            this.classList.add('uq-active');
            images.forEach(function(img) {
              if (img.getAttribute('data-img') === idx) {
                img.classList.remove('uq-img-hidden');
                img.classList.add('uq-img-visible');
              } else {
                img.classList.remove('uq-img-visible');
                img.classList.add('uq-img-hidden');
              }
            });
          });
        });
      }

      // Drag to scroll for uq-gallery-scroll containers
      var sliders = document.querySelectorAll('.uq-gallery-scroll');
      sliders.forEach(function(slider) {
        // Mouse wheel horizontal scroll
        slider.addEventListener('wheel', function(e) {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            slider.scrollLeft += e.deltaY;
          }
        }, { passive: false });
        var isDown = false;
        var startX;
        var scrollLeft;
        var moved = false;

        slider.addEventListener('mousedown', function(e) {
          isDown = true;
          slider.style.cursor = 'grabbing';
          slider.style.scrollSnapType = 'none';
          startX = e.pageX - slider.offsetLeft;
          scrollLeft = slider.scrollLeft;
          moved = false;
        });

        slider.addEventListener('mouseleave', function() {
          isDown = false;
          slider.style.cursor = 'grab';
          slider.style.scrollSnapType = 'x mandatory';
        });

        slider.addEventListener('mouseup', function() {
          isDown = false;
          slider.style.cursor = 'grab';
          slider.style.scrollSnapType = 'x mandatory';
        });

        slider.addEventListener('mousemove', function(e) {
          if (!isDown) return;
          e.preventDefault();
          var x = e.pageX - slider.offsetLeft;
          var walk = (x - startX) * 2;
          if (Math.abs(walk) > 5) {
            moved = true;
          }
          slider.scrollLeft = scrollLeft - walk;
        });

        slider.addEventListener('dragstart', function(e) {
          e.preventDefault();
        });

        slider.addEventListener('click', function(e) {
          if (moved) {
            e.preventDefault();
          }
        });
      });
    })();
  </script>
</body>
</html>
`;
};
