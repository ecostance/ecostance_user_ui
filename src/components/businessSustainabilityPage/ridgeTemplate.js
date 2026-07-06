export const ridgeTemplate = (dynamic) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RIDGE — Built for the line you take up</title>
<meta name="description" content="RIDGE engineers alpine layers around elevation and exposure, tested on the routes they're named for.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{
  --granite:#2e3338; --granite-soft:#3c434a;
  --paper:#eceee9; --paper-raised:#e2e4dd;
  --spruce:#37493f; --ice:#a9c4c9; --ember:#c1622b;
  --line:#cfd2c9; --ink-soft:#5b615c;
  --display:'Newsreader',Georgia,serif;
  --body:'Inter',-apple-system,sans-serif;
  --mono:'IBM Plex Mono',monospace;
  --max:1240px; --pad:clamp(20px,5vw,64px);
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;background:var(--paper);color:var(--granite);font-family:var(--body);line-height:1.55;-webkit-font-smoothing:antialiased;}
a{color:inherit;text-decoration:none;}
ul{list-style:none;margin:0;padding:0;}
button{font-family:inherit;cursor:pointer;}
h1,h2,h3{font-family:var(--display);font-weight:500;margin:0;}
@media (prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;transition-duration:.001ms!important;}}
:focus-visible{outline:2px solid var(--ember);outline-offset:3px;}

.announce{background:var(--granite);color:var(--paper);font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;text-align:center;padding:9px 12px;}

