export const blackTemplate = (dynamic) => `
<!DOCTYPE html>
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
      --ink: #1a1a1a;
      --ink-soft: #3d3d3d;
      --canvas: #fafafa;
      --canvas-alt: #f0f0f0;
      --hairline: #d4d4d4;
      --muted: #6b6b6b;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }

    body {
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      background: var(--canvas);
      color: var(--ink);
      -webkit-font-smoothing: antialiased;
      font-feature-settings: "ss01", "cv11";
    }

    /* Navbar */
    .bl-navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      height: 64px;
      background: var(--ink);
      border-bottom: 1px solid rgba(255,255,255,0.1);
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
      .bl-nav-links { display: none; }
    }

    /* Hero Section */
    .bl-hero {
      position: relative;
      width: 100%;
      min-height: 420px;
      background: var(--ink);
      display: flex;
      align-items: center;
    }

    .bl-hero-inner {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 24px;
      color: #fff;
    }

    .bl-hero-label {
      font-size: 11px;
      letter-spacing: 0.28em;
      color: rgba(255,255,255,0.6);
      text-transform: uppercase;
    }

    .bl-hero-title {
      margin-top: 20px;
      max-width: 768px;
      font-size: 52px;
      font-weight: 300;
      line-height: 1.05;
      letter-spacing: -0.02em;
    }

    @media (max-width: 768px) {
      .bl-hero-title { font-size: 32px; }
      .bl-hero-inner { padding: 48px 16px; }
    }

    .bl-hero-desc {
      margin-top: 24px;
      max-width: 576px;
      font-size: 15px;
      line-height: 1.7;
      color: rgba(255,255,255,0.75);
    }

    /* Stats Band */
    .bl-stats {
      border-bottom: 1px solid var(--hairline);
      background: var(--canvas);
    }

    .bl-stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      max-width: 1200px;
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
      background: #fff;
      border-top: 1px solid var(--hairline);
    }

    .bl-section-inner {
      max-width: 1200px;
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

    @media (max-width: 768px) {
      .bl-section-title { font-size: 28px; }
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
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      margin-top: 40px;
    }

    .bl-project-card {
      padding: 24px;
      border: 1px solid var(--hairline);
      background: var(--canvas-alt);
      transition: box-shadow 0.2s, transform 0.2s;
    }

    .bl-project-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      transform: translateY(-2px);
    }

    .bl-project-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--ink);
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
      margin-bottom: 32px;
    }

    .bl-timeline-dot {
      position: absolute;
      left: -32px;
      top: 4px;
      width: 12px;
      height: 12px;
      border: 2px solid var(--ink);
      background: var(--canvas);
      transform: rotate(45deg);
    }

    .bl-timeline-header {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 6px;
    }

    .bl-timeline-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--ink);
    }

    .bl-timeline-date {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--muted);
    }

    .bl-timeline-qty {
      font-size: 13px;
      color: var(--ink-soft);
      margin-bottom: 4px;
    }

    .bl-timeline-note {
      font-size: 14px;
      line-height: 1.6;
      color: var(--ink-soft);
    }

    .bl-timeline-cert-link {
      display: inline-block;
      margin-top: 8px;
      padding: 6px 14px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink);
      border: 1px solid var(--hairline);
      text-decoration: none;
      transition: background 0.2s;
    }

    .bl-timeline-cert-link:hover {
      background: var(--ink);
      color: #fff;
    }

    /* Contact Cards */
    .bl-contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 32px;
    }

    .bl-contact-card {
      padding: 20px;
      border: 1px solid var(--hairline);
      background: var(--canvas-alt);
    }

    .bl-contact-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--muted);
      margin-bottom: 8px;
    }

    .bl-contact-value {
      font-size: 14px;
      font-weight: 500;
      color: var(--ink);
      word-break: break-all;
    }

    .bl-contact-value a {
      color: var(--ink);
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    .bl-contact-value a:hover { opacity: 0.7; }

    /* Social Links */
    .bl-social-list {
      list-style: none;
      margin-top: 16px;
    }

    .bl-social-list li {
      margin-bottom: 10px;
    }

    .bl-social-list a {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--ink-soft);
      text-decoration: none;
      transition: color 0.2s;
    }

    .bl-social-list a:hover { color: var(--ink); }

    .bl-social-list img {
      max-height: 24px;
      max-width: 24px;
    }

    /* Footer */
    .bl-footer {
      background: var(--ink);
      color: rgba(255,255,255,0.6);
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .bl-footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 64px 24px 40px;
    }

    @media (max-width: 768px) {
      .bl-footer-inner { padding: 48px 16px 32px; }
    }

    .bl-brand {
      max-width: 768px;
      margin-bottom: 56px;
    }

    .bl-brand-label {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .bl-brand-label i { color: rgba(255,255,255,0.5); }

    .bl-brand-label span {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: rgba(255,255,255,0.5);
    }

    .bl-brand-heading {
      font-size: 28px;
      font-weight: 600;
      line-height: 1.3;
      color: #fff;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .bl-brand-heading { font-size: 22px; }
    }

    .bl-brand-text {
      font-size: 14px;
      line-height: 1.8;
      max-width: 640px;
      color: rgba(255,255,255,0.45);
    }

    .bl-footer-bottom {
      padding-top: 32px;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .bl-footer-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bl-footer-brand-icon {
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .bl-footer-brand-icon i {
      color: #fff;
      font-size: 14px;
    }

    .bl-footer-copyright {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-weight: 500;
      color: rgba(255,255,255,0.35);
    }

    .bl-footer-links-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
      margin-bottom: 56px;
    }

    @media (max-width: 768px) {
      .bl-footer-links-grid { grid-template-columns: 1fr; }
    }

    .bl-footer-links-title {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: rgba(255,255,255,0.35);
      margin-bottom: 20px;
    }

    .bl-footer-links-list {
      list-style: none;
    }

    .bl-footer-links-list li { margin-bottom: 12px; }

    .bl-footer-links-list a {
      font-size: 12px;
      font-weight: 400;
      color: rgba(255,255,255,0.55);
      text-decoration: none;
      transition: color 0.2s;
    }

    .bl-footer-links-list a:hover { color: #fff; }

    .bl-footer-contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .bl-footer-contact-item i {
      width: 12px;
      height: 12px;
      color: rgba(255,255,255,0.4);
    }

    .bl-footer-contact-item span {
      font-size: 12px;
      color: rgba(255,255,255,0.4);
    }

    .bl-powered-by {
      margin-top: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }

    .bl-powered-by span {
      font-size: 12px;
      color: rgba(255,255,255,0.45);
    }

    .bl-powered-by img {
      margin-left: 9px;
      filter: brightness(0) invert(1);
    }
  </style>
</head>
<body>
  <!-- Navbar -->
  <nav class="bl-navbar">
    ${dynamic?.logo ? `<img src="${dynamic.logo}" alt="Logo" class="bl-nav-logo" />` : ''}
    <ul class="bl-nav-links">
      ${dynamic?.showHomePage && dynamic?.isValidHomePageURL ? `<li><a href="${dynamic.homePageURL}">Home</a></li>` : ''}
      ${dynamic?.showAboutUs && dynamic?.isValidAboutUsURL ? `<li><a href="${dynamic.aboutUsURL}">About</a></li>` : ''}
      ${dynamic?.showContactUs && dynamic?.isValidContactPageURL ? `<li><a href="${dynamic.contactPageURL}">Contact</a></li>` : ''}
    </ul>
  </nav>

  <!-- Hero Section -->
  <section class="bl-hero">
    <div class="bl-hero-inner">
      <div class="bl-hero-label">${dynamic?.companyName || 'EcoStance'}</div>
      <h1 class="bl-hero-title">${dynamic?.title && dynamic.title !== '' ? dynamic.title : 'Our Stance on Climate Change'}</h1>
      ${dynamic?.description && dynamic.description !== '' ? `<p class="bl-hero-desc">${dynamic.description}</p>` : ''}
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
  ${dynamic?.allProjects && dynamic.allProjects.length > 0 ? `
  <section class="bl-section">
    <div class="bl-section-inner">
      <div class="bl-section-label">Climate Projects</div>
      <h2 class="bl-section-title">Every tonne accounted for.</h2>
      <div class="bl-projects-grid">
        ${dynamic.allProjects.map(project => `
          <div class="bl-project-card">
            <div class="bl-project-name">${project}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Certificates / Chain of Custody -->
  ${dynamic?.certData && dynamic.certData.length > 0 ? `
  <section class="bl-section-alt">
    <div class="bl-section-inner">
      <div class="bl-section-label">Chain of Custody</div>
      <h2 class="bl-section-title">Carbon Offset Certificates</h2>
      <p class="bl-section-text">Every offset we retire is issued a unique certificate that eliminates double counting.</p>
      <div class="bl-timeline">
        <div class="bl-timeline-line"></div>
        ${dynamic.certData.map((cert, i) => `
          <div class="bl-timeline-item">
            <div class="bl-timeline-dot"></div>
            <div class="bl-timeline-header">
              <h3 class="bl-timeline-title">${cert?.product?.name || 'Certificate'}</h3>
              <span class="bl-timeline-date">${cert?.originNumber || ''}</span>
            </div>
            ${cert?.quantity ? `<p class="bl-timeline-qty">Offset Quantity: <strong>${cert.quantity} Tons</strong></p>` : ''}
            <p class="bl-timeline-note">${dynamic.returnShortenParagraph(cert?.product?.description || '')}</p>
            ${cert?.certificate?.certificateURL ? `<a href="${cert.certificate.certificateURL}" target="_blank" class="bl-timeline-cert-link">View Certificate</a>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- About Us -->
  ${dynamic?.aboutUs && dynamic.aboutUs !== '' ? `
  <section class="bl-section">
    <div class="bl-section-inner">
      <div class="bl-section-label">About Us</div>
      <h2 class="bl-section-title">We are not waiting for 2030 or 2050 for NetZero.</h2>
      <div class="bl-section-text">
        <p>${dynamic.aboutUs}</p>
      </div>
    </div>
  </section>` : ''}

  <!-- Contact & Social -->
  <section class="bl-section-alt">
    <div class="bl-section-inner">
      <div class="bl-section-label">Get in Touch</div>
      <h2 class="bl-section-title">Connect With Us</h2>
      <div class="bl-contact-grid">
        ${dynamic?.showName && dynamic?.name ? `
        <div class="bl-contact-card">
          <p class="bl-contact-label">Name</p>
          <p class="bl-contact-value">${dynamic.name}</p>
        </div>` : ''}
        ${dynamic?.showEmail && dynamic?.email ? `
        <div class="bl-contact-card">
          <p class="bl-contact-label">Email</p>
          <p class="bl-contact-value"><a href="mailto:${dynamic.email}">${dynamic.email}</a></p>
        </div>` : ''}
        ${dynamic?.showPhone && dynamic?.phone ? `
        <div class="bl-contact-card">
          <p class="bl-contact-label">Phone</p>
          <p class="bl-contact-value">${dynamic.phone}</p>
        </div>` : ''}
      </div>
      <ul class="bl-social-list">
        ${dynamic?.showSocialt1 ? dynamic.showSocialt1('<i class="fa fa-linkedin"></i> LinkedIn', dynamic.linkedin, dynamic.showLinkedin) : ''}
        ${dynamic?.showSocialt1 ? dynamic.showSocialt1('<i class="fa fa-instagram"></i> Instagram', dynamic.instagram, dynamic.showInstagram) : ''}
        ${dynamic?.showSocialt1 ? dynamic.showSocialt1('<i class="fa fa-twitter"></i> Twitter', dynamic.twitter, dynamic.showTwitter) : ''}
        ${dynamic?.showSocialt1 ? dynamic.showSocialt1('<i class="fa fa-facebook"></i> Facebook', dynamic.facebook, dynamic.showFacebook) : ''}
      </ul>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bl-footer">
    <div class="bl-footer-inner">
      <!-- Brand Statement -->
      <div class="bl-brand">
        <div class="bl-brand-label">
          <i class="fa fa-leaf"></i>
          <span>Our Promise</span>
        </div>
        <h3 class="bl-brand-heading">We are doing our part in combating climate change</h3>
        <p class="bl-brand-text">Every product we create is a step toward a healthier planet. Traceable materials, verified emissions, and transparent supply chains — because the future deserves better.</p>
      </div>

      <!-- Footer Links -->
      <div class="bl-footer-links-grid">
        <div>
          <h4 class="bl-footer-links-title">Navigation</h4>
          <ul class="bl-footer-links-list">
            ${dynamic?.showHomePage && dynamic?.isValidHomePageURL ? `<li><a href="${dynamic.homePageURL}">Home Page</a></li>` : ''}
            ${dynamic?.showAboutUs && dynamic?.isValidAboutUsURL ? `<li><a href="${dynamic.aboutUsURL}">About Us</a></li>` : ''}
            ${dynamic?.showContactUs && dynamic?.isValidContactPageURL ? `<li><a href="${dynamic.contactPageURL}">Contact</a></li>` : ''}
          </ul>
        </div>
        <div>
          <h4 class="bl-footer-links-title">Legal</h4>
          <ul class="bl-footer-links-list">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Access</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 class="bl-footer-links-title">Connect</h4>
          <ul class="bl-footer-links-list">
            ${dynamic?.showLinkedin && dynamic?.linkedin ? `<li><a href="${dynamic.linkedin}" target="_blank"><i class="fa fa-linkedin"></i> LinkedIn</a></li>` : ''}
            ${dynamic?.showInstagram && dynamic?.instagram ? `<li><a href="${dynamic.instagram}" target="_blank"><i class="fa fa-instagram"></i> Instagram</a></li>` : ''}
            ${dynamic?.showTwitter && dynamic?.twitter ? `<li><a href="${dynamic.twitter}" target="_blank"><i class="fa fa-twitter"></i> Twitter</a></li>` : ''}
            ${dynamic?.showFacebook && dynamic?.facebook ? `<li><a href="${dynamic.facebook}" target="_blank"><i class="fa fa-facebook"></i> Facebook</a></li>` : ''}
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="bl-footer-bottom">
        <div class="bl-footer-brand">
          <div class="bl-footer-brand-icon">
            <i class="fa fa-leaf"></i>
          </div>
          <p class="bl-footer-copyright">&copy; ${new Date().getFullYear()} ${dynamic?.companyName || 'EcoStance'}. All rights reserved.</p>
        </div>
      </div>

      <!-- Powered By -->
      <div class="bl-powered-by">
        <span>Powered By</span>
        <img src="https://ecostance.com/assets/images/logo_big2.png" alt="ecostanceLogo" width="100" height="18" />
      </div>
    </div>
  </footer>
</body>
</html>
`;
