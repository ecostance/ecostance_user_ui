export const tideTemplate = (dynamic) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TIDE — Suited to the water you swim in</title>
<meta name="description" content="TIDE builds swim and surf layers around water temperature and salinity, tested at the coast they're named for.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&family=Work+Sans:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
:root{
  --navy:#12232b; --navy-soft:#1c333d;
  --foam:#eef1ea; --foam-dim:#e2e6db;
  --sand:#cdbfa0; --coral:#c2452f;
  --line:#d3d6cb; --ink-soft:#57625e;
  --display:'Libre Caslon Display',Georgia,serif;
  --body:'Work Sans',-apple-system,sans-serif;
  --mono:'Space Mono',monospace;
  --max:1240px; --pad:clamp(20px,5vw,64px);
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;background:var(--foam);color:var(--navy);font-family:var(--body);line-height:1.55;-webkit-font-smoothing:antialiased;}
a{color:inherit;text-decoration:none;}
ul{list-style:none;margin:0;padding:0;}
button{font-family:inherit;cursor:pointer;}
h1,h2,h3{font-family:var(--display);font-weight:400;margin:0;}
@media (prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;transition-duration:.001ms!important;}}
:focus-visible{outline:2px solid var(--coral);outline-offset:3px;}

.announce{background:var(--navy);color:var(--foam);font-family:var(--mono);font-size:11px;letter-spacing:.05em;text-transform:uppercase;text-align:center;padding:9px 12px;}

.site-header{position:sticky;top:0;z-index:100;background:rgba(238,241,234,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);}
.header-inner{max-width:var(--max);margin:0 auto;padding:18px var(--pad);display:flex;align-items:center;gap:24px;}
.logo{font-family:var(--display);font-size:23px;letter-spacing:.02em;margin-right:auto;}
.main-nav{display:flex;gap:30px;margin-right:auto;}
.main-nav a{font-size:12.5px;letter-spacing:.04em;text-transform:uppercase;font-family:var(--mono);}
.main-nav a:hover{color:var(--coral);}
.header-actions{display:flex;gap:14px;align-items:center;}
.icon-btn{background:none;border:none;color:var(--navy);padding:6px;position:relative;display:flex;}
.cart-count{position:absolute;top:-2px;right:-2px;background:var(--coral);color:var(--foam);font-family:var(--mono);font-size:9px;width:15px;height:15px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.nav-toggle{display:none;flex-direction:column;gap:4px;background:none;border:none;padding:6px;}
.nav-toggle span{width:20px;height:1.5px;background:var(--navy);}

.hero{position:relative;min-height:92vh;display:flex;align-items:center;background:var(--navy);color:var(--foam);overflow:hidden;padding:120px var(--pad) 90px;}
.tide-waves{position:absolute;inset:0;z-index:0;opacity:.65;}
.hero-content{position:relative;z-index:1;max-width:var(--max);margin:0 auto;width:100%;}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--coral);margin:0 0 18px;}
.hero h1{font-size:clamp(42px,7vw,84px);line-height:1.05;margin:0 0 22px;max-width:680px;}
.hero-sub{font-size:16.5px;color:#c4cec8;max-width:480px;margin:0 0 34px;}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap;}
.btn{display:inline-block;padding:14px 28px;font-family:var(--mono);font-size:12px;letter-spacing:.05em;text-transform:uppercase;transition:transform .2s ease,background .2s ease;}
.btn-light{background:var(--foam);color:var(--navy);}
.btn-light:hover{background:#fff;transform:translateY(-2px);}
.btn-ghost{border:1px solid rgba(238,241,234,.4);color:var(--foam);}
.btn-ghost:hover{border-color:var(--foam);}
.tide-readout{position:absolute;bottom:24px;right:var(--pad);font-family:var(--mono);font-size:12px;color:var(--sand);z-index:1;text-align:right;line-height:1.6;}

.intro{max-width:840px;margin:0 auto;padding:110px var(--pad) 80px;}
.intro-eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--coral);margin:0 0 20px;}
.intro h2{font-size:clamp(28px,3.8vw,40px);line-height:1.3;margin:0 0 22px;}
.intro-body{font-size:16.5px;color:var(--ink-soft);max-width:600px;font-family:var(--body);}