.site-header{position:sticky;top:0;z-index:100;background:rgba(236,238,233,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);}
.header-inner{max-width:var(--max);margin:0 auto;padding:18px var(--pad);display:flex;align-items:center;gap:24px;}
.logo{font-family:var(--display);font-style:italic;font-size:23px;margin-right:auto;}
.main-nav{display:flex;gap:30px;margin-right:auto;}
.main-nav a{font-size:13px;letter-spacing:.03em;text-transform:uppercase;font-family:var(--mono);}
.main-nav a:hover{color:var(--ember);}
.header-actions{display:flex;gap:14px;align-items:center;}
.icon-btn{background:none;border:none;color:var(--granite);padding:6px;position:relative;display:flex;}
.cart-count{position:absolute;top:-2px;right:-2px;background:var(--ember);color:var(--paper);font-family:var(--mono);font-size:9px;width:15px;height:15px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.nav-toggle{display:none;flex-direction:column;gap:4px;background:none;border:none;padding:6px;}
.nav-toggle span{width:20px;height:1.5px;background:var(--granite);}

.hero{position:relative;min-height:92vh;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(180deg,#232a2e 0%,var(--granite) 55%);color:var(--paper);overflow:hidden;padding:120px var(--pad) 80px;}
.contours{position:absolute;inset:0;z-index:0;opacity:.5;}
.hero-content{position:relative;z-index:1;max-width:700px;}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ice);margin:0 0 18px;}
.hero h1{font-size:clamp(46px,7.5vw,86px);line-height:1.02;font-style:italic;margin:0 0 22px;}
.hero-sub{font-size:16.5px;color:#c7cbc4;max-width:520px;margin:0 auto 34px;}
.hero-cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
.btn{display:inline-block;padding:14px 28px;font-family:var(--mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;transition:transform .2s ease,background .2s ease;}
.btn-light{background:var(--paper);color:var(--granite);}
.btn-light:hover{background:#fff;transform:translateY(-2px);}
.btn-ghost{border:1px solid rgba(236,238,233,.4);color:var(--paper);}
.btn-ghost:hover{border-color:var(--paper);}

.intro{max-width:840px;margin:0 auto;padding:110px var(--pad) 80px;}
.intro-eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--spruce);margin:0 0 20px;}
.intro h2{font-size:clamp(28px,3.8vw,40px);line-height:1.25;margin:0 0 22px;}
.intro h2 em{font-style:italic;color:var(--ember);}
.intro-body{font-size:16.5px;color:var(--ink-soft);max-width:600px;}

.shop{max-width:var(--max);margin:0 auto;padding:20px var(--pad) 100px;}
.section-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:32px;border-bottom:1px solid var(--line);padding-bottom:16px;}
.section-head h2{font-size:clamp(24px,3vw,32px);}
.text-link{font-family:var(--mono);font-size:12px;text-transform:uppercase;border-bottom:1px solid var(--granite);padding-bottom:2px;}
.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:26px;}
@media (max-width:980px){.product-grid{grid-template-columns:repeat(2,1fr);}}
@media (max-width:560px){.product-grid{grid-template-columns:1fr;}}
.product-card{background:var(--paper-raised);border:1px solid var(--line);transition:transform .2s ease;}
.product-card:hover{transform:translateY(-4px);}
.product-visual{aspect-ratio:4/5;background:linear-gradient(155deg,#dfe1d8,#c7cabd);position:relative;}
.product-visual svg{position:absolute;inset:0;width:100%;height:100%;}
.product-info{padding:16px 16px 18px;}
.product-info h3{font-family:var(--body);font-size:15px;font-weight:500;}
.product-fibre{font-family:var(--mono);font-size:11px;color:var(--ink-soft);margin:4px 0 0;}
.product-row{display:flex;justify-content:space-between;align-items:center;margin-top:10px;}
.price{font-family:var(--mono);font-size:13.5px;}
.btn-add{background:var(--granite);color:var(--paper);border:none;padding:8px 14px;font-family:var(--mono);font-size:10.5px;text-transform:uppercase;}
.btn-add:hover{background:var(--ember);}

.marquee{background:var(--spruce);color:var(--paper);overflow:hidden;padding:13px 0;border-top:1px solid var(--granite);border-bottom:1px solid var(--granite);}
.marquee-track{display:flex;width:max-content;animation:scroll-m 30s linear infinite;}
.marquee-track span{font-family:var(--mono);font-size:12.5px;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;}
@keyframes scroll-m{from{transform:translateX(0);}to{transform:translateX(-50%);}}

.tech{background:var(--granite);color:var(--paper);padding:110px var(--pad);}
.tech-head{max-width:var(--max);margin:0 auto 55px;text-align:center;}
.tech-head .intro-eyebrow{color:var(--ice);}
.tech-head h2{font-size:clamp(30px,4vw,44px);font-style:italic;}
.elevation-chart{max-width:820px;margin:0 auto 70px;height:190px;}
.tech-grid{max-width:var(--max);margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(236,238,233,.15);}
@media (max-width:820px){.tech-grid{grid-template-columns:1fr;}}
.tech-card{background:var(--granite);padding:34px 28px;}
.tech-card h3{font-family:var(--body);font-size:18px;font-weight:500;margin-bottom:10px;}
.tech-card p{color:#b7bcb4;font-size:14.5px;line-height:1.6;margin:0;}

.stats{max-width:var(--max);margin:0 auto;padding:100px var(--pad);display:grid;grid-template-columns:.8fr 1.2fr;gap:60px;align-items:center;}
@media (max-width:820px){.stats{grid-template-columns:1fr;}}
.stats-visual{display:flex;align-items:center;justify-content:center;}
.stat-ring{width:210px;height:210px;border-radius:50%;background:conic-gradient(var(--ember) 0deg,var(--ember) calc(var(--pct,0) * 3.6deg),var(--line) calc(var(--pct,0) * 3.6deg));display:flex;align-items:center;justify-content:center;transition:background 1.4s ease;}
.stat-ring::after{content:'shell-3l';width:155px;height:155px;border-radius:50%;background:var(--paper);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);}
.stats-copy h2{font-size:clamp(26px,3.4vw,36px);margin:16px 0 28px;}
.stat-list{display:flex;flex-direction:column;gap:16px;margin-bottom:26px;}
.stat-list li{display:flex;align-items:baseline;gap:6px;border-bottom:1px solid var(--line);padding-bottom:14px;}
.stat-num{font-family:var(--display);font-style:italic;font-size:32px;color:var(--ember);}
.stat-label{font-size:14px;color:var(--ink-soft);margin-left:8px;}

.newsletter{padding:110px var(--pad);text-align:center;}
.newsletter-inner{max-width:460px;margin:0 auto;}
.newsletter h2{font-size:clamp(26px,3.4vw,34px);margin-bottom:12px;font-style:italic;}
.newsletter p{color:var(--ink-soft);margin-bottom:28px;}
.newsletter-form{display:flex;gap:10px;}
.newsletter-form input{flex:1;padding:13px 16px;border:1px solid var(--line);background:var(--paper-raised);font-family:var(--body);font-size:14px;color:var(--granite);}
.newsletter-form button{padding:13px 22px;background:var(--granite);color:var(--paper);border:none;font-family:var(--mono);font-size:11px;text-transform:uppercase;}
.newsletter-form button:hover{background:var(--ember);}
@media (max-width:480px){.newsletter-form{flex-direction:column;}}
.newsletter-note{font-family:var(--mono);font-size:12px;color:var(--spruce);margin-top:14px;min-height:1em;}

.site-footer{background:var(--granite);color:#b7bcb4;padding:70px var(--pad) 28px;}
.footer-top{max-width:var(--max);margin:0 auto;display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:36px;padding-bottom:44px;border-bottom:1px solid rgba(236,238,233,.12);}
@media (max-width:700px){.footer-top{grid-template-columns:1fr 1fr;}}
.footer-brand .logo{color:var(--paper);}
.footer-brand p{margin-top:10px;font-size:13px;}
.footer-col h4{font-family:var(--mono);font-size:11px;text-transform:uppercase;color:var(--paper);margin:0 0 14px;}
.footer-col{display:flex;flex-direction:column;gap:9px;font-size:13px;}
.footer-bottom{max-width:var(--max);margin:0 auto;display:flex;justify-content:space-between;padding-top:20px;font-size:12px;flex-wrap:wrap;gap:12px;}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--granite);color:var(--paper);padding:12px 20px;font-family:var(--mono);font-size:12.5px;opacity:0;pointer-events:none;transition:all .3s ease;z-index:200;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease;}
.reveal.in{opacity:1;transform:translateY(0);}
@media (max-width:860px){
  .nav-toggle{display:flex;order:-1;}
  .main-nav{position:fixed;inset:0 0 0 auto;top:0;height:100vh;width:78%;max-width:300px;background:var(--granite);flex-direction:column;padding:100px 30px 30px;gap:24px;transform:translateX(100%);transition:transform .3s ease;z-index:99;}
  .main-nav.open{transform:translateX(0);}
  .main-nav a{color:var(--paper);font-size:15px;}
  .logo{margin:0 auto;}
}
</style>
</head>
<body>

<div class="announce">Alpine shell restock — limited run, ships worldwide</div>

<header class="site-header" id="siteHeader">
  <div class="header-inner">
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <a href="#top" class="logo">Ridge</a>
    <nav class="main-nav" id="mainNav">
      <a href="#shop">Shop</a>
      <a href="#technology">Technology</a>
      <a href="#">Journal</a>
      <a href="#">About</a>
    </nav>
    <div class="header-actions">
      <button class="icon-btn" id="searchBtn" aria-label="Search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
      <button class="icon-btn" id="cartBtn" aria-label="Cart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.6"/></svg><span class="cart-count" id="cartCount">0</span></button>
    </div>
  </div>
</header>

<main id="top">
  <section class="hero">
    <svg class="contours" id="contours" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice"></svg>
    <div class="hero-content">
      <p class="eyebrow">Elevation Series</p>
      <h1>Built for the <em>line</em> you take up</h1>
      <p class="hero-sub">Every RIDGE shell is tested on the routes it's named for — logged elevation, wind exposure and temperature swing, not a lab spec sheet.</p>
      <div class="hero-cta">
        <a href="#shop" class="btn btn-light">Shop the collection</a>
        <a href="#technology" class="btn btn-ghost">See the testing</a>
      </div>
    </div>
  </section>

  <section class="intro">
    <p class="intro-eyebrow">01 — Why route-tested</p>
    <h2>A lab can simulate wind. It can't simulate the third hour of a whiteout at 3,400 metres. <em>So we don't rely on it alone.</em></h2>
    <p class="intro-body">Every RIDGE prototype spends a season on the alpine routes it's designed for before it's approved — logged against real elevation gain, exposure and temperature swing.</p>
  </section>

  <section class="shop" id="shop">
    <div class="section-head"><h2>The Alpine Collection</h2><a href="#" class="text-link">View all →</a></div>
    <div class="product-grid">
      <article class="product-card"><div class="product-visual" data-garment="shell"></div><div class="product-info"><h3>3L Alpine Shell</h3><p class="product-fibre">Route-tested · 340g</p><div class="product-row"><span class="price">€310</span><button class="btn-add" data-name="3L Alpine Shell" data-price="310">Add</button></div></div></article>
      <article class="product-card"><div class="product-visual" data-garment="vest"></div><div class="product-info"><h3>Insulated Vest</h3><p class="product-fibre">Route-tested · 210g</p><div class="product-row"><span class="price">€165</span><button class="btn-add" data-name="Insulated Vest" data-price="165">Add</button></div></div></article>
      <article class="product-card"><div class="product-visual" data-garment="pant"></div><div class="product-info"><h3>Softshell Pant</h3><p class="product-fibre">Route-tested · 4-way stretch</p><div class="product-row"><span class="price">€185</span><button class="btn-add" data-name="Softshell Pant" data-price="185">Add</button></div></div></article>
      <article class="product-card"><div class="product-visual" data-garment="base"></div><div class="product-info"><h3>Alpine Base Layer</h3><p class="product-fibre">Merino-synthetic blend</p><div class="product-row"><span class="price">€98</span><button class="btn-add" data-name="Alpine Base Layer" data-price="98">Add</button></div></div></article>
    </div>
  </section>

  <div class="marquee"><div class="marquee-track" id="marqueeTrack"></div></div>

  <section class="tech" id="technology">
    <div class="tech-head"><p class="intro-eyebrow">02 — Route Testing Log</p><h2>Proven on the line, not just in the lab</h2></div>
    <div class="elevation-chart" id="elevationChart"></div>
    <div class="tech-grid">
      <div class="tech-card"><h3>Logged exposure</h3><p>Every prototype records real wind, temperature and elevation gain across its test route before approval.</p></div>
      <div class="tech-card"><h3>Repairable by design</h3><p>Field-serviceable zips and seams, so a torn shell can be fixed on the trail, not replaced.</p></div>
      <div class="tech-card"><h3>Weight audited</h3><p>Every gram is accounted for — nothing added that doesn't earn its place in the pack.</p></div>
    </div>
  </section>

  <section class="stats">
    <div class="stats-visual"><div class="stat-ring" id="statRing"></div></div>
    <div class="stats-copy reveal">
      <p class="intro-eyebrow">Tested, not assumed</p>
      <h2>Route data, not lab specs</h2>
      <ul class="stat-list">
        <li><span class="stat-num" data-count="4200">0</span><span class="stat-label">m max test elevation</span></li>
        <li><span class="stat-num" data-count="12">0</span><span class="stat-label">alpine routes used for testing</span></li>
        <li><span class="stat-num" data-count="340">0</span><span class="stat-label">g full shell weight</span></li>
      </ul>
      <a href="#" class="text-link">See the full route log →</a>
    </div>
  </section>

  <section class="newsletter">
    <div class="newsletter-inner">
      <h2>Join the ascent</h2>
      <p>Route logs, early access, and the occasional discount.</p>
      <form id="newsletterForm" class="newsletter-form">
        <input type="email" required placeholder="you@example.com" aria-label="Email address">
        <button type="submit">Subscribe</button>
      </form>
      <p class="newsletter-note" id="newsletterNote" role="status" aria-live="polite"></p>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="footer-top">
    <div class="footer-brand"><a href="#top" class="logo">Ridge</a><p>Alpine layers, route-tested.</p></div>
    <div class="footer-col"><h4>Shop</h4><a href="#shop">Bestsellers</a><a href="#shop">New arrivals</a><a href="#shop">Accessories</a></div>
    <div class="footer-col"><h4>Support</h4><a href="#">FAQ</a><a href="#">Contact</a><a href="#">Fit guide</a></div>
  </div>
  <div class="footer-bottom"><p>© <span id="year"></span> Ridge. All rights reserved.</p></div>
</footer>

<div class="toast" id="toast"></div>
    </body>
</html>
`;
