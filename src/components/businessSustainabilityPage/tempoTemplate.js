export const tempoTemplate = (dynamic) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TEMPO — Built for the split</title>
<meta name="description" content="TEMPO engineers running apparel around pace, not just fabric — compression mapped to stride mechanics.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{
  --track:#b3432e; --track-dim:#8f3524;
  --ink:#14140f; --ink-soft:#5c5b52;
  --chalk:#f2f0e6; --chalk-dim:#e4e1d3;
  --slate:#4a4a42; --line:#d8d5c6;
  --display:'Big Shoulders Display',sans-serif;
  --body:'Inter',-apple-system,sans-serif;
  --mono:'JetBrains Mono',monospace;
  --max:1240px; --pad:clamp(20px,5vw,64px);
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;background:var(--chalk);color:var(--ink);font-family:var(--body);line-height:1.5;-webkit-font-smoothing:antialiased;}
a{color:inherit;text-decoration:none;}
ul{list-style:none;margin:0;padding:0;}
button{font-family:inherit;cursor:pointer;}
h1,h2,h3{font-family:var(--display);margin:0;text-transform:uppercase;letter-spacing:.01em;}
@media (prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;transition-duration:.001ms!important;}}
:focus-visible{outline:2px solid var(--track);outline-offset:3px;}

.announce{background:var(--ink);color:var(--chalk);font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;text-align:center;padding:8px 12px;}

.site-header{position:sticky;top:0;z-index:100;background:rgba(242,240,230,.92);backdrop-filter:blur(8px);border-bottom:2px solid var(--ink);}
.header-inner{max-width:var(--max);margin:0 auto;padding:16px var(--pad);display:flex;align-items:center;gap:24px;}
.logo{font-family:var(--display);font-weight:900;font-size:26px;letter-spacing:.02em;margin-right:auto;}
.main-nav{display:flex;gap:28px;margin-right:auto;}
.main-nav a{font-size:12.5px;letter-spacing:.05em;text-transform:uppercase;font-family:var(--mono);}
.main-nav a:hover{color:var(--track);}
.header-actions{display:flex;gap:14px;align-items:center;}
.icon-btn{background:none;border:none;color:var(--ink);padding:6px;position:relative;display:flex;}
.cart-count{position:absolute;top:-2px;right:-2px;background:var(--track);color:var(--chalk);font-family:var(--mono);font-size:9px;width:15px;height:15px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.nav-toggle{display:none;flex-direction:column;gap:4px;background:none;border:none;padding:6px;}
.nav-toggle span{width:20px;height:2px;background:var(--ink);}

.hero{position:relative;min-height:92vh;display:flex;align-items:center;background:var(--ink);color:var(--chalk);overflow:hidden;padding:110px var(--pad) 60px;}
.lane-lines{position:absolute;inset:0;z-index:0;opacity:.5;}
.hero-content{position:relative;z-index:1;max-width:var(--max);margin:0 auto;width:100%;}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--track);margin:0 0 16px;}
.hero h1{font-size:clamp(64px,11vw,148px);line-height:.86;font-weight:900;margin:0 0 8px;}
.hero h1 span{color:var(--track);}
.hero-sub{font-size:16.5px;color:#c9c7ba;max-width:460px;margin:24px 0 36px;}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap;}
.btn{display:inline-block;padding:14px 28px;font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;transition:transform .2s ease;}
.btn-solid{background:var(--track);color:var(--chalk);}
.btn-solid:hover{background:var(--chalk);color:var(--ink);}
.btn-outline{border:1px solid rgba(242,240,230,.4);color:var(--chalk);}
.btn-outline:hover{border-color:var(--chalk);}

.split-ticker{position:absolute;bottom:0;right:0;font-family:var(--mono);font-size:13px;color:var(--track);z-index:1;padding:16px var(--pad);letter-spacing:.05em;}

.intro{max-width:840px;margin:0 auto;padding:100px var(--pad) 80px;}
.intro-eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--track);margin:0 0 20px;}
.intro h2{font-size:clamp(30px,4.4vw,46px);line-height:1.05;margin:0 0 22px;}
.intro-body{font-family:var(--body);font-size:16.5px;color:var(--ink-soft);max-width:600px;text-transform:none;}

