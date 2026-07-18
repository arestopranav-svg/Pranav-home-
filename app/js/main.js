/* ============================================================
   PRANAV COSMIC & UNIVERSE EXPLORE — main.js
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Page fade-in ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    requestAnimationFrame(function () {
      document.body.classList.add("page-loaded");
    });
  });
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) document.body.classList.add("page-loaded");
  });

  /* ---------- Smooth page transitions ---------- */
  var veil = document.createElement("div");
  veil.className = "veil";
  document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(veil);
    document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var url = link.getAttribute("href");
        var current = location.pathname.split("/").pop() || "index.html";
        var targetPage = url.split("#")[0];
        var targetHash = url.includes("#") ? url.split("#")[1] : null;
        if (targetPage === current && targetHash) return; // let native anchor scroll work
        e.preventDefault();
        veil.classList.add("on");
        document.body.classList.add("page-leaving");
        setTimeout(function () { location.href = url; }, 300);
      });
    });
  });

  /* ---------- Navbar scroll state ---------- */
  var navbar = document.querySelector(".navbar");
  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open);
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        toggle.classList.remove("open");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        cio.unobserve(el);
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "+";
        var dur = 1600, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + (p === 1 ? suffix : "");
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Hero particles ---------- */
  var canvas = document.getElementById("particles");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var W, H, particles = [], mouse = { x: -9999, y: -9999 };
    var COUNT = window.innerWidth < 700 ? 40 : 85;

    function resize() {
      W = canvas.width = canvas.offsetWidth * devicePixelRatio;
      H = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function make() {
      particles = [];
      for (var i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random(), y: Math.random(),
          r: Math.random() * 2.2 + 0.6,
          vx: (Math.random() - 0.5) * 0.00045,
          vy: (Math.random() - 0.5) * 0.00045,
          a: Math.random() * 0.55 + 0.18,
          tw: Math.random() * Math.PI * 2,
          tws: Math.random() * 0.02 + 0.006
        });
      }
    }
    canvas.parentElement.addEventListener("mousemove", function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
    });
    canvas.parentElement.addEventListener("mouseleave", function () { mouse.x = mouse.y = -9999; });

    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy; p.tw += p.tws;
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.09 && d > 0.0001) { p.x += (dx / d) * 0.0018; p.y += (dy / d) * 0.0018; }
        if (p.x < -0.02) p.x = 1.02; if (p.x > 1.02) p.x = -0.02;
        if (p.y < -0.02) p.y = 1.02; if (p.y > 1.02) p.y = -0.02;
        var alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(33, 212, 232," + alpha.toFixed(3) + ")";
        ctx.shadowColor = "rgba(33, 212, 232, 0.8)";
        ctx.shadowBlur = 8 * devicePixelRatio;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      requestAnimationFrame(tick);
    }
    resize(); make(); tick();
    window.addEventListener("resize", function () { resize(); make(); });
  }

  /* ---------- Universe detail switcher ---------- */
  var uniCards = document.querySelectorAll("[data-uni]");
  var uniDetail = document.getElementById("uni-detail");
  if (uniCards.length && uniDetail && window.UNIVERSE_DATA) {
    var udTitle = document.getElementById("ud-title");
    var udDesc = document.getElementById("ud-desc");
    var udFacts = document.getElementById("ud-facts");
    var udArt = document.getElementById("ud-art");
    function setUni(key, scroll) {
      var d = window.UNIVERSE_DATA[key];
      if (!d) return;
      uniCards.forEach(function (c) { c.classList.toggle("active", c.getAttribute("data-uni") === key); });
      udTitle.textContent = d.title;
      udDesc.innerHTML = d.desc;
      udFacts.innerHTML = d.facts.map(function (f) {
        return '<div class="uni-fact"><strong>' + f[0] + "</strong><span>" + f[1] + "</span></div>";
      }).join("");
      udArt.className = "uni-art-full cosmic-art " + d.art;
      if (scroll) uniDetail.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    uniCards.forEach(function (card) {
      card.addEventListener("click", function () { setUni(card.getAttribute("data-uni"), true); });
    });
    setUni("galaxies", false);
  }

  /* ---------- Gallery filter ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var masonryItems = document.querySelectorAll(".masonry-item");
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-filter");
        masonryItems.forEach(function (item) {
          var show = cat === "all" || item.getAttribute("data-cat") === cat;
          item.classList.toggle("hide", !show);
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox && masonryItems.length) {
    var lbArt = lightbox.querySelector(".lb-art");
    var lbTitle = lightbox.querySelector(".lb-cap h4");
    var lbCat = lightbox.querySelector(".lb-cap span");
    var visible = function () {
      return Array.prototype.filter.call(masonryItems, function (i) { return !i.classList.contains("hide"); });
    };
    var idx = 0;
    function openLb(item) {
      var list = visible();
      idx = list.indexOf(item);
      render(item);
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function render(item) {
      var art = item.querySelector(".masonry-art");
      lbArt.className = "lb-art cosmic-art " + art.getAttribute("data-art");
      lbTitle.textContent = item.querySelector("h4").textContent;
      lbCat.textContent = item.querySelector(".masonry-cap span").textContent;
    }
    function step(dir) {
      var list = visible();
      idx = (idx + dir + list.length) % list.length;
      render(list[idx]);
    }
    function closeLb() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    masonryItems.forEach(function (item) {
      item.addEventListener("click", function () { openLb(item); });
    });
    lightbox.querySelector(".lb-close").addEventListener("click", closeLb);
    lightbox.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); step(-1); });
    lightbox.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); step(1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  /* ---------- Toast ---------- */
  window.showToast = function (msg) {
    var old = document.querySelector(".toast");
    if (old) old.remove();
    var t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = '<span class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg></span>' + msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add("show"); }); });
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { t.remove(); }, 500);
    }, 3600);
  };

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#cf-name");
      var email = form.querySelector("#cf-email");
      var msg = form.querySelector("#cf-message");
      var ok = true;
      [name, email, msg].forEach(function (f) { f.classList.remove("error"); });
      if (!name.value.trim()) { name.classList.add("error"); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add("error"); ok = false; }
      if (!msg.value.trim()) { msg.classList.add("error"); ok = false; }
      if (!ok) { showToast("Please fill in all fields correctly."); return; }
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.innerHTML = "Sending…";
      btn.disabled = true;
      setTimeout(function () {
        btn.innerHTML = original;
        btn.disabled = false;
        form.reset();
        showToast("Message sent — welcome aboard the cosmic journey!");
      }, 1100);
    });
  }
})();