.shop{max-width:var(--max);margin:0 auto;padding:20px var(--pad) 100px;}
.section-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:32px;border-bottom:1px solid var(--line);padding-bottom:16px;}
.section-head h2{font-size:clamp(24px,3vw,32px);}
.text-link{font-family:var(--mono);font-size:12px;text-transform:uppercase;border-bottom:1px solid var(--navy);padding-bottom:2px;}
.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:26px;}
@media (max-width:980px){.product-grid{grid-template-columns:repeat(2,1fr);}}
@media (max-width:560px){.product-grid{grid-template-columns:1fr;}}
.product-card{background:var(--foam-dim);border:1px solid var(--line);transition:transform .2s ease;}
.product-card:hover{transform:translateY(-4px);}
.product-visual{aspect-ratio:4/5;background:linear-gradient(155deg,#dfe3d7,#c7cbb9);position:relative;}
.product-visual svg{position:absolute;inset:0;width:100%;height:100%;}
.product-info{padding:16px 16px 18px;}
.product-info h3{font-family:var(--body);font-size:15px;font-weight:500;}
.product-fibre{font-family:var(--mono);font-size:11px;color:var(--ink-soft);margin:4px 0 0;}
.product-row{display:flex;justify-content:space-between;align-items:center;margin-top:10px;}
.price{font-family:var(--mono);font-size:13.5px;}
.btn-add{background:var(--navy);color:var(--foam);border:none;padding:8px 14px;font-family:var(--mono);font-size:10.5px;text-transform:uppercase;}
.btn-add:hover{background:var(--coral);}

.marquee{background:var(--coral);color:var(--foam);overflow:hidden;padding:13px 0;border-top:1px solid var(--navy);border-bottom:1px solid var(--navy);}
.marquee-track{display:flex;width:max-content;animation:scroll-m 28s linear infinite;}
.marquee-track span{font-family:var(--mono);font-size:12.5px;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;}
@keyframes scroll-m{from{transform:translateX(0);}to{transform:translateX(-50%);}}

.tech{background:var(--navy);color:var(--foam);padding:110px var(--pad);}
.tech-head{max-width:var(--max);margin:0 auto 55px;text-align:center;}
.tech-head .intro-eyebrow{color:var(--sand);}
.tech-head h2{font-size:clamp(30px,4vw,44px);}
.tide-chart{max-width:820px;margin:0 auto 70px;height:190px;}
.tech-grid{max-width:var(--max);margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(238,241,234,.15);}
@media (max-width:820px){.tech-grid{grid-template-columns:1fr;}}
.tech-card{background:var(--navy);padding:34px 28px;}
.tech-card h3{font-family:var(--body);font-size:18px;font-weight:500;margin-bottom:10px;}
.tech-card p{color:#b6c0ba;font-size:14.5px;line-height:1.6;margin:0;}

.stats{max-width:var(--max);margin:0 auto;padding:100px var(--pad);display:grid;grid-template-columns:repeat(3,1fr);gap:30px;text-align:center;}
@media (max-width:760px){.stats{grid-template-columns:1fr;}}
.stat-num{font-family:var(--display);font-size:clamp(42px,6vw,64px);color:var(--coral);line-height:1;}
.stat-label{font-family:var(--mono);font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-soft);margin-top:10px;}

.newsletter{padding:110px var(--pad);text-align:center;background:var(--foam-dim);}
.newsletter-inner{max-width:460px;margin:0 auto;}
.newsletter h2{font-size:clamp(26px,3.4vw,34px);margin-bottom:12px;}
.newsletter p{color:var(--ink-soft);margin-bottom:28px;}
.newsletter-form{display:flex;gap:10px;}
.newsletter-form input{flex:1;padding:13px 16px;border:1px solid var(--line);background:var(--foam);font-family:var(--body);font-size:14px;color:var(--navy);}
.newsletter-form button{padding:13px 22px;background:var(--navy);color:var(--foam);border:none;font-family:var(--mono);font-size:11px;text-transform:uppercase;}
.newsletter-form button:hover{background:var(--coral);}
@media (max-width:480px){.newsletter-form{flex-direction:column;}}
.newsletter-note{font-family:var(--mono);font-size:12px;color:var(--coral);margin-top:14px;min-height:1em;}

.site-footer{background:var(--navy);color:#b6c0ba;padding:70px var(--pad) 28px;}
.footer-top{max-width:var(--max);margin:0 auto;display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:36px;padding-bottom:44px;border-bottom:1px solid rgba(238,241,234,.12);}
@media (max-width:700px){.footer-top{grid-template-columns:1fr 1fr;}}
.footer-brand .logo{color:var(--foam);}
.footer-brand p{margin-top:10px;font-size:13px;}
.footer-col h4{font-family:var(--mono);font-size:11px;text-transform:uppercase;color:var(--foam);margin:0 0 14px;}
.footer-col{display:flex;flex-direction:column;gap:9px;font-size:13px;}
.footer-bottom{max-width:var(--max);margin:0 auto;display:flex;justify-content:space-between;padding-top:20px;font-size:12px;flex-wrap:wrap;gap:12px;}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--navy);color:var(--foam);padding:12px 20px;font-family:var(--mono);font-size:12.5px;opacity:0;pointer-events:none;transition:all .3s ease;z-index:200;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease;}
.reveal.in{opacity:1;transform:translateY(0);}
@media (max-width:860px){
  .nav-toggle{display:flex;order:-1;}
  .main-nav{position:fixed;inset:0 0 0 auto;top:0;height:100vh;width:78%;max-width:300px;background:var(--navy);flex-direction:column;padding:100px 30px 30px;gap:24px;transform:translateX(100%);transition:transform .3s ease;z-index:99;}
  .main-nav.open{transform:translateX(0);}
  .main-nav a{color:var(--foam);font-size:15px;}
  .logo{margin:0 auto;}
}
  .product-image {
  width: 100%;
  height: 320px;
  object-fit: cover;
  display: block;
  border-radius: 16px 16px 0 0;
}

.product-card {
  overflow: hidden;
}
</style>
</head>
<body>

<div class="announce">New wetsuit line — sea-tested off three coastlines</div>

<header class="site-header" id="siteHeader">
  <div class="header-inner">
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <a href="#top" class="logo">Tide</a>
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
    <svg class="tide-waves" id="tideWaves" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice"></svg>
    <div class="hero-content">
      <p class="eyebrow">The Coastal Series</p>
      <h1>Suited to the water<br>you actually swim in</h1>
      <p class="hero-sub">Water temperature, salinity and swell shape every TIDE wetsuit — tested at the coast it's built for, not a generic spec sheet.</p>
      <div class="hero-cta">
        <a href="#shop" class="btn btn-light">Shop the collection</a>
        <a href="#technology" class="btn btn-ghost">See the testing</a>
      </div>
    </div>
    <div class="tide-readout" id="tideReadout">TIDE: RISING · 14.2°C</div>
  </section>

  <section class="intro">
    <p class="intro-eyebrow">01 — Why coast-tested</p>
    <h2>A pool doesn't have salt, swell or a 6am chill. So we stopped testing in one.</h2>
    <p class="intro-body">Each TIDE suit is logged against real sea temperature and salinity readings from the coastline it's named for, before a single seam is finalised.</p>
  </section>

<section class="shop" id="shop">
  <div class="section-head">
    <h2>The Coastal Collection</h2>
    <a href="#" class="text-link">View all →</a>
  </div>

  <div class="product-grid">

    <article class="product-card">
      <img
        src="https://picsum.photos/400/500?random=1"
        alt="3/2 Full Wetsuit"
        class="product-image"
      />
      <div class="product-info">
        <h3>3/2 Full Wetsuit</h3>
        <p class="product-fibre">Coast-tested · 14°C</p>
        <div class="product-row">
          <span class="price">€245</span>
          <button class="btn-add" data-name="3/2 Full Wetsuit" data-price="245">Add</button>
        </div>
      </div>
    </article>

    <article class="product-card">
      <img
        src="https://picsum.photos/400/500?random=2"
        alt="Long Sleeve Rashguard"
        class="product-image"
      />
      <div class="product-info">
        <h3>Long Sleeve Rashguard</h3>
        <p class="product-fibre">UPF 50+</p>
        <div class="product-row">
          <span class="price">€58</span>
          <button class="btn-add" data-name="Long Sleeve Rashguard" data-price="58">Add</button>
        </div>
      </div>
    </article>

    <article class="product-card">
      <img
        src="https://picsum.photos/400/500?random=3"
        alt="Swim Trunks"
        class="product-image"
      />
      <div class="product-info">
        <h3>Swim Trunks</h3>
        <p class="product-fibre">Quick-dry weave</p>
        <div class="product-row">
          <span class="price">€48</span>
          <button class="btn-add" data-name="Swim Trunks" data-price="48">Add</button>
        </div>
      </div>
    </article>

    <article class="product-card">
      <img
        src="https://picsum.photos/400/500?random=4"
        alt="Open Water One-Piece"
        class="product-image"
      />
      <div class="product-info">
        <h3>Open Water One-Piece</h3>
        <p class="product-fibre">Chlorine-resistant</p>
        <div class="product-row">
          <span class="price">€82</span>
          <button class="btn-add" data-name="Open Water One-Piece" data-price="82">Add</button>
        </div>
      </div>
    </article>

  </div>
</section>

  <div class="marquee"><div class="marquee-track" id="marqueeTrack"></div></div>

  <section class="tech" id="technology">
    <div class="tech-head"><p class="intro-eyebrow">02 — Coastal Testing Log</p><h2>Built against real tide data</h2></div>
    <div class="tide-chart" id="tideChart"></div>
    <div class="tech-grid">
      <div class="tech-card"><h3>Salinity-matched</h3><p>Neoprene and seam sealing are matched to the salinity of the coastline the suit is tested on.</p></div>
      <div class="tech-card"><h3>Temperature-mapped</h3><p>Panel thickness follows real sea temperature logs, not a single "cold water" rating.</p></div>
      <div class="tech-card"><h3>Swell tested</h3><p>Every suit is surfed and swum through a full tide cycle before it's approved for release.</p></div>
    </div>
  </section>

  <section class="stats">
    <div class="reveal"><div class="stat-num" data-count="14">0</div><div class="stat-label">°C rated minimum</div></div>
    <div class="reveal"><div class="stat-num" data-count="3">0</div><div class="stat-label">Coastlines tested against</div></div>
    <div class="reveal"><div class="stat-num" data-count="500">0</div><div class="stat-label">Hours of sea time logged</div></div>
  </section>

  <section class="newsletter">
    <div class="newsletter-inner">
      <h2>Join the tide list</h2>
      <p>Swell reports, early access, and the occasional discount.</p>
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
    <div class="footer-brand"><a href="#top" class="logo">Tide</a><p>Swim and surf layers, coast-tested.</p></div>
    <div class="footer-col"><h4>Shop</h4><a href="#shop">Bestsellers</a><a href="#shop">New arrivals</a><a href="#shop">Accessories</a></div>
    <div class="footer-col"><h4>Support</h4><a href="#">FAQ</a><a href="#">Contact</a><a href="#">Fit guide</a></div>
  </div>
  <div class="footer-bottom"><p>© <span id="year"></span> Tide. All rights reserved.</p></div>
</footer>

<div class="toast" id="toast"></div>
    </body>
</html>
`;