.shop{max-width:var(--max);margin:0 auto;padding:20px var(--pad) 100px;}
.section-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:32px;border-bottom:2px solid var(--ink);padding-bottom:16px;}
.section-head h2{font-size:clamp(26px,3.4vw,36px);}
.text-link{font-family:var(--mono);font-size:12px;text-transform:uppercase;border-bottom:1px solid var(--ink);padding-bottom:2px;}
.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
@media (max-width:980px){.product-grid{grid-template-columns:repeat(2,1fr);}}
@media (max-width:560px){.product-grid{grid-template-columns:1fr;}}
.product-card{background:var(--chalk-dim);border:1px solid var(--line);transition:transform .2s ease;}
.product-card:hover{transform:translateY(-4px);}
.product-visual{aspect-ratio:4/5;background:linear-gradient(155deg,#e4e1d3,#cfcbb8);position:relative;}
.product-visual svg{position:absolute;inset:0;width:100%;height:100%;}
.product-info{padding:16px 16px 18px;}
.product-info h3{font-family:var(--body);text-transform:none;font-size:15px;font-weight:500;letter-spacing:0;}
.product-fibre{font-family:var(--mono);font-size:11px;color:var(--ink-soft);margin:4px 0 0;}
.product-row{display:flex;justify-content:space-between;align-items:center;margin-top:10px;}
.price{font-family:var(--mono);font-size:13.5px;}
.btn-add{background:var(--ink);color:var(--chalk);border:none;padding:8px 14px;font-family:var(--mono);font-size:10.5px;text-transform:uppercase;}
.btn-add:hover{background:var(--track);}

.marquee{background:var(--track);color:var(--chalk);overflow:hidden;padding:12px 0;border-top:2px solid var(--ink);border-bottom:2px solid var(--ink);}
.marquee-track{display:flex;width:max-content;animation:scroll-m 26s linear infinite;}
.marquee-track span{font-family:var(--mono);font-size:12.5px;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;}
@keyframes scroll-m{from{transform:translateX(0);}to{transform:translateX(-50%);}}

.tech{background:var(--ink);color:var(--chalk);padding:100px var(--pad);}
.tech-head{max-width:var(--max);margin:0 auto 50px;text-align:center;}
.tech-head .intro-eyebrow{color:var(--track);}
.tech-head h2{font-size:clamp(30px,4.4vw,46px);}
.pace-chart{max-width:820px;margin:0 auto 70px;height:200px;}
.tech-grid{max-width:var(--max);margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(242,240,230,.15);}
@media (max-width:820px){.tech-grid{grid-template-columns:1fr;}}
.tech-card{background:var(--ink);padding:32px 26px;}
.tech-card h3{font-family:var(--body);text-transform:none;font-size:18px;font-weight:500;letter-spacing:0;margin-bottom:10px;}
.tech-card p{color:#b7b4a5;font-size:14px;line-height:1.6;margin:0;}

.stats{max-width:var(--max);margin:0 auto;padding:100px var(--pad);display:grid;grid-template-columns:repeat(3,1fr);gap:30px;text-align:center;}
@media (max-width:760px){.stats{grid-template-columns:1fr;}}
.stat-num{font-family:var(--display);font-size:clamp(48px,7vw,80px);font-weight:900;color:var(--track);line-height:1;}
.stat-label{font-family:var(--mono);font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-soft);margin-top:8px;}

.newsletter{padding:100px var(--pad);text-align:center;background:var(--chalk-dim);}
.newsletter-inner{max-width:460px;margin:0 auto;}
.newsletter h2{font-size:clamp(28px,4vw,40px);margin-bottom:10px;}
.newsletter p{color:var(--ink-soft);margin-bottom:26px;font-family:var(--body);}
.newsletter-form{display:flex;gap:10px;}
.newsletter-form input{flex:1;padding:13px 16px;border:1px solid var(--ink);background:var(--chalk);font-family:var(--body);font-size:14px;}
.newsletter-form button{padding:13px 22px;background:var(--ink);color:var(--chalk);border:none;font-family:var(--mono);font-size:11px;text-transform:uppercase;}
.newsletter-form button:hover{background:var(--track);}
@media (max-width:480px){.newsletter-form{flex-direction:column;}}
.newsletter-note{font-family:var(--mono);font-size:12px;color:var(--track);margin-top:12px;min-height:1em;}

.site-footer{background:var(--ink);color:#b7b4a5;padding:70px var(--pad) 28px;}
.footer-top{max-width:var(--max);margin:0 auto;display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:36px;padding-bottom:44px;border-bottom:1px solid rgba(242,240,230,.12);}
@media (max-width:700px){.footer-top{grid-template-columns:1fr 1fr;}}
.footer-brand .logo{color:var(--chalk);}
.footer-brand p{margin-top:10px;font-size:13px;font-family:var(--body);}
.footer-col h4{font-family:var(--mono);font-size:11px;text-transform:uppercase;color:var(--chalk);margin:0 0 14px;}
.footer-col{display:flex;flex-direction:column;gap:9px;font-size:13px;}
.footer-bottom{max-width:var(--max);margin:0 auto;display:flex;justify-content:space-between;padding-top:20px;font-size:12px;flex-wrap:wrap;gap:12px;}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--ink);color:var(--chalk);padding:12px 20px;font-family:var(--mono);font-size:12.5px;opacity:0;pointer-events:none;transition:all .3s ease;z-index:200;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.reveal{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease;}
.reveal.in{opacity:1;transform:translateY(0);}
@media (max-width:860px){
  .nav-toggle{display:flex;order:-1;}
  .main-nav{position:fixed;inset:0 0 0 auto;top:0;height:100vh;width:78%;max-width:300px;background:var(--ink);flex-direction:column;padding:100px 30px 30px;gap:24px;transform:translateX(100%);transition:transform .3s ease;z-index:99;}
  .main-nav.open{transform:translateX(0);}
  .main-nav a{color:var(--chalk);font-size:15px;}
  .logo{margin:0 auto;}
}
</style>
</head>
<body>

<div class="announce">Free shipping on orders over €90 — race day drop live now</div>

<header class="site-header" id="siteHeader">
  <div class="header-inner">
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <a href="#top" class="logo">TEMPO</a>
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
    <svg class="lane-lines" id="laneLines" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice"></svg>
    <div class="hero-content">
      <p class="eyebrow">The Split Series</p>
      <h1>Run your<br><span>own</span> pace</h1>
      <p class="hero-sub">Compression mapped to stride mechanics, not a generic size chart. TEMPO builds each panel around where your body actually works during a run.</p>
      <div class="hero-cta">
        <a href="#shop" class="btn btn-solid">Shop the collection</a>
        <a href="#technology" class="btn btn-outline">See the mapping</a>
      </div>
    </div>
    <div class="split-ticker" id="splitTicker">SPLIT 00:00</div>
  </section>

  <section class="intro">
    <p class="intro-eyebrow">01 — Why stride mapping</p>
    <h2 style="text-transform:none;">Generic compression squeezes everywhere equally. Your stride doesn't work that way — so your gear shouldn't either.</h2>
    <p class="intro-body">Every TEMPO garment is panel-mapped from motion-capture data across thousands of strides, concentrating support at the calf, quad and lower back exactly where load peaks mid-gait.</p>
  </section>

  <section class="shop" id="shop">
    <div class="section-head"><h2>Race Day Essentials</h2><a href="#" class="text-link">View all →</a></div>
    <div class="product-grid">
      <article class="product-card"><div class="product-visual" data-garment="singlet"></div><div class="product-info"><h3>Split Singlet</h3><p class="product-fibre">Panel-mapped · 92g</p><div class="product-row"><span class="price">€68</span><button class="btn-add" data-name="Split Singlet" data-price="68">Add</button></div></div></article>
      <article class="product-card"><div class="product-visual" data-garment="shorts"></div><div class="product-info"><h3>2-in-1 Shorts</h3><p class="product-fibre">Panel-mapped · 5in</p><div class="product-row"><span class="price">€58</span><button class="btn-add" data-name="2-in-1 Shorts" data-price="58">Add</button></div></div></article>
      <article class="product-card"><div class="product-visual" data-garment="tights"></div><div class="product-info"><h3>Calf-Zone Tights</h3><p class="product-fibre">Graduated compression</p><div class="product-row"><span class="price">€92</span><button class="btn-add" data-name="Calf-Zone Tights" data-price="92">Add</button></div></div></article>
      <article class="product-card"><div class="product-visual" data-garment="jacket"></div><div class="product-info"><h3>Tempo Wind Shell</h3><p class="product-fibre">68g · packable</p><div class="product-row"><span class="price">€145</span><button class="btn-add" data-name="Tempo Wind Shell" data-price="145">Add</button></div></div></article>
    </div>
  </section>

  <div class="marquee"><div class="marquee-track" id="marqueeTrack"></div></div>

  <section class="tech" id="technology">
    <div class="tech-head"><p class="intro-eyebrow">02 — Stride Mapping System</p><h2>Built from data, not a size chart</h2></div>
    <div class="pace-chart" id="paceChart"></div>
    <div class="tech-grid">
      <div class="tech-card"><h3>Motion-captured fit</h3><p>Panel lines follow real stride data across pace ranges, not a flat body scan.</p></div>
      <div class="tech-card"><h3>Zonal compression</h3><p>Graduated support concentrated where load peaks — calf, quad, lower back — and open elsewhere for airflow.</p></div>
      <div class="tech-card"><h3>Tested at pace</h3><p>Every prototype is run-tested across 5K to marathon effort before it ships.</p></div>
    </div>
  </section>

  <section class="stats">
    <div class="reveal"><div class="stat-num" data-count="34">0</div><div class="stat-label">% less chafe reported</div></div>
    <div class="reveal"><div class="stat-num" data-count="92">0</div><div class="stat-label">Gram race singlet</div></div>
    <div class="reveal"><div class="stat-num" data-count="6">0</div><div class="stat-label">Stride zones mapped</div></div>
  </section>

  <section class="newsletter">
    <div class="newsletter-inner">
      <h2>Get on the list</h2>
      <p>Drop alerts, pace research and early access — no spam, ever.</p>
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
    <div class="footer-brand"><a href="#top" class="logo">TEMPO</a><p>Running apparel, mapped to stride.</p></div>
    <div class="footer-col"><h4>Shop</h4><a href="#shop">Bestsellers</a><a href="#shop">New arrivals</a><a href="#shop">Accessories</a></div>
    <div class="footer-col"><h4>Support</h4><a href="#">FAQ</a><a href="#">Contact</a><a href="#">Fit guide</a></div>
  </div>
  <div class="footer-bottom"><p>© <span id="year"></span> TEMPO. All rights reserved.</p></div>
</footer>

<div class="toast" id="toast"></div>
    </body>
</html>
`;
