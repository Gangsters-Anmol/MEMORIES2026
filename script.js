/**
 * script.js — Class Memories Website
 * Original engine + Meet the Family SPA system
 */

/* ============================================================
   1. DATA — All members in one place. Edit here to update.
   ============================================================ */
const FAMILY_DATA = {
  boys: {
    label: "Boys",
    eyebrow: "Know about",
    color: [210, 85, 72],   // HSL for fog tint
    members: [
      { name: "Aditya Puspjivi",  photo: "images/boys/aditya.jpg",    quote: "The journey shaped us more than the destination.", details: { Role: "Student", Class: "2025-26" } },
      { name: "Amit Dubay",       photo: "images/boys/amit.jpg",       quote: "Every day was a new adventure waiting to happen.",   details: { Role: "Student", Class: "2025-26" } },
      { name: "Abhinav Singh",    photo: "images/boys/abhinav.jpg",    quote: "Memories are the only things that grow richer over time.", details: { Role: "Student", Class: "2025-26" } },
      { name: "Ankush Panday",    photo: "images/boys/ankush.jpg",     quote: "We didn't just study — we lived.", details: { Role: "Student", Class: "2025-26" } },
      { name: "Ankit Yadav",      photo: "images/boys/ankit.jpg",      quote: "The best chapters of life are written with friends.", details: { Role: "Student", Class: "2025-26" } },
      { name: "Aryan Dubay",      photo: "images/boys/aryan.jpg",      quote: "Laughter was our secret language.",              details: { Role: "Student", Class: "2025-26" } },
      { name: "Adarsh Yadav",     photo: "images/boys/adarsh.jpg",     quote: "Every small moment was a big memory in disguise.", details: { Role: "Student", Class: "2025-26" } },
      { name: "Naman Dubay",      photo: "images/boys/naman.jpg",      quote: "We came as classmates, we leave as family.",    details: { Role: "Student", Class: "2025-26" } },
      { name: "Dipanshu Yadav",   photo: "images/boys/dipanshu.jpg",   quote: "Time flies, but memories stay forever.",        details: { Role: "Student", Class: "2025-26" } },
      { name: "Raghav Panday",    photo: "images/boys/raghav.jpg",     quote: "The halls echoed our laughter for years.",     details: { Role: "Student", Class: "2025-26" } },
      { name: "Shubham Yadav",    photo: "images/boys/shubham.jpg",    quote: "Growing up is inevitable; growing together is a gift.", details: { Role: "Student", Class: "2025-26" } },
      { name: "Harsh Panday",     photo: "images/boys/harsh.jpg",      quote: "Here's to the nights we won't forget.",        details: { Role: "Student", Class: "2025-26" } },
      { name: "Priyanshu Singh",  photo: "images/boys/priyanshu.jpg",  quote: "Every friend is a different world within us.", details: { Role: "Student", Class: "2025-26" } },
      { name: "Anmol Patel",      photo: "images/boys/anmol.jpg",      quote: "Made this page so we never forget who we were.", details: { Role: "Creator & Student", Class: "2025-26" } },
    ]
  },
  girls: {
    label: "Girls",
    eyebrow: "Know about",
    color: [340, 80, 75],
    members: Array.from({ length: 16 }, (_, i) => ({
      name: `Placeholder ${String.fromCharCode(65 + i)}`,
      photo: `images/girls/girl${i + 1}.jpg`,
      quote: "A memory worth keeping forever.",
      details: { Role: "Student", Class: "2025-26" }
    }))
  },
  teachers: {
    label: "Teachers",
    eyebrow: "Know about",
    color: [45, 85, 68],
    members: Array.from({ length: 6 }, (_, i) => ({
      name: `Teacher ${String.fromCharCode(65 + i)}`,
      photo: `images/teachers/teacher${i + 1}.jpg`,
      quote: "Teaching is the greatest act of optimism.",
      details: { Subject: "—", Experience: "—" }
    }))
  },
  school: {
    label: "School",
    eyebrow: "Know about",
    color: [155, 65, 58],
    members: Array.from({ length: 6 }, (_, i) => ({
      name: `Place / Fact ${i + 1}`,
      photo: `images/school/school${i + 1}.jpg`,
      quote: "These walls hold a thousand stories.",
      details: { Type: "—", Year: "—" }
    }))
  }
};

