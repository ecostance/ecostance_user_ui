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

    /* Chain of Custody */
    .uq-chain {
      background: oklch(0.96 0.004 80);
      border-top: 1px solid var(--hairline);
      padding: 96px 24px;
    }

    .uq-chain-inner {
      max-width: 1600px;
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      .uq-chain { padding: 144px 48px; }
    }

    .uq-chain-header {
      display: grid;
      gap: 40px;
      margin-bottom: 80px;
    }

    .uq-chain-header h2 {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 36px;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1;
      margin-top: 16px;
      color: var(--ink);
    }

    .uq-chain-header-text {
      font-size: 15px;
      line-height: 1.7;
      color: var(--muted);
      max-width: 520px;
    }

    .uq-chain-header-text strong {
      color: var(--ink);
      font-weight: 500;
    }

    @media (min-width: 768px) {
      .uq-chain-header {
        grid-template-columns: 1fr 1.1fr;
        gap: 80px;
        align-items: end;
      }
      .uq-chain-header h2 { font-size: 64px; }
    }

    /* Process Timeline */
    .uq-process {
      position: relative;
    }

    .uq-process-line {
      display: none;
    }

    @media (min-width: 768px) {
      .uq-process-line {
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        top: 22px;
        height: 1px;
        background: rgba(0,0,0,0.2);
      }
    }

    .uq-process-grid {
      display: grid;
      gap: 48px;
      position: relative;
      list-style: none;
    }

    @media (min-width: 768px) {
      .uq-process-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 32px;
      }
    }

    .uq-process-step {
      position: relative;
    }

    .uq-process-step-head {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    @media (min-width: 768px) {
      .uq-process-step-head { display: block; }
    }

    .uq-process-num {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 44px;
      width: 44px;
      border-radius: 50%;
      border: 1px solid var(--ink);
      background: oklch(0.96 0.004 80);
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 14px;
      position: relative;
      z-index: 1;
    }

    .uq-process-step-body {
      margin-top: 0;
    }

    @media (min-width: 768px) {
      .uq-process-step-body { margin-top: 32px; padding-right: 24px; }
    }

    .uq-process-step-body h3 {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 20px;
      font-weight: 500;
      letter-spacing: -0.03em;
      color: var(--ink);
    }

    .uq-process-step-body p {
      margin-top: 8px;
      font-size: 14px;
      line-height: 1.6;
      color: var(--muted);
      max-width: 220px;
    }

    @media (min-width: 768px) {
      .uq-process-step-body h3 { font-size: 24px; }
    }

    .uq-process-connector {
      margin-left: 22px;
      margin-top: 24px;
      height: 32px;
      width: 1px;
      background: rgba(0,0,0,0.2);
    }

    @media (min-width: 768px) {
      .uq-process-connector { display: none; }
    }

    /* Public Ledger */
    .uq-ledger {
      margin-top: 96px;
      background: oklch(0.97 0.002 80);
      color: var(--ink);
      padding: 56px 20px;
    }

    @media (min-width: 768px) {
      .uq-ledger { margin-top: 128px; padding: 80px 64px; }
    }

    .uq-ledger-header {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 56px;
    }

    @media (min-width: 768px) {
      .uq-ledger-header {
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 80px;
      }
    }

    .uq-ledger-header h3 {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: -0.03em;
      line-height: 1;
      margin-top: 12px;
      color: var(--ink);
    }

    @media (min-width: 768px) {
      .uq-ledger-header h3 { font-size: 48px; }
    }

    .uq-ledger-live {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--muted);
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .uq-ledger-dot {
      height: 6px;
      width: 6px;
      border-radius: 50%;
      background: var(--accent-green);
      animation: uq-pulse 2s infinite;
    }

    @keyframes uq-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Vertical Chain */
    .uq-chain-list {
      position: relative;
      max-width: 960px;
      margin: 0 auto;
      list-style: none;
    }

    .uq-chain-spine {
      position: absolute;
      left: 16px;
      top: 0;
      bottom: 0;
      width: 1px;
      background: rgba(0,0,0,0.15);
    }

    @media (min-width: 768px) {
      .uq-chain-spine {
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .uq-chain-item {
      position: relative;
      padding-left: 56px;
      padding-bottom: 56px;
    }

    .uq-chain-item:last-child { padding-bottom: 0; }

    @media (min-width: 768px) {
      .uq-chain-item { padding-left: 0; }
    }

    .uq-chain-node {
      position: absolute;
      left: 16px;
      top: 24px;
      transform: translateX(-50%);
      z-index: 10;
    }

    @media (min-width: 768px) {
      .uq-chain-node {
        left: 50%;
      }
    }

    .uq-chain-node-inner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 16px;
      width: 16px;
    }

    .uq-chain-node-ping {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba(16,185,129,0.3);
      animation: uq-ping 1.5s infinite;
    }

    @keyframes uq-ping {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(2); opacity: 0; }
    }

    .uq-chain-node-dot {
      position: relative;
      height: 12px;
      width: 12px;
      border-radius: 50%;
      background: var(--accent-green);
      box-shadow: 0 0 0 4px oklch(0.97 0.002 80);
    }

    .uq-chain-connector {
      display: none;
    }

    @media (min-width: 768px) {
      .uq-chain-connector {
        display: block;
        position: absolute;
        top: 32px;
        height: 1px;
        background: rgba(0,0,0,0.15);
        width: 6%;
      }

      .uq-chain-connector-left {
        right: 50%;
        margin-right: 8px;
      }

      .uq-chain-connector-right {
        left: 50%;
        margin-left: 8px;
      }
    }

    .uq-cert-card {
      width: 100%;
    }

    @media (min-width: 768px) {
      .uq-cert-card { width: 46%; }
      .uq-cert-card-left { margin-right: auto; padding-right: 24px; }
      .uq-cert-card-right { margin-left: auto; padding-left: 24px; }
    }

    .uq-cert-card-inner {
      display: grid;
      grid-template-columns: 1fr 96px;
      background: #fff;
      border: 1px solid var(--hairline);
      transition: border-color 0.2s, box-shadow 0.2s;
      overflow: hidden;
    }

    .uq-cert-card-inner:hover {
      border-color: rgba(0,0,0,0.2);
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }

    @media (min-width: 768px) {
      .uq-cert-card-inner { grid-template-columns: 1fr 120px; }
    }

    .uq-cert-body {
      padding: 20px;
    }

    @media (min-width: 768px) {
      .uq-cert-body { padding: 24px; }
    }

    .uq-cert-tags {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .uq-cert-tag {
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .uq-cert-tag-retired {
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent-green);
    }

    .uq-cert-id {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 18px;
      font-weight: 500;
      letter-spacing: -0.03em;
      margin-top: 4px;
      color: var(--ink);
    }

    .uq-cert-meta {
      margin-top: 16px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;
      font-size: 13px;
      color: var(--muted);
    }

    .uq-cert-meta-dot {
      height: 4px;
      width: 4px;
      border-radius: 50%;
      background: rgba(0,0,0,0.3);
      flex-shrink: 0;
    }

    .uq-cert-meta strong {
      color: var(--ink);
      font-weight: 500;
    }

    .uq-cert-project {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 18px;
      font-weight: 500;
      letter-spacing: -0.03em;
      margin-top: 16px;
      color: var(--ink);
    }

    .uq-cert-desc {
      margin-top: 8px;
      font-size: 13px;
      line-height: 1.6;
      color: var(--muted);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .uq-cert-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 20px;
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(0,0,0,0.7);
      text-decoration: none;
      border-bottom: 1px solid rgba(0,0,0,0.2);
      padding-bottom: 2px;
      transition: color 0.2s, border-color 0.2s;
    }

    .uq-cert-link:hover {
      color: var(--ink);
      border-color: var(--ink);
    }

    .uq-cert-img-wrap {
      position: relative;
      overflow: hidden;
      background: var(--canvas-alt);
    }

    .uq-cert-img {
      position: absolute;
      inset: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      opacity: 0.9;
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .uq-cert-card:hover .uq-cert-img {
      transform: scale(1.05);
    }

    /* Chain Terminal */
    .uq-chain-terminal {
      position: relative;
      padding-left: 56px;
      padding-top: 8px;
    }

    @media (min-width: 768px) {
      .uq-chain-terminal { padding-left: 0; text-align: center; }
    }

    .uq-chain-terminal-dot {
      position: absolute;
      left: 16px;
      top: 0;
      transform: translateX(-50%);
      height: 12px;
      width: 12px;
      border-radius: 50%;
      border: 1px solid rgba(0,0,0,0.3);
      background: oklch(0.97 0.002 80);
    }

    @media (min-width: 768px) {
      .uq-chain-terminal-dot { left: 50%; }
    }

    .uq-chain-terminal-text {
      padding-top: 8px;
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--muted);
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
      background: oklch(0.20 0.005 80);
      color: #fff;
    }

    .uq-footer-inner {
      max-width: 1600px;
      margin: 0 auto;
      padding: 64px 24px;
    }

    @media (min-width: 768px) {
      .uq-footer-inner { padding: 80px 48px; }
    }

    .uq-footer-grid {
      display: grid;
      gap: 40px;
    }

    @media (min-width: 768px) {
      .uq-footer-grid {
        grid-template-columns: 1.5fr 1fr 1fr 1fr;
        gap: 40px;
      }
    }

    .uq-footer-brand {
      font-family: 'Inter Tight', ui-sans-serif, system-ui, sans-serif;
      font-size: 30px;
      font-weight: 500;
      letter-spacing: -0.03em;
      text-transform: lowercase;
      color: #fff;
    }

    .uq-footer-col h4 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #fff;
    }

    .uq-footer-col ul {
      list-style: none;
    }

    .uq-footer-col li {
      margin-bottom: 8px;
    }

    .uq-footer-col a {
      font-size: 14px;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      transition: color 0.2s;
    }

    .uq-footer-col a:hover { color: #fff; }

    .uq-footer-bottom {
      margin-top: 64px;
      border-top: 1px solid rgba(255,255,255,0.15);
      padding-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-size: 12px;
      color: rgba(255,255,255,0.5);
    }

    @media (min-width: 768px) {
      .uq-footer-bottom {
        flex-direction: row;
        justify-content: space-between;
      }
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
        ${dynamic?.logo ? `<img src="${dynamic.logo}" alt="Logo" class="uq-nav-logo" />` : 'ecostance'}
      </a>
      <nav>
        <ul class="uq-nav-links">
          <li><a href="#projects">Projects</a></li>
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
        <p>For more than 30 years, the Ecostance team has worked at the source of environmental accounting — developing carbon measurement frameworks, building transparent supply chains, and helping establish the standards that now define responsible offsetting.</p>
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

  <!-- Product Gallery -->
  ${uniqueProducts.length > 0 ? `
  <section class="uq-gallery" id="projects">
    <div class="uq-gallery-header">
      <p class="eyebrow">Digital Product Passport</p>
      <h2>Every project, documented.</h2>
      <p>From source to certificate, each offset in our portfolio carries a Digital Product Passport — accessible, auditable, and independent.</p>
    </div>
    <div class="uq-gallery-scroll">
      <div class="uq-gallery-track">
        ${uniqueProducts.map(prod => `
          <a href="#chain" class="uq-gallery-card">
            <div class="uq-gallery-img-wrap">
              <img
                src="${prod?.thumbImage?.[0] || ''}"
                alt="${prod?.name || 'Project'}"
                loading="lazy"
                class="uq-gallery-img"
              />
            </div>
            <div class="uq-gallery-card-title">${prod?.name || 'Project'}</div>
            <div class="uq-gallery-card-type">Carbon Offset</div>
          </a>
        `).join('')}
      </div>
    </div>
    <p class="uq-gallery-hint">&larr; Scroll &rarr;</p>
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
            <p class="uq-method-item-copy">Cut what we can — renewable energy, efficiency, low-carbon design.</p>
          </li>
          <li class="uq-method-item" data-index="2">
            <div class="uq-method-item-head">
              <h3 class="uq-method-item-label">Remove</h3>
              <span class="uq-method-item-num">03</span>
            </div>
            <p class="uq-method-item-copy">Sequester what we can't — reforestation and engineered removal.</p>
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
      <div class="uq-chain-header">
        <div>
          <p class="eyebrow">Chain of Custody</p>
          <h2>From source<br/>to certificate.</h2>
        </div>
        <div class="uq-chain-header-text">
          <p>Every credit is issued from an accredited registry and supported by a fully traceable custody chain — timestamped, signed, and independently auditable at every stage.</p>
          <p><strong>Verified, not claimed.</strong></p>
        </div>
      </div>

      <!-- Process Timeline -->
      <div class="uq-process">
        <div class="uq-process-line"></div>
        <ol class="uq-process-grid">
          <li class="uq-process-step">
            <div class="uq-process-step-head">
              <div class="uq-process-num">01</div>
              <div class="uq-process-step-body">
                <h3>Origination</h3>
                <p>Verified developer, third-party audited baseline at the project site.</p>
              </div>
            </div>
            <div class="uq-process-connector"></div>
          </li>
          <li class="uq-process-step">
            <div class="uq-process-step-head">
              <div class="uq-process-num">02</div>
              <div class="uq-process-step-body">
                <h3>Issuance</h3>
                <p>Accredited registry mints a unique serialised carbon credit.</p>
              </div>
            </div>
            <div class="uq-process-connector"></div>
          </li>
          <li class="uq-process-step">
            <div class="uq-process-step-head">
              <div class="uq-process-num">03</div>
              <div class="uq-process-step-body">
                <h3>Transfer</h3>
                <p>Custody moves on-ledger, timestamped and cryptographically signed.</p>
              </div>
            </div>
            <div class="uq-process-connector"></div>
          </li>
          <li class="uq-process-step">
            <div class="uq-process-step-head">
              <div class="uq-process-num">04</div>
              <div class="uq-process-step-body">
                <h3>Retirement</h3>
                <p>Credit retired against a single owner. Immutable, verifiable, final.</p>
              </div>
            </div>
          </li>
        </ol>
      </div>

      <!-- Public Ledger -->
      <div class="uq-ledger">
        <div class="uq-ledger-header">
          <div>
            <p class="eyebrow">Public Ledger</p>
            <h3>The Chain, Unbroken.</h3>
          </div>
          <div class="uq-ledger-live">
            <span class="uq-ledger-dot"></span>
            Live &middot; ${dynamic.certData.length} retirements
          </div>
        </div>

        <ol class="uq-chain-list">
          <div class="uq-chain-spine" aria-hidden></div>

          ${dynamic.certData.map((cert, i) => {
            const isLeft = i % 2 === 0;
            return `
            <li class="uq-chain-item">
              <div class="uq-chain-node">
                <div class="uq-chain-node-inner">
                  <span class="uq-chain-node-ping"></span>
                  <span class="uq-chain-node-dot"></span>
                </div>
              </div>

              <div class="uq-chain-connector ${isLeft ? 'uq-chain-connector-left' : 'uq-chain-connector-right'}" aria-hidden></div>

              <div class="uq-cert-card ${isLeft ? 'uq-cert-card-left' : 'uq-cert-card-right'}">
                <div class="uq-cert-card-inner">
                  <div class="uq-cert-body">
                    <div class="uq-cert-tags">
                      <span class="uq-cert-tag">Certificate</span>
                      <span class="uq-cert-tag-retired">Retired</span>
                    </div>
                    <p class="uq-cert-id">#${cert?.originNumber || ''}</p>
                    <div class="uq-cert-meta">
                      <span>${cert?.createdAt ? new Date(cert.createdAt).toISOString().split('T')[0] : ''}</span>
                      <span class="uq-cert-meta-dot"></span>
                      ${cert?.quantity ? `<strong>${cert.quantity} tCO\u2082e</strong>` : ''}
                    </div>
                    <h4 class="uq-cert-project">${cert?.product?.name || 'Certificate'}</h4>
                    <p class="uq-cert-desc">${cert?.product?.description || ''}</p>
                    ${cert?.certificate?.certificateURL ? `<a href="${cert.certificate.certificateURL}" target="_blank" class="uq-cert-link">View Passport &rarr;</a>` : ''}
                  </div>
                  ${cert?.product?.thumbImage?.[0] ? `
                  <div class="uq-cert-img-wrap">
                    <img src="${cert.product.thumbImage[0]}" alt="${cert?.product?.name || 'Certificate'}" loading="lazy" class="uq-cert-img" />
                  </div>
                  ` : ''}
                </div>
              </div>
            </li>`;
          }).join('')}

        </ol>
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

  <!-- Contact -->
  ${(dynamic?.showName && dynamic?.name) || (dynamic?.showEmail && dynamic?.email) || (dynamic?.showPhone && dynamic?.phone) ? `
  <section class="uq-contact">
    ${dynamic?.showName && dynamic?.name ? `<p>${dynamic.name}</p>` : ''}
    ${dynamic?.showEmail && dynamic?.email ? `<p><a href="mailto:${dynamic.email}">${dynamic.email}</a></p>` : ''}
    ${dynamic?.showPhone && dynamic?.phone ? `<p>${dynamic.phone}</p>` : ''}
    ${dynamic?.countryPicture ? `<p>${dynamic.countryPicture}</p>` : ''}
  </section>` : ''}

  <!-- Footer -->
  <footer class="uq-footer">
    <div class="uq-footer-inner">
      <div class="uq-footer-grid">
        <div>
          <p class="uq-footer-brand">ecostance</p>
        </div>
        <div class="uq-footer-col">
          <h4>Our Story</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#technology">Technology</a></li>
            <li><a href="#projects">Journal</a></li>
          </ul>
        </div>
        <div class="uq-footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#chain">Custody</a></li>
          </ul>
        </div>
        <div class="uq-footer-col">
          <h4>Projects</h4>
          <ul>
            <li><a href="#projects">Renewables</a></li>
            <li><a href="#projects">Nature Based</a></li>
            <li><a href="#projects">Engineered Removal</a></li>
          </ul>
        </div>
      </div>
      <div class="uq-footer-bottom">
        <p>&copy; ${new Date().getFullYear()} Ecostance</p>
        <p>Terms and Policies</p>
      </div>
    </div>
  </footer>

  <!-- Hover Interaction Script -->
  <script>
    (function() {
      var items = document.querySelectorAll('#uq-method-list .uq-method-item');
      var images = document.querySelectorAll('.uq-method-visual img');
      if (!items.length || !images.length) return;

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
    })();
  </script>
</body>
</html>
`;
};
