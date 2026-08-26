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
     Hero name — split into per-letter <span> elements so each
     letter can animate in with a staggered delay.
     Built entirely with createElement/textContent — no innerHTML.
  --------------------------------------------------------- */
  var prefersReducedMotionEarly = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (!prefersReducedMotionEarly) {
    document.querySelectorAll('[data-split-target]').forEach(function (line, lineIndex) {
      var text = line.textContent;
      // Clear the line, then rebuild it out of individual letter spans.
      while (line.firstChild) line.removeChild(line.firstChild);

      // Offset each subsequent line so the cascade reads top-to-bottom
      // instead of every line animating in unison.
      var lineOffset = lineIndex * (text.length + 3);

      text.split('').forEach(function (char, charIndex) {
        var span = document.createElement('span');
        span.className = 'letter';
        span.style.setProperty('--i', String(lineOffset + charIndex));
        span.textContent = char === ' ' ? '\u00A0' : char;
        line.appendChild(span);
      });
    });
  }

  /* ---------------------------------------------------------
     Tilt effect — subtle 3D rotation following the pointer.
     Skipped entirely for touch input and reduced-motion users.
  --------------------------------------------------------- */
  var supportsHover = window.matchMedia('(hover: hover)').matches;

  if (!prefersReducedMotionEarly && supportsHover) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var strength = Number(el.getAttribute('data-tilt-strength')) || 10;

      el.addEventListener('pointermove', function (event) {
        var rect = el.getBoundingClientRect();
        var px = (event.clientX - rect.left) / rect.width - 0.5;
        var py = (event.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty('--ry', (px * strength).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-py * strength).toFixed(2) + 'deg');
      });

      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------------------------------------------------------
     Magnetic buttons — nudge toward the pointer on hover.
  --------------------------------------------------------- */
  if (!prefersReducedMotionEarly && supportsHover) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (event) {
        var rect = el.getBoundingClientRect();
        var mx = (event.clientX - rect.left - rect.width / 2) * 0.25;
        var my = (event.clientY - rect.top - rect.height / 2) * 0.25;
        el.style.setProperty('--mx', mx.toFixed(1) + 'px');
        el.style.setProperty('--my', my.toFixed(1) + 'px');
      });

      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--mx', '0px');
        el.style.setProperty('--my', '0px');
      });
    });
  }

  /* ---------------------------------------------------------
     Scroll reveal via IntersectionObserver.
     Respects prefers-reduced-motion by revealing everything
     immediately instead of animating it in.
  --------------------------------------------------------- */
  var prefersReducedMotion = prefersReducedMotionEarly;
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
