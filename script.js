/* ==========================================================================
   SK3TCH DOLL — script.js
   Builds the shared header/footer, wires up navigation + theme toggle,
   and powers the page-specific interactive bits (gallery filters,
   load more, scroll reveal animations).
   ========================================================================== */

/* ---------- Shared header & footer (keeps every page consistent) ---------- */
function renderHeader(activePage) {
  const nav = [
    { page: "index", href: "index.html", label: "Home" },
    { page: "gallery", href: "gallery.html", label: "Gallery" },
    { page: "about", href: "about.html", label: "About" },
    { page: "content", href: "content.html", label: "Links" },
  ];

  const links = nav
    .map(
      (item) =>
        `<a href="${item.href}" data-page="${item.page}"${
          item.page === activePage ? ' class="active" aria-current="page"' : ""
        }>${item.label}</a>`
    )
    .join("");

  return `
    <header class="site-header">
      <a href="index.html" class="brand">
        <img src="images/logo.png" alt="SK3TCH DOLL logo" class="brand-logo">
        <span class="brand-name">SK3TCH DOLL</span>
      </a>
      <nav class="main-nav" id="mainNav">${links}</nav>
      <div class="header-actions">
        <button class="icon-btn theme-toggle" id="themeToggle" aria-label="Toggle dark mode">🌙</button>
        <button class="icon-btn nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">☰</button>
      </div>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <p class="footer-brand">SK3TCH DOLL ♡</p>
      <p class="footer-copy">© <span id="year"></span> SK3TCH DOLL. All rights reserved.</p>
      <div class="footer-icons" aria-hidden="true">✦ ★ ♪ ✧</div>
    </footer>
  `;
}

function mountHeaderFooter() {
  const headerMount = document.getElementById("app-header");
  const footerMount = document.getElementById("app-footer");
  const activePage = document.body.dataset.page || "index";

  if (headerMount) headerMount.innerHTML = renderHeader(activePage);
  if (footerMount) footerMount.innerHTML = renderFooter();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Mobile nav toggle ---------- */
function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "✕" : "☰";
  });

  // Close the menu after a link is picked (mobile)
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }
  });
}

/* ---------- Theme (light/dark) toggle, persisted per visitor ---------- */
function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const saved = localStorage.getItem("sketchdoll-theme");
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    toggle.textContent = "☀️";
  }

  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("sketchdoll-theme", "light");
      toggle.textContent = "🌙";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("sketchdoll-theme", "dark");
      toggle.textContent = "☀️";
    }
  });
}

/* ---------- Scroll-reveal animation for cards/sections ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Gallery: category filters + load more ---------- */
function initGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const tabs = document.querySelectorAll(".filter-tabs button");
  const items = Array.from(grid.querySelectorAll(".gallery-item"));
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  const PAGE_SIZE = 8;
  let currentFilter = "all";
  let visibleCount = PAGE_SIZE;

  function applyView() {
    const matches = items.filter(
      (item) => currentFilter === "all" || item.dataset.category === currentFilter
    );

    items.forEach((item) => item.classList.add("hidden"));
    matches.forEach((item, index) => {
      if (index < visibleCount) item.classList.remove("hidden");
    });

    if (loadMoreBtn) {
      loadMoreBtn.style.display = matches.length > visibleCount ? "inline-flex" : "none";
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.dataset.filter;
      visibleCount = PAGE_SIZE;
      applyView();
    });
  });

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      visibleCount += PAGE_SIZE;
      applyView();
    });
  }

  applyView();
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  mountHeaderFooter();
  initNavToggle();
  initThemeToggle();
  initScrollReveal();
  initGallery();
});
