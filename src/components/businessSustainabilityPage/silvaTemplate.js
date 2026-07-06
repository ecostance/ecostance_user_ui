export const silvaTemplate = (dynamic) => `<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SILVA — Four fibres. One layer.</title>
<meta name="description" content="SILVA engineers base layers by blending merino wool with performance fibres at the yarn level. One garment, built from fibre up.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,450;0,9..144,600;1,9..144,450&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
/* =========================================================
   SILVA — design tokens
   Ink graphite / linen paper / deep moss / muted ochre gold
   ========================================================= */
:root{
  --ink: #12151a;
  --ink-soft: #565a52;
  --paper: #e7e6dd;
  --paper-raised: #f0efe8;
  --moss: #3f5748;
  --moss-dark: #2b3c32;
  --gold: #b9974d;
  --line: #c9c7ba;
  --line-dark: #2a2e28;
  --cream-text: #eeece2;

  --display: 'Fraunces', Georgia, serif;
  --body: 'Inter', -apple-system, sans-serif;
  --mono: 'JetBrains Mono', monospace;

  --max: 1240px;
  --pad: clamp(20px, 5vw, 64px);
  --radius: 2px;
}

*{ box-sizing:border-box; }
html{ scroll-behavior:smooth; }
body{
  margin:0;
  background:var(--paper);
  color:var(--ink);
  font-family:var(--body);
  font-size:16px;
  line-height:1.5;
  -webkit-font-smoothing:antialiased;
}
img{ max-width:100%; display:block; }
a{ color:inherit; text-decoration:none; }
ul{ list-style:none; margin:0; padding:0; }
button{ font-family:inherit; cursor:pointer; }
h1,h2,h3{ font-family:var(--display); font-weight:450; margin:0; }
@media (prefers-reduced-motion: reduce){
  *{ animation-duration:0.001ms !important; transition-duration:0.001ms !important; scroll-behavior:auto !important; }
}
:focus-visible{ outline:2px solid var(--gold); outline-offset:3px; }

/* =============== Announcement bar =============== */
.announce{
  background:var(--ink);
  color:var(--cream-text);
  font-family:var(--mono);
  font-size:11.5px;
  letter-spacing:.06em;
  text-transform:uppercase;
  text-align:center;
  padding:9px 12px;
}

/* =============== Header =============== */
.site-header{
  position:sticky; top:0; z-index:100;
  background:rgba(231,230,221,0.9);
  backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);
  transition:padding .25s ease;
}
.header-inner{
  max-width:var(--max); margin:0 auto; padding:18px var(--pad);
  display:flex; align-items:center; gap:24px;
}
.site-header.scrolled .header-inner{ padding-top:10px; padding-bottom:10px; }

.logo{
  font-family:var(--display);
  font-size:22px;
  letter-spacing:.03em;
  font-weight:600;
  margin-right:auto;
}
.main-nav{ display:flex; gap:32px; margin-right:auto; }
.main-nav a{
  font-size:13.5px; letter-spacing:.03em; text-transform:uppercase; font-family:var(--mono);
  position:relative; padding-bottom:2px;
}
.main-nav a::after{
  content:''; position:absolute; left:0; right:0; bottom:-2px; height:1px;
  background:var(--ink); transform:scaleX(0); transform-origin:left; transition:transform .25s ease;
}
.main-nav a:hover::after{ transform:scaleX(1); }

.header-actions{ display:flex; align-items:center; gap:14px; }
.icon-btn{
  background:none; border:none; color:var(--ink); padding:6px; position:relative;
  display:flex; align-items:center; justify-content:center;
}
.cart-count{
  position:absolute; top:-2px; right:-2px; background:var(--moss); color:var(--cream-text);
  font-family:var(--mono); font-size:9.5px; width:15px; height:15px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
}
.nav-toggle{
  display:none; flex-direction:column; gap:4px; background:none; border:none; padding:6px;
}
.nav-toggle span{ width:20px; height:1.5px; background:var(--ink); }

/* =============== Hero =============== */
.hero{
  position:relative;
  min-height:92vh;
  display:flex; align-items:center; justify-content:center;
  background:radial-gradient(120% 100% at 50% 0%, #1b2a20 0%, var(--ink) 60%);
  color:var(--cream-text);
  overflow:hidden;
  text-align:center;
  padding:120px var(--pad) 80px;
}
.hero-weave{
  position:absolute; inset:0; z-index:0; opacity:.55;
  display:flex; align-items:center; justify-content:center;
}
.hero-content{ position:relative; z-index:1; max-width:720px; }
.eyebrow{
  font-family:var(--mono); font-size:12px; letter-spacing:.14em; text-transform:uppercase;
  color:var(--gold); margin:0 0 18px;
}
.hero h1{
  font-size:clamp(48px, 8vw, 92px);
  line-height:.98;
  font-style:italic;
  font-weight:450;
  margin:0 0 24px;
}
.hero-sub{
  font-size:17px; line-height:1.65; color:#c9c8bd; max-width:520px; margin:0 auto 36px;
}
.hero-cta{ display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }

.btn{
  display:inline-block; padding:14px 28px; font-family:var(--mono); font-size:12.5px;
  letter-spacing:.08em; text-transform:uppercase; border-radius:var(--radius);
  transition:transform .2s ease, background .2s ease, color .2s ease;
  border:1px solid transparent;
}
.btn-light{ background:var(--cream-text); color:var(--ink); }
.btn-light:hover{ transform:translateY(-2px); background:#fff; }
.btn-ghost{ border-color:rgba(238,236,226,.4); color:var(--cream-text); }
.btn-ghost:hover{ border-color:var(--cream-text); }

.scroll-cue{
  position:absolute; bottom:28px; left:50%; transform:translateX(-50%);
  width:1px; height:52px; background:rgba(238,236,226,.35); z-index:1;
}
.scroll-cue span{
  position:absolute; top:0; left:-2px; width:5px; height:5px; border-radius:50%;
  background:var(--gold); animation:scrollcue 2.2s ease-in-out infinite;
}
@keyframes scrollcue{
  0%{ top:0; opacity:0; } 15%{ opacity:1; } 90%{ opacity:1; } 100%{ top:100%; opacity:0; }
}

/* =============== Intro =============== */
.intro{
  max-width:840px; margin:0 auto; padding:120px var(--pad) 90px; text-align:left;
}
.intro-eyebrow{
  font-family:var(--mono); font-size:12px; letter-spacing:.1em; text-transform:uppercase;
  color:var(--moss); margin:0 0 20px;
}
.intro h2{
  font-size:clamp(28px, 4vw, 40px); line-height:1.25; margin:0 0 24px; font-weight:450;
}
.intro h2 em{ font-style:italic; color:var(--moss); }
.intro-body{ font-size:16.5px; color:var(--ink-soft); max-width:600px; }

/* =============== Shop / product grid =============== */
.shop{ max-width:var(--max); margin:0 auto; padding:40px var(--pad) 100px; }
.section-head{
  display:flex; align-items:baseline; justify-content:space-between; margin-bottom:36px;
  border-bottom:1px solid var(--line); padding-bottom:18px;
}
.section-head h2{ font-size:clamp(24px, 3vw, 32px); }
.text-link{
  font-family:var(--mono); font-size:12.5px; text-transform:uppercase; letter-spacing:.05em;
  border-bottom:1px solid var(--ink); padding-bottom:2px;
}

.product-grid{
  display:grid; grid-template-columns:repeat(4, 1fr); gap:28px;
}
@media (max-width:980px){ .product-grid{ grid-template-columns:repeat(2,1fr); } }
@media (max-width:560px){ .product-grid{ grid-template-columns:1fr; } }

.product-card{
  background:var(--paper-raised); border:1px solid var(--line);
  display:flex; flex-direction:column; transition:transform .25s ease, box-shadow .25s ease;
}
.product-card:hover{ transform:translateY(-4px); box-shadow:0 14px 30px -18px rgba(20,20,15,.35); }

.product-visual{
  aspect-ratio:4/5;
  background:linear-gradient(155deg, #dedcce 0%, #cfcdbd 55%, #b8b6a4 100%);
  position:relative; overflow:hidden;
}
.product-visual::before{
  content:''; position:absolute; inset:0;
  background-image:
    repeating-linear-gradient(115deg, rgba(63,87,72,.10) 0 2px, transparent 2px 14px);
}
.product-visual svg{ position:absolute; inset:0; width:100%; height:100%; }

.product-info{ padding:18px 18px 20px; display:flex; flex-direction:column; gap:6px; }
.product-info h3{ font-size:16px; font-weight:500; font-family:var(--body); }
.product-fibre{ font-family:var(--mono); font-size:11.5px; color:var(--ink-soft); margin:0; }
.product-row{ display:flex; align-items:center; justify-content:space-between; margin-top:10px; }
.price{ font-family:var(--mono); font-size:14px; }
.btn-add{
  background:var(--ink); color:var(--cream-text); border:none; padding:8px 16px;
  font-family:var(--mono); font-size:11px; letter-spacing:.05em; text-transform:uppercase;
  transition:background .2s ease;
}
.btn-add:hover{ background:var(--moss); }

/* =============== Marquee =============== */
.marquee{
  background:var(--moss); color:var(--cream-text); overflow:hidden;
  border-top:1px solid var(--line-dark); border-bottom:1px solid var(--line-dark);
  padding:14px 0;
}
.marquee-track{ display:flex; width:max-content; animation:scroll-marquee 32s linear infinite; }
.marquee-track span{
  font-family:var(--mono); font-size:13px; letter-spacing:.05em; text-transform:uppercase;
  white-space:nowrap; padding-right:0;
}
@keyframes scroll-marquee{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }

/* =============== Technology / weave =============== */
.tech{ background:var(--ink); color:var(--cream-text); padding:110px var(--pad) 100px; }
.tech-head{ max-width:var(--max); margin:0 auto 60px; text-align:center; }
.tech .intro-eyebrow{ color:var(--gold); }
.tech-head h2{ font-size:clamp(30px,4vw,44px); font-style:italic; }

.weave-diagram{
  max-width:640px; margin:0 auto 80px; height:180px;
  display:flex; align-items:center; justify-content:center;
}

.tech-grid{
  max-width:var(--max); margin:0 auto; display:grid; grid-template-columns:repeat(3,1fr); gap:1px;
  background:rgba(238,236,226,.15);
}
@media (max-width:820px){ .tech-grid{ grid-template-columns:1fr; } }
.tech-card{ background:var(--ink); padding:36px 30px; }
.tech-card h3{ font-size:19px; font-weight:500; font-family:var(--body); margin-bottom:12px; }
.tech-card p{ color:#b7b6a9; font-size:14.5px; line-height:1.6; margin:0; }

/* =============== Stats =============== */
.stats{
  max-width:var(--max); margin:0 auto; padding:110px var(--pad);
  display:grid; grid-template-columns:.8fr 1.2fr; gap:60px; align-items:center;
}
@media (max-width:820px){ .stats{ grid-template-columns:1fr; } }

.stats-visual{ display:flex; align-items:center; justify-content:center; }
.stat-ring{
  width:220px; height:220px; border-radius:50%;
  background:conic-gradient(var(--moss) 0deg, var(--moss) calc(var(--pct,0) * 3.6deg), var(--line) calc(var(--pct,0) * 3.6deg));
  display:flex; align-items:center; justify-content:center;
  transition:background 1.4s ease;
}
.stat-ring::after{
  content:'strand-4'; width:160px; height:160px; border-radius:50%; background:var(--paper);
  display:flex; align-items:center; justify-content:center;
  font-family:var(--mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--ink-soft);
}
.stats-copy h2{ font-size:clamp(26px,3.4vw,36px); margin:16px 0 30px; }
.stat-list{ display:flex; flex-direction:column; gap:16px; margin-bottom:28px; }
.stat-list li{ display:flex; align-items:baseline; gap:6px; border-bottom:1px solid var(--line); padding-bottom:14px; }
.stat-num{ font-family:var(--display); font-size:34px; font-weight:600; color:var(--moss); }
.stat-suffix{ font-family:var(--display); font-size:22px; color:var(--moss); }
.stat-label{ font-size:14px; color:var(--ink-soft); margin-left:8px; }

/* =============== Collections =============== */
.collections{ max-width:var(--max); margin:0 auto; padding:20px var(--pad) 110px; }
.collection-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
@media (max-width:900px){ .collection-grid{ grid-template-columns:repeat(2,1fr); } }
.collection-tile{
  position:relative; aspect-ratio:3/4; display:flex; align-items:flex-end; padding:22px;
  overflow:hidden; isolation:isolate;
}
.collection-tile::before{
  content:''; position:absolute; inset:0; z-index:-1;
}
.collection-tile[data-tone="a"]::before{ background:linear-gradient(160deg,#3f5748,#26332a); }
.collection-tile[data-tone="b"]::before{ background:linear-gradient(160deg,#22262b,#12151a); }
.collection-tile[data-tone="c"]::before{ background:linear-gradient(160deg,#cfcdbd,#a9a793); }
.collection-tile[data-tone="d"]::before{ background:linear-gradient(160deg,#b9974d,#8a723a); }
.collection-tile[data-tone="c"] .tile-label{ color:var(--ink); }
.tile-label{
  font-family:var(--mono); font-size:13px; letter-spacing:.05em; text-transform:uppercase;
  color:var(--cream-text); border-bottom:1px solid currentColor; padding-bottom:3px;
}

/* =============== Traceability band =============== */
.traceability{
  background:var(--moss-dark); color:var(--cream-text); padding:110px var(--pad);
  text-align:center;
}
.trace-inner{ max-width:640px; margin:0 auto; }
.traceability .intro-eyebrow{ color:var(--gold); }
.traceability h2{ font-size:clamp(26px,3.6vw,38px); margin:14px 0 34px; line-height:1.3; }

/* =============== Newsletter =============== */
.newsletter{ padding:110px var(--pad); text-align:center; }
.newsletter-inner{ max-width:460px; margin:0 auto; }
.newsletter h2{ font-size:clamp(26px,3.4vw,34px); margin-bottom:12px; }
.newsletter p{ color:var(--ink-soft); margin-bottom:28px; }
.newsletter-form{ display:flex; gap:10px; }
.newsletter-form input{
  flex:1; padding:13px 16px; border:1px solid var(--line); background:var(--paper-raised);
  font-family:var(--body); font-size:14px; border-radius:var(--radius); color:var(--ink);
}
.newsletter-form input:focus{ outline:none; border-color:var(--moss); }
.newsletter-form button{
  padding:13px 22px; background:var(--ink); color:var(--cream-text); border:none;
  font-family:var(--mono); font-size:12px; text-transform:uppercase; letter-spacing:.06em;
}
.newsletter-form button:hover{ background:var(--moss); }
@media (max-width:480px){ .newsletter-form{ flex-direction:column; } }
.newsletter-note{ font-family:var(--mono); font-size:12px; color:var(--moss); margin-top:14px; min-height:1em; }

/* =============== Footer =============== */
.site-footer{ background:var(--ink); color:#b7b6a9; padding:80px var(--pad) 30px; }
.footer-top{
  max-width:var(--max); margin:0 auto; display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:40px;
  padding-bottom:50px; border-bottom:1px solid rgba(238,236,226,.12);
}
@media (max-width:760px){ .footer-top{ grid-template-columns:1fr 1fr; } }
.footer-brand .logo{ color:var(--cream-text); }
.footer-brand p{ margin-top:12px; font-size:13.5px; }
.footer-col h4{
  font-family:var(--mono); font-size:11.5px; text-transform:uppercase; letter-spacing:.06em;
  color:var(--cream-text); margin:0 0 16px; font-weight:500;
}
.footer-col{ display:flex; flex-direction:column; gap:10px; font-size:13.5px; }
.footer-col a:hover{ color:var(--cream-text); }
.footer-bottom{
  max-width:var(--max); margin:0 auto; display:flex; justify-content:space-between; align-items:center;
  padding-top:24px; font-size:12.5px; flex-wrap:wrap; gap:14px;
}
.footer-social{ display:flex; gap:16px; font-family:var(--mono); font-size:11.5px; }
.footer-social a:hover{ color:var(--cream-text); }

/* =============== Toast =============== */
.toast{
  position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(20px);
  background:var(--ink); color:var(--cream-text); padding:13px 22px; border-radius:var(--radius);
  font-family:var(--mono); font-size:13px; opacity:0; pointer-events:none; transition:all .3s ease;
  z-index:200;
}
.toast.show{ opacity:1; transform:translateX(-50%) translateY(0); }

/* =============== Reveal on scroll =============== */
.reveal{ opacity:0; transform:translateY(24px); transition:opacity .7s ease, transform .7s ease; }
.reveal.in{ opacity:1; transform:translateY(0); }

/* =============== Mobile nav =============== */
@media (max-width:860px){
  .nav-toggle{ display:flex; order:-1; }
  .main-nav{
    position:fixed; inset:0 0 0 auto; top:0; height:100vh; width:78%; max-width:320px;
    background:var(--ink); flex-direction:column; padding:100px 32px 32px; gap:26px;
    transform:translateX(100%); transition:transform .3s ease; z-index:99;
  }
  .main-nav.open{ transform:translateX(0); }
  .main-nav a{ color:var(--cream-text); font-size:16px; }
  .logo{ margin:0 auto; }
  .header-actions{ order:2; }
}

</style>
</head>
<body>

<div class="announce">Advance orders open — ships from September</div>

<header class="site-header" id="siteHeader">
  <div class="header-inner">
    <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <a href="#top" class="logo">SILVA</a>
    <nav class="main-nav" id="mainNav">
      <a href="#shop">Shop</a>
      <a href="#technology">Technology</a>
      <a href="#traceability">Journal</a>
      <a href="#about">About</a>
    </nav>
    <div class="header-actions">
      <button class="icon-btn" id="searchBtn" aria-label="Search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
      <button class="icon-btn cart-btn" id="cartBtn" aria-label="Cart">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.6"/></svg>
        <span class="cart-count" id="cartCount">0</span>
      </button>
    </div>
  </div>
</header>

<main id="top">

  <!-- HERO -->
  <section class="hero">
    <div class="hero-weave" id="heroWeave" aria-hidden="true"></div>
    <div class="hero-content">
      <p class="eyebrow">The Strand System</p>
      <h1 class="hero-sub">Four fibres.<br>One layer.</h1>
      <p class="hero-sub">Merino for warmth. Long-chain synthetics for recovery. Each fibre engineered into a single yarn, doing the job it was built for — not competing for space in the same garment.</p>
      <div class="hero-cta">
        <a href="#shop" class="btn btn-light">Shop the collection</a>
        <a href="#technology" class="btn btn-ghost">See the technology</a>
      </div>
    </div>
    <div class="scroll-cue" aria-hidden="true"><span></span></div>
  </section>

  <!-- INTRO COPY -->
  <section class="intro">
    <p class="intro-eyebrow">01 — The problem with base layers</p>
    <h2>Most base layers make you choose. Merino <em>or</em> synthetic. Comfort <em>or</em> durability. We stopped choosing.</h2>
    <p class="intro-body">The Strand System blends 17.5-micron merino with three engineered fibres at the yarn level, before the fabric is even knitted. The result behaves like one material because, structurally, it is one.</p>
  </section>

  <!-- PRODUCT GRID -->
  <section class="shop" id="shop">
    <div class="section-head">
      <h2>The Foundation Collection</h2>
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

  <!-- MARQUEE -->
  <div class="marquee">
    <div class="marquee-track">
      <span>Responsibly Sourced Merino &nbsp;—&nbsp; Low Carbon Footprint &nbsp;—&nbsp; Ethical Sourcing &nbsp;—&nbsp; Recyclable Packaging &nbsp;—&nbsp; Responsibly Sourced Merino &nbsp;—&nbsp; Low Carbon Footprint &nbsp;—&nbsp; Ethical Sourcing &nbsp;—&nbsp; Recyclable Packaging &nbsp;—&nbsp;</span>
      <span>Responsibly Sourced Merino &nbsp;—&nbsp; Low Carbon Footprint &nbsp;—&nbsp; Ethical Sourcing &nbsp;—&nbsp; Recyclable Packaging &nbsp;—&nbsp; Responsibly Sourced Merino &nbsp;—&nbsp; Low Carbon Footprint &nbsp;—&nbsp; Ethical Sourcing &nbsp;—&nbsp; Recyclable Packaging &nbsp;—&nbsp;</span>
    </div>
  </div>

  <!-- TECHNOLOGY / SIGNATURE WEAVE SECTION -->
  <section class="tech" id="technology">
    <div class="tech-head">
      <p class="intro-eyebrow">02 — Strand System</p>
      <h2 class="hero-sub">Performance is built, not assumed</h2>
    </div>

    <div class="weave-diagram" id="weaveDiagram">
      <!-- populated by JS: 4 strand SVG animation -->
    </div>

    <div class="tech-grid">
      <div class="tech-card">
        <h3 class="hero-sub">Engineered to last</h3>
        <p>Merino and engineered fibres are spun into one yarn before knitting — built for running, training and variable weather, not just a single condition.</p>
      </div>
      <div class="tech-card">
        <h3 class="hero-sub">Materials with evidence</h3>
        <p>Responsibly sourced merino and recycled synthetics, chosen for measured impact rather than a marketing claim.</p>
      </div>
      <div class="tech-card">
        <h3 class="hero-sub">Independently verified</h3>
        <p>Full carbon footprint per product, with provenance and climate data checked by an outside verification partner.</p>
      </div>
    </div>
  </section>

  <!-- STATS -->
  <section class="stats">
    <div class="stats-visual" aria-hidden="true">
      <div class="stat-ring" data-value="27"></div>
    </div>
    <div class="stats-copy">
      <p class="intro-eyebrow">Measured, not assumed</p>
      <h2>Engineered performance. Measured results.</h2>
      <ul class="stat-list">
        <li><span class="stat-num" data-count="27">0</span><span class="stat-suffix">%</span><span class="stat-label">faster moisture dispersion</span></li>
        <li><span class="stat-num" data-count="3">0</span><span class="stat-suffix">×</span><span class="stat-label">greater odour resistance</span></li>
        <li><span class="stat-num" data-count="41">0</span><span class="stat-suffix">%</span><span class="stat-label">reduced temperature variance</span></li>
      </ul>
      <a href="#" class="text-link">See the full data set →</a>
    </div>
  </section>

  <!-- COLLECTIONS -->
  <section class="collections">
    <div class="section-head">
      <h2>Shop by collection</h2>
    </div>
    <div class="collection-grid">
      <a href="#" class="collection-tile" data-tone="a">
        <span class="tile-label">Base Layers</span>
      </a>
      <a href="#" class="collection-tile" data-tone="b">
        <span class="tile-label">Shop Men</span>
      </a>
      <a href="#" class="collection-tile" data-tone="c">
        <span class="tile-label">Shop Women</span>
      </a>
      <a href="#" class="collection-tile" data-tone="d">
        <span class="tile-label">Underwear</span>
      </a>
    </div>
  </section>

  <!-- TRACEABILITY -->
  <section class="traceability" id="traceability">
    <div class="trace-inner">
      <p class="intro-eyebrow">Traceable by design</p>
      <h2>From farm to finished garment, every stage is documented and verifiable.</h2>
      <a href="#" class="btn btn-light">Access the digital passport</a>
    </div>
  </section>

  <!-- NEWSLETTER -->
  <section class="newsletter" id="about">
    <div class="newsletter-inner">
      <h2>Join the community</h2>
      <p>Fibre research, early access to new drops, and the occasional discount.</p>
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
    <div class="footer-brand">
      <a href="#top" class="logo">SILVA</a>
      <p>Base layers engineered fibre-first.</p>
    </div>
    <div class="footer-col">
      <h4>Our Story</h4>
      <a href="#about">About us</a>
      <a href="#technology">Technology</a>
      <a href="#">Journal</a>
    </div>
    <div class="footer-col">
      <h4>Support</h4>
      <a href="#">FAQ</a>
      <a href="#">Contact</a>
      <a href="#">Fit guide</a>
      <a href="#">Garment care</a>
    </div>
    <div class="footer-col">
      <h4>Shop</h4>
      <a href="#shop">Bestsellers</a>
      <a href="#shop">Men</a>
      <a href="#shop">Women</a>
      <a href="#shop">Accessories</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© <span id="year"></span> SILVA. All rights reserved.</p>
    <div class="footer-social">
      <a href="#" aria-label="Instagram">IG</a>
      <a href="#" aria-label="Twitter/X">X</a>
      <a href="#" aria-label="YouTube">YT</a>
      <a href="#" aria-label="TikTok">TT</a>
    </div>
  </div>
</footer>

<div class="toast" id="toast"></div>
</body>
</html>`