/* ============================================================
   2. FOG ENGINE — Reusable factory for any canvas element
   ============================================================ */
function createFogEngine(canvasEl, options = {}) {
  const ctx = canvasEl.getContext("2d");
  const {
    colorStops = [[196,62,84],[270,52,86],[18,68,88],[155,46,84],[330,48,88]],
    particleCount = 42,
    bright = false,       // true = vivid, saturated fog
    alphaScale = 1,
    interactive = false
  } = options;

  let W, H;
  function resize() {
    W = canvasEl.width  = canvasEl.offsetWidth;
    H = canvasEl.height = canvasEl.offsetHeight;
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvasEl);

  let colorT = 0;

  function lerpColor(a, b, t) {
    return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
  }

  function currentFogColor(alpha) {
    const total = colorStops.length;
    const scaled = colorT * total;
    const i = Math.floor(scaled) % total;
    const j = (i + 1) % total;
    const [h, s, l] = lerpColor(colorStops[i], colorStops[j], scaled - Math.floor(scaled));
    const sat = bright ? Math.min(s * 1.6, 100) : s;
    const lit = bright ? Math.min(l * 1.05, 95) : l;
    return `hsla(${h.toFixed(1)},${sat.toFixed(1)}%,${lit.toFixed(1)}%,${alpha})`;
  }

  function makeParticle() {
    return {
      x:     Math.random() * (W || 800),
      y:     Math.random() * (H || 600),
      r:     (bright ? 180 : 120) + Math.random() * 200,
      vx:    (Math.random() - 0.5) * (bright ? 0.3 : 0.22),
      vy:    (Math.random() - 0.5) * (bright ? 0.25 : 0.18),
      phase: Math.random() * Math.PI * 2,
      speed: 0.0004 + Math.random() * 0.0004,
      alpha: (bright ? 0.14 : 0.06) + Math.random() * (bright ? 0.18 : 0.10),
    };
  }

  const particles = Array.from({ length: particleCount }, makeParticle);

  let cursor = { x: -9999, y: -9999 };
  let disperseRadius = 0, dispersing = false, refillTimer = null;
  const DISPERSE_MAX = 160;

  function onPointerMove(e) {
    const rect = canvasEl.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    cursor.x = cx; cursor.y = cy;
    dispersing = true;
    clearTimeout(refillTimer);
    refillTimer = setTimeout(() => { dispersing = false; }, 2400);
  }

  if (interactive) {
    canvasEl.addEventListener("mousemove",  onPointerMove, { passive: true });
    canvasEl.addEventListener("touchmove",  onPointerMove, { passive: true });
  }

  let running = true;
  let lastTime = 0;

  function render(now) {
    if (!running) return;
    requestAnimationFrame(render);
    const dt = Math.min(now - lastTime, 50);
    lastTime = now;
    colorT = (colorT + dt * 0.000055) % 1;

    if (dispersing) disperseRadius = Math.min(disperseRadius + 18, DISPERSE_MAX);
    else            disperseRadius = Math.max(disperseRadius - 1.8, 0);

    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x >  W + p.r) p.x = -p.r;
      if (p.x < -p.r)     p.x =  W + p.r;
      if (p.y >  H + p.r) p.y = -p.r;
      if (p.y < -p.r)     p.y =  H + p.r;

      const bobX = Math.sin(now * p.speed + p.phase) * 18;
      const bobY = Math.cos(now * p.speed * 0.7 + p.phase) * 12;
      const dx = p.x + bobX, dy = p.y + bobY;

      let alphaMulti = alphaScale;
      if (disperseRadius > 0) {
        const dist = Math.hypot(dx - cursor.x, dy - cursor.y);
        if (dist < disperseRadius + p.r) {
          const inf = Math.max(0, 1 - dist / (disperseRadius + p.r * 0.5));
          alphaMulti *= (1 - inf * 0.97);
        }
      }
      if (alphaMulti < 0.01) return;

      const grad = ctx.createRadialGradient(dx, dy, 0, dx, dy, p.r);
      grad.addColorStop(0,   currentFogColor(p.alpha * alphaMulti));
      grad.addColorStop(0.5, currentFogColor(p.alpha * alphaMulti * 0.55));
      grad.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(dx, dy, p.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    // Vignette
    const vig = ctx.createRadialGradient(W*.5,H*.5,Math.min(W,H)*.22, W*.5,H*.5,Math.max(W,H)*.82);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, currentFogColor(bright ? 0.35 : 0.22));
    ctx.fillStyle = vig;
    ctx.fillRect(0,0,W,H);
  }

  requestAnimationFrame(render);
  return { stop: () => { running = false; ro.disconnect(); } };
}

