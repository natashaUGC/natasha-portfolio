/**
 * NE Studio — Natasha Esparza · Portfolio
 *
 * SECURITY NOTES
 * - No innerHTML / outerHTML / document.write / eval / new Function anywhere.
 * - No data from the URL (search params, hash) is ever read or rendered.
 * - No localStorage/sessionStorage/cookies are used — nothing to protect.
 * - No third-party scripts, no network requests, no external DOM sources.
 * - All external links carry rel="noopener noreferrer" (set in HTML).
 */
(function () {
  'use strict';

  // Flag JS as available so CSS can safely apply the reveal-on-scroll
  // animation only when JS can actually drive it (progressive enhancement).
  document.documentElement.classList.add('js-enabled');

  /* ---------------------------------------------------------
     Footer year — computed value only, no user input involved.
  --------------------------------------------------------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------
     Mobile navigation toggle
  --------------------------------------------------------- */
  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');

  function closeNav() {
    if (!navToggle || !nav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      nav.classList.toggle('is-open', !isOpen);
    });

    // Close the menu after choosing a link, and on Escape.
    nav.querySelectorAll('[data-nav-link]').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });
  }

  /* ---------------------------------------------------------
     Sticky header state on scroll
  --------------------------------------------------------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
     Scroll reveal via IntersectionObserver.
     Respects prefers-reduced-motion by revealing everything
     immediately instead of animating it in.
  --------------------------------------------------------- */
  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }
})();
