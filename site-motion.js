/* ============================================================
   IRTONA SITE MOTION
   Scroll-Animationen, Fortschrittsbalken, aktive Seite in der
   Pillen-Navigation und weiche Seitenwechsel. Einbinden mit
   <script src="site-motion.js" defer></script> im <head>.
============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('m-js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  // Bereiche, die eigene Animationen haben, bleiben unangetastet
  var SKIP = '.vhero, .intro-loader, .mobile-overlay, .site-header, .sm-container, .tcols';
  function skipped(el) { return !!el.closest(SKIP); }

  /* ---------- Aktive Seite in der Pille markieren ---------- */
  function markActive() {
    // "/preise", "/preise.html" und "preise.html" gelten als dieselbe Seite
    function norm(p) { return (p.split('/').pop() || 'index').replace(/\.html$/, ''); }
    var path = norm(location.pathname);
    $all('.site-header .header-nav a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0];
      if (href && norm(href) === path && a.getAttribute('href').indexOf('#') === -1) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------- Überschriften in Wörter zerlegen ---------- */
  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var outer = document.createElement('span');
            outer.className = 'm-word';
            var inner = document.createElement('span');
            inner.style.setProperty('--i', i++);
            inner.textContent = p;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR' && child.tagName !== 'svg' && child.tagName !== 'SVG') {
          walk(child);
        }
      });
    })(el);
    el.setAttribute('data-m', 'words');
  }

  /* ---------- Elemente vorbereiten ---------- */
  function prepare() {
    var targets = [];

    // Überschriften
    $all('.section-heading, .page-hero-title, .thanks-card h1, .login-card h1')
      .forEach(function (h) {
        if (skipped(h) || h.hasAttribute('data-m')) return;
        splitWords(h);
        targets.push(h);
      });

    // Gruppen: Kinder erscheinen nacheinander
    var groups = [
      '.stats-grid', '.feature-pills', '.process-grid', '.location-info',
      '.faq-list', '.price-features', '.trust-list', '.footer-grid',
      '.legal-toc', '.steps', '.testi-grid', '.form-steps'
    ];
    $all(groups.join(',')).forEach(function (g) {
      if (skipped(g)) return;
      var n = 0;
      Array.prototype.slice.call(g.children).forEach(function (c) {
        if (c.classList.contains('reveal') || c.hasAttribute('data-m')) return;
        c.setAttribute('data-m', 'up');
        c.style.setProperty('--i', n++);
        targets.push(c);
      });
    });

    // Einzelblöcke (.footer-bottom bewusst nicht: liegt ganz unten und
    // würde den Auslösebereich des Observers nie erreichen)
    $all('.legal-block, .info-card, .page-hero-label, .page-hero-meta, .section-header p, ' +
         '.feature-copy p, .feature-copy h3, .pricing-note')
      .forEach(function (b) {
        if (skipped(b) || b.hasAttribute('data-m')) return;
        b.setAttribute('data-m', 'up');
        // Geschwister, die gleichzeitig sichtbar werden, leicht versetzt starten
        var prev = b.previousElementSibling, n = 0;
        while (prev && n < 4) {
          if (prev.getAttribute('data-m') === 'up') n++; else break;
          prev = prev.previousElementSibling;
        }
        b.style.setProperty('--i', n);
        targets.push(b);
      });

    // Bilder
    $all('.feature-visual, .map-frame').forEach(function (v) {
      if (skipped(v) || v.hasAttribute('data-m')) return;
      v.setAttribute('data-m', 'img');
      targets.push(v);
    });

    return targets;
  }

  /* ---------- Zahlen hochzählen ---------- */
  function countUp(el) {
    var raw = el.textContent.trim();
    var m = raw.match(/^(\d+)(.*)$/);
    if (!m) return;
    var end = parseInt(m[1], 10), suffix = m[2], t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0' + suffix;
    requestAnimationFrame(step);
  }

  /* ---------- Beobachten ---------- */
  function observe(targets) {
    var counters = $all('.stat-num');

    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('m-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('m-in');
        io.unobserve(el);
        // Nach dem Einblenden aufräumen, damit Hover-Effekte der Seite
        // wieder ihre eigenen Übergänge bekommen
        var kind = el.getAttribute('data-m');
        if (kind === 'up' || kind === 'img') {
          var i = parseInt(el.style.getPropertyValue('--i'), 10) || 0;
          setTimeout(function () {
            el.removeAttribute('data-m');
            el.classList.remove('m-in');
          }, (kind === 'img' ? 1700 : 1000) + i * 90);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (t) { io.observe(t); });

    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        countUp(e.target);
        cio.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Fortschrittsbalken ---------- */
  function progressBar() {
    if (reduce) return;
    var bar = document.createElement('div');
    bar.className = 'm-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Weicher Seitenwechsel ---------- */
  function pageTransitions() {
    if (reduce) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      if (!/\.html$|\/$/.test(url.pathname)) return;
      e.preventDefault();
      document.body.classList.add('m-leaving');
      setTimeout(function () { location.href = url.href; }, 260);
    });
    // Zurück-Button (bfcache): Seite wieder einblenden
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) document.body.classList.remove('m-leaving');
    });
  }

  function init() {
    markActive();
    observe(prepare());
    progressBar();
    pageTransitions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