/* ============================================================
   3. HERO FOG + ORIGINAL EFFECTS
   ============================================================ */
(function HeroFog() {
  const canvas = document.getElementById("fogCanvas");
  createFogEngine(canvas, { interactive: true });
})();

(function NavScroll() {
  const nav = document.getElementById("mainNav");
  function onScroll() { nav.classList.toggle("nav--scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

(function RevealObserver() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
})();

(function HeroParallax() {
  const heroBg = document.getElementById("heroBg");
  if (!heroBg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        heroBg.style.transform = `translateY(${window.scrollY * 0.18}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

(function SmoothAnchors() {
  const NAV_H = 72;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const t = document.querySelector(link.getAttribute("href"));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - NAV_H, behavior: "smooth" });
    });
  });
})();

/* ============================================================
   4. FAMILY SECTION — Vivid bright fog on section canvas
   ============================================================ */
(function FamilyFog() {
  const canvas = document.getElementById("familyFogCanvas");
  if (!canvas) return;
  createFogEngine(canvas, {
    bright: true,
    alphaScale: 1.3,
    particleCount: 55,
    colorStops: [
      [210, 100, 75],   // vivid sky
      [280,  95, 80],   // vivid violet
      [18,  100, 78],   // vivid peach
      [155,  85, 70],   // vivid mint
      [340,  90, 78],   // vivid rose
    ]
  });
})();

/* ============================================================
   5. FAMILY CATEGORY CARDS — Open Directory Overlay
   ============================================================ */
const dirOverlay    = document.getElementById("directoryOverlay");
const dirTitle      = document.getElementById("dirTitle");
const dirEyebrow    = document.getElementById("dirEyebrow");
const dirNameGrid   = document.getElementById("dirNameGrid");
const dirClose      = document.getElementById("dirClose");
const dirFogCanvas  = document.getElementById("dirFogCanvas");

let dirFogEngine    = null;
let currentCategory = null;

function openDirectory(categoryKey) {
  const cat = FAMILY_DATA[categoryKey];
  if (!cat) return;
  currentCategory = categoryKey;

  dirTitle.textContent   = cat.label;
  dirEyebrow.textContent = cat.eyebrow;

  // Build name grid
  dirNameGrid.innerHTML = "";
  cat.members.forEach((member, i) => {
    const btn = document.createElement("button");
    btn.className = "dir-name-btn";
    btn.style.setProperty("--ni", `${i * 0.04}s`);
    btn.innerHTML = `
      <span class="dir-name-btn__number">${String(i + 1).padStart(2, "0")}</span>
      <span class="dir-name-btn__name">${member.name}</span>
    `;
    btn.addEventListener("click", () => openProfile(categoryKey, i));
    dirNameGrid.appendChild(btn);
  });

  // Show overlay
  dirOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => { dirOverlay.removeAttribute("hidden"); dirOverlay.hidden = false; });

  // Start vivid fog with category tint
  if (dirFogEngine) dirFogEngine.stop();
  const [h, s, l] = cat.color;
  dirFogEngine = createFogEngine(dirFogCanvas, {
    bright: true, alphaScale: 1.2, particleCount: 50,
    colorStops: [
      [h, s, l],
      [(h + 30) % 360, s * 0.85, l + 5],
      [(h + 60) % 360, s * 0.7,  l + 8],
      [(h - 30 + 360) % 360, s, l - 5],
    ]
  });

  // Resize canvas to match overlay
  setTimeout(() => {
    dirFogCanvas.style.width  = "100vw";
    dirFogCanvas.style.height = "100vh";
  }, 10);
}

function closeDirectory() {
  dirOverlay.hidden = true;
  document.body.style.overflow = "";
  if (dirFogEngine) { dirFogEngine.stop(); dirFogEngine = null; }
}

dirClose.addEventListener("click", closeDirectory);
dirOverlay.addEventListener("click", e => { if (e.target === dirOverlay) closeDirectory(); });

document.getElementById("familyCategories").addEventListener("click", e => {
  const card = e.target.closest(".family-cat-card");
  if (card) openDirectory(card.dataset.category);
});

/* ============================================================
   6. PROFILE OVERLAY — Show individual profile
   ============================================================ */
const profileOverlay  = document.getElementById("profileOverlay");
const profileName     = document.getElementById("profileName");
const profileCategory = document.getElementById("profileCategory");
const profileDetails  = document.getElementById("profileDetails");
const profileQuote    = document.getElementById("profileQuote");
const profileInitials = document.getElementById("profileInitials");
const profilePhoto    = document.getElementById("profilePhoto");
const profileGlow     = document.getElementById("profileGlow");
const profileFogCanvas = document.getElementById("profileFogCanvas");
const profileClose    = document.getElementById("profileClose");

let profileFogEngine = null;

function getInitials(name) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function openProfile(categoryKey, memberIndex) {
  const cat    = FAMILY_DATA[categoryKey];
  const member = cat.members[memberIndex];

  profileName.textContent     = member.name;
  profileCategory.textContent = `${cat.eyebrow} ${cat.label}`;
  profileInitials.textContent = getInitials(member.name);
  profileQuote.textContent    = member.quote;

  // Build details rows
  profileDetails.innerHTML = "";
  Object.entries(member.details).forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "profile-detail-row";
    row.innerHTML = `<span class="profile-detail-label">${label}</span><span class="profile-detail-value">${value}</span>`;
    profileDetails.appendChild(row);
  });

  // Photo
  profilePhoto.classList.remove("loaded");
  profilePhoto.src = "";
  const img = new Image();
  img.onload = () => {
    profilePhoto.src = img.src;
    profilePhoto.alt = member.name;
    setTimeout(() => profilePhoto.classList.add("loaded"), 10);
  };
  img.onerror = () => {};  // silently use placeholder
  img.src = member.photo;

  // Glow color based on category
  const [h, s, l] = cat.color;
  profileGlow.style.setProperty("--glow-color", `hsla(${h},${s}%,${l}%,0.35)`);

  // Show overlay
  profileOverlay.hidden = false;
  document.body.style.overflow = "hidden";

  // Start fog
  if (profileFogEngine) profileFogEngine.stop();
  profileFogEngine = createFogEngine(profileFogCanvas, {
    bright: true, alphaScale: 0.8, particleCount: 35,
    colorStops: [
      [h, s, l],
      [(h + 40) % 360, s * 0.8, l + 8],
      [(h - 40 + 360) % 360, s * 0.9, l - 5],
    ]
  });
  profileFogCanvas.style.width  = "100vw";
  profileFogCanvas.style.height = "100vh";
}

function closeProfile() {
  profileOverlay.hidden = true;
  document.body.style.overflow = "hidden"; // Keep overlay body lock (directory still open)
  if (profileFogEngine) { profileFogEngine.stop(); profileFogEngine = null; }
}

profileClose.addEventListener("click", closeProfile);
profileOverlay.addEventListener("click", e => { if (e.target === profileOverlay) closeProfile(); });

/* ============================================================
   7. KEYBOARD ESC — Close overlays
   ============================================================ */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (!profileOverlay.hidden) closeProfile();
    else if (!dirOverlay.hidden) closeDirectory();
  }
});