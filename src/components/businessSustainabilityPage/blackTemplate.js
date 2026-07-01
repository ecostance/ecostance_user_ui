export const blackTemplate = (dynamic) => {
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --ink: #151618;
      --ink-soft: #3c3e41;
      --canvas: #fafafa;
      --canvas-alt: #f1f2f4;
      --hairline: #dadbe0;
      --muted: #737373;
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

    /* Navbar */
    .bl-navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 64px;
      background: var(--ink);
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .bl-nav-brand-link {
      color: #fff;
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.02em;
      text-decoration: none;
      display: flex;
      align-items: center;
    }

    .bl-nav-logo {
      height: 36px;
      width: auto;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }

    .bl-nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
      list-style: none;
    }

    .bl-nav-links a {
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.02em;
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      transition: color 0.2s;
    }

    .bl-nav-links a:hover { color: #fff; }

    @media (max-width: 768px) {
      .bl-navbar { padding: 0 16px; }
      .bl-nav-links li:not(:first-child) { display: none; }
    }

    /* Hero Section */
    .bl-hero {
      position: relative;
      width: 100%;
    }

    .bl-hero-img-container {
      position: relative;
      height: 78vh;
      min-height: 520px;
      width: 100%;
      overflow: hidden;
      background: var(--ink);
    }

    .bl-hero-img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      opacity: 0.9;
    }

    .bl-hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.5) 100%);
    }

    .bl-hero-content-wrapper {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
    }

    .bl-hero-inner {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      color: #fff;
    }

    .bl-hero-label {
      font-size: 11px;
      letter-spacing: 0.28em;
      color: rgba(255,255,255,0.75);
      text-transform: uppercase;
    }

    .bl-hero-title {
      margin-top: 20px;
      max-width: 768px;
      font-size: 36px;
      font-weight: 300;
      line-height: 1.02;
      letter-spacing: -0.02em;
      color: #ffffff !important;
    }

    @media (min-width: 768px) {
      .bl-hero-title {
        font-size: 64px;
      }
      .hidden-mobile {
        display: inline;
      }
    }

    @media (max-width: 767px) {
      .hidden-mobile {
        display: none;
      }
    }

    .bl-hero-desc {
      margin-top: 24px;
      max-width: 576px;
      font-size: 15px;
      line-height: 1.7;
      color: rgba(255,255,255,0.85);
    }

    .bl-hero-buttons {
      margin-top: 40px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .bl-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.05em;
      text-decoration: none;
      transition: opacity 0.2s, background-color 0.2s;
    }

    .bl-btn-primary {
      background: #fff;
      color: var(--ink);
      border: 1px solid #fff;
    }

    .bl-btn-primary:hover {
      opacity: 0.9;
    }

    .bl-btn-secondary {
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.7);
    }

    .bl-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    /* Stats Band */
    .bl-stats {
      border-bottom: 1px solid var(--hairline);
      background: var(--canvas);
    }

    .bl-stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      max-width: 1400px;
      margin: 0 auto;
    }

    .bl-stat-item {
      padding: 48px 24px;
      text-align: center;
      border-right: 1px solid var(--hairline);
    }

    .bl-stat-item:last-child { border-right: none; }

    .bl-stat-value {
      font-size: 48px;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: var(--ink);
    }

    .bl-stat-label {
      margin-top: 12px;
      font-size: 11px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--muted);
    }

    @media (max-width: 768px) {
      .bl-stats-grid { grid-template-columns: 1fr; }
      .bl-stat-item { border-right: none; border-bottom: 1px solid var(--hairline); padding: 32px 16px; }
      .bl-stat-item:last-child { border-bottom: none; }
      .bl-stat-value { font-size: 40px; }
    }

    /* Section Base */
    .bl-section {
      padding: 80px 24px;
      background: var(--canvas);
    }

    .bl-section-alt {
      padding: 80px 24px;
      background: var(--canvas-alt);
      border-top: 1px solid var(--hairline);
    }

    .bl-section-inner {
      max-width: 1400px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .bl-section, .bl-section-alt { padding: 48px 16px; }
    }

    .bl-section-label {
      font-size: 11px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .bl-section-title {
      margin-top: 12px;
      font-size: 36px;
      font-weight: 300;
      line-height: 1.1;
      letter-spacing: -0.02em;
      color: var(--ink);
    }

    @media (min-width: 768px) {
      .bl-section-title { font-size: 48px; }
    }

    .bl-section-text {
      margin-top: 20px;
      font-size: 15px;
      line-height: 1.8;
      color: var(--ink-soft);
      max-width: 640px;
    }

    /* Projects Grid */
    .bl-projects-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 40px;
    }

    @media (min-width: 640px) {
      .bl-projects-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (min-width: 768px) {
      .bl-projects-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .bl-projects-grid {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    .bl-project-card {
      display: block;
      text-decoration: none;
      color: inherit;
    }

    .bl-project-img-wrapper {
      position: relative;
      aspect-ratio: 1 / 1;
      width: 100%;
      overflow: hidden;
      background: var(--canvas-alt);
    }

    .bl-project-img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .bl-project-card:hover .bl-project-img {
      transform: scale(1.04);
    }

    .bl-project-info {
      margin-top: 8px;
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 8px;
    }

    .bl-project-meta {
      min-width: 0;
    }

    .bl-project-category {
      font-size: 9px;
      font-weight: 500;
      letter-spacing: 0.20em;
      color: var(--muted);
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bl-project-name {
      margin-top: 2px;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.25;
      color: var(--ink);
    }

    .bl-project-card:hover .bl-project-name {
      text-decoration: underline;
      text-underline-offset: 4px;
    }

    .bl-project-arrow {
      margin-top: 2px;
      height: 14px;
      width: 14px;
      flex-shrink: 0;
      color: var(--muted);
      transition: transform 0.2s;
    }

    .bl-project-card:hover .bl-project-arrow {
      transform: translate(2px, -2px);
    }

    /* Certificate Timeline */
    .bl-timeline {
      position: relative;
      margin-top: 40px;
      padding-left: 32px;
    }

    .bl-timeline-line {
      position: absolute;
      left: 5px;
      top: 8px;
      bottom: 8px;
      width: 1px;
      background: var(--hairline);
    }

    .bl-timeline-item {
      position: relative;
      margin-bottom: 56px;
    }

    .bl-timeline-dot {
      position: absolute;
      left: -32px;
      top: 12px;
      width: 10px;
      height: 10px;
      border: 1px solid var(--ink);
      background: var(--canvas-alt);
      transform: rotate(45deg);
    }

    .bl-timeline-item-inner {
      display: grid;
      grid-template-columns: 1fr;
      align-items: start;
      gap: 24px;
    }

    @media (min-width: 768px) {
      .bl-timeline-item-inner {
        grid-template-columns: 1fr 240px;
        gap: 40px;
      }
    }

    .bl-timeline-cert-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--hairline);
      background: #fff;
      padding: 6px 12px;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.20em;
      text-transform: uppercase;
      color: var(--ink-soft);
      margin-bottom: 16px;
    }

    .bl-timeline-date {
      font-size: 13px;
      color: var(--muted);
      margin-bottom: 8px;
    }

    .bl-timeline-qty {
      font-size: 13px;
      color: var(--muted);
      margin-bottom: 16px;
    }

    .bl-timeline-qty strong {
      color: var(--ink);
    }

    .bl-timeline-title {
      font-size: 24px;
      font-weight: 300;
      letter-spacing: -0.02em;
      color: var(--ink);
      margin-bottom: 12px;
    }

    @media (min-width: 768px) {
      .bl-timeline-title {
        font-size: 32px;
      }
    }

    .bl-timeline-desc {
      font-size: 14px;
      line-height: 1.6;
      color: var(--ink-soft);
      max-width: 576px;
      margin-bottom: 16px;
    }

    .bl-timeline-cert-link {
      display: inline-block;
      padding: 8px 16px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink);
      border: 1px solid var(--hairline);
      text-decoration: none;
      transition: background 0.2s, color 0.2s;
    }

    .bl-timeline-cert-link:hover {
      background: var(--ink);
      color: #fff;
    }

    .bl-timeline-img-wrapper {
      position: relative;
      aspect-ratio: 1 / 1;
      width: 100%;
      overflow: hidden;
      background: var(--canvas);
    }

    @media (min-width: 768px) {
      .bl-timeline-img-wrapper {
        width: 240px;
      }
    }

    .bl-timeline-img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .bl-timeline-item-inner:hover .bl-timeline-img {
      transform: scale(1.04);
    }

    /* Why Section */
    .bl-why-section {
      background: #ffffff;
      padding: 80px 24px;
      border-top: 1px solid var(--hairline);
    }

    .bl-why-grid {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px;
    }

    @media (min-width: 768px) {
      .bl-why-grid {
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        align-items: center;
      }
      .bl-why-text-col {
        order: 1;
      }
      .bl-why-img-col {
        order: 2;
      }
    }

    @media (max-width: 767px) {
      .bl-why-text-col {
        order: 2;
      }
      .bl-why-img-col {
        order: 1;
      }
    }

    .bl-why-img-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 5;
      overflow: hidden;
    }

    .bl-why-img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .bl-take-action-btn {
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

    .bl-take-action-btn:hover {
      opacity: 0.9;
    }

    /* Footer */
    .bl-footer {
      background: var(--ink);
      color: rgba(255,255,255,0.6);
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .bl-footer-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    @media (min-width: 768px) {
      .bl-footer-inner {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .bl-footer-left {
      color: #fff;
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    .bl-footer-copyright {
      font-size: 11px;
      letter-spacing: 0.05em;
      color: rgba(255,255,255,0.5);
    }
  </style>
</head>
<body>
  <!-- Navbar -->
  <nav class="bl-navbar">
    <a href="#" class="bl-nav-brand-link">
      ${dynamic?.logo ? `<img src="${dynamic.logo}" alt="Logo" class="bl-nav-logo" />` : 'ecostance'}
    </a>
    <ul class="bl-nav-links">
      <li><a href="#projects">Projects</a></li>
      <li><a href="#certificates">Certificates</a></li>
      <li><a href="#about">About</a></li>
    </ul>
  </nav>

  <!-- Hero Section -->
  <section class="bl-hero">
    <div class="bl-hero-img-container">
      <img
        src="${dynamic?.UI_URL || ''}/assets/images/sustainability/eco-hero.jpg"
        alt="Forest at golden hour"
        class="bl-hero-img"
      />
      <div class="bl-hero-overlay"></div>
      <div class="bl-hero-content-wrapper">
        <div class="bl-hero-inner">
          <div class="bl-hero-label">${dynamic?.companyName || 'OUR ECOSTANCE'}</div>
          <h1 class="bl-hero-title">${dynamic?.title && dynamic.title !== '' ? dynamic.title : 'Combating climate change,<br class="hidden-mobile" /> one verified tonne at a time.'}</h1>
          ${dynamic?.description && dynamic.description !== '' ? `<p class="bl-hero-desc">${dynamic.description}</p>` : `<p class="bl-hero-desc">Every offset we retire is traceable to a specific project, on a specific date, with a specific certificate.</p>`}
          <div class="bl-hero-buttons">
            <a href="#projects" class="bl-btn bl-btn-primary">Explore projects</a>
            <a href="#certificates" class="bl-btn bl-btn-secondary">Chain of custody</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats Band -->
  <section class="bl-stats">
    <div class="bl-stats-grid">
      <div class="bl-stat-item">
        <div class="bl-stat-value">${dynamic?.totalOffset || '0'}</div>
        <div class="bl-stat-label">GHG Reduced (Metric Tons)</div>
      </div>
      <div class="bl-stat-item">
        <div class="bl-stat-value">${dynamic?.metricTons || '0'}</div>
        <div class="bl-stat-label">Trees Planted</div>
      </div>
      <div class="bl-stat-item">
        <div class="bl-stat-value">${dynamic?.totalProjects || '0'}</div>
        <div class="bl-stat-label">Projects Supported</div>
      </div>
    </div>
  </section>

  <!-- Projects Section -->
  ${uniqueProducts.length > 0 ? `
  <section id="projects" class="bl-section">
    <div class="bl-section-inner">
      <div class="bl-section-label">CLIMATE PROJECTS</div>
      <h2 class="bl-section-title" style="font-weight: 300;">Every tonne accounted for.</h2>
      <div class="bl-projects-grid">
        ${uniqueProducts.map(prod => `
          <a href="#certificates" class="bl-project-card">
            <div class="bl-project-img-wrapper">
              <img
                src="${prod?.thumbImage?.[0] || ''}"
                alt="${prod?.name || 'Project'}"
                class="bl-project-img"
                loading="lazy"
              />
            </div>
            <div class="bl-project-info">
              <div class="bl-project-meta">
                <div class="bl-project-category">CARBON OFFSET</div>
                <div class="bl-project-name">${prod?.name || 'Project'}</div>
              </div>
              <i class="fa-solid fa-arrow-up-right-from-square bl-project-arrow" style="font-size: 11px;"></i>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Certificates / Chain of Custody -->
  ${dynamic?.certData && dynamic.certData.length > 0 ? `
  <section id="certificates" class="bl-section-alt">
    <div class="bl-section-inner">
      <div class="bl-section-label">CHAIN OF CUSTODY</div>
      <h2 class="bl-section-title" style="font-weight: 300;">Carbon Offset Chain of Custody Certificates</h2>
      <p class="bl-section-text">Every offset we retire is issued a unique certificate that eliminates double counting.</p>
      <div class="bl-timeline">
        <div class="bl-timeline-line"></div>
        ${dynamic.certData.map((cert, i) => `
          <div class="bl-timeline-item">
            <div class="bl-timeline-dot"></div>
            <div class="bl-timeline-item-inner">
              <div>
                <div class="bl-timeline-cert-tag">
                  <i class="fa-regular fa-file-lines"></i>
                  CERTIFICATE &middot; ${cert?.originNumber || ''}
                </div>
                <div class="bl-timeline-date">
                  ${cert?.createdAt ? new Date(cert.createdAt).toISOString().split('T')[0] : ''}
                </div>
                ${cert?.quantity ? `
                <div class="bl-timeline-qty">
                  Carbon Offset Quantity: <strong>${cert.quantity} Tons</strong>
                </div>` : ''}
                <h3 class="bl-timeline-title">${cert?.product?.name || 'Certificate'}</h3>
                <p class="bl-timeline-desc">${cert?.product?.description || ''}</p>
                ${cert?.certificate?.certificateURL ? `<a href="${cert.certificate.certificateURL}" target="_blank" class="bl-timeline-cert-link">View Certificate</a>` : ''}
              </div>
              ${cert?.product?.thumbImage?.[0] ? `
              <div class="bl-timeline-img-wrapper">
                <img src="${cert.product.thumbImage[0]}" alt="${cert?.product?.name || 'Certificate'}" class="bl-timeline-img" />
              </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Why Carbon Offsets Section -->
  <section class="bl-why-section">
    <div class="bl-why-grid">
      <div class="bl-why-text-col">
        <div class="bl-section-label">WHY CARBON OFFSETS</div>
        <h2 class="bl-section-title" style="font-weight: 300;">To achieve NetZero &mdash; now.</h2>
        <p class="bl-section-text" style="margin-top: 24px;">
          Carbon offsets let individuals and businesses invest in environmental
          projects to balance out their greenhouse gas footprints &mdash; replacing
          fossil fuel with renewable energy, removing methane, cleaning oceans,
          restoring forests.
        </p>
        <p class="bl-section-text" style="margin-top: 16px;">
          We don't wait for 2030 or 2050. We act today, and we prove it.
        </p>
        <a href="#projects" class="bl-take-action-btn">
          TAKE ACTION <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 10px; margin-left: 6px;"></i>
        </a>
      </div>
      <div class="bl-why-img-col">
        <div class="bl-why-img-wrapper">
          <img
            src="${dynamic?.UI_URL || ''}/assets/images/sustainability/eco-why.jpg"
            alt="Industrial smokestacks at sunset"
            class="bl-why-img"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- About Us -->
  ${dynamic?.aboutUs && dynamic.aboutUs !== '' ? `
  <section id="about" class="bl-section-alt">
    <div class="bl-section-inner">
      <div class="bl-section-label">ABOUT US</div>
      <h2 class="bl-section-title" style="font-weight: 300;">We are not waiting for 2030 or 2050 for NetZero.</h2>
      <div class="bl-section-text">
        <p>${dynamic.aboutUs}</p>
      </div>
    </div>
  </section>` : ''}

  <!-- Footer -->
  <footer class="bl-footer">
    <div class="bl-footer-inner">
      <div class="bl-footer-left">ecostance</div>
      <p class="bl-footer-copyright">&copy; ${new Date().getFullYear()} &mdash; Carbon chain of custody</p>
    </div>
  </footer>
</body>
</html>
`;
};
