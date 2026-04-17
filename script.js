// ============================================================
// 1. JS-Ready Class (für Reveal-Animationen)
// ============================================================
document.body.classList.add('js-ready');

// ============================================================
// 2. Header Scroll-Effekt
// ============================================================
const siteHeader = document.getElementById('site-header');
if (siteHeader) {
    window.addEventListener('scroll', () => {
        siteHeader.classList.toggle('scrolled', window.scrollY > 30);
    });
}

// ============================================================
// 3. Sanftes Scrollen für Anchor-Links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
        }
    });
});

// ============================================================
// 4. Reveal on Scroll
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============================================================
// 5. HAMBURGER MENÜ  ← Das war der Bug: falsche IDs
//    HTML hat: id="hamburger" + id="mobileOverlay" + class="is-open"
//    Altes Script suchte: id="mobile-menu" + class="active"  ✗
// ============================================================
const hamburger    = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');

if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
        const isOpen = !mobileOverlay.classList.contains('is-open');

        mobileOverlay.classList.toggle('is-open', isOpen);
        hamburger.classList.toggle('is-active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    });

    // Overlay schließen wenn ein Link geklickt wird
    mobileOverlay.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileOverlay.classList.remove('is-open');
            hamburger.classList.remove('is-active');
            document.body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Schließen mit Escape-Taste
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileOverlay.classList.contains('is-open')) {
            mobileOverlay.classList.remove('is-open');
            hamburger.classList.remove('is-active');
            document.body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// ============================================================
// 6. FAQ Accordion
// ============================================================
document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-item');
        const body = item.querySelector('.faq-body');
        const isOpen = item.classList.contains('open');

        // Alle schließen
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-body').style.maxHeight = '0';
        });

        // Dieses öffnen, wenn es vorher zu war
        if (!isOpen) {
            item.classList.add('open');
            body.style.maxHeight = body.scrollHeight + 'px';
        }
    });
});

// ============================================================
// 7. 3D Tilt-Effekt für .tilt-element
// ============================================================
document.querySelectorAll('.tilt-element').forEach(el => {
    el.addEventListener('mouseenter', () => { el.style.transition = 'none'; });

    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale3d(1.02,1.02,1.02)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.5s ease';
        el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    });
});

// ============================================================
// 8. Mouse-Glow für Preiskarten
// ============================================================
document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});

// ============================================================
// 9. Vorher-Nachher Slider (Projekt A)
// ============================================================
const slider    = document.getElementById('comparison-slider');
const imageAfter = document.querySelector('.image-after');
if (slider && imageAfter) {
    slider.addEventListener('input', e => {
        imageAfter.style.width = `${e.target.value}%`;
    });
}

// ============================================================
// 10. Seitensuche (falls vorhanden)
// ============================================================
const searchForm = document.getElementById('page-search-form');
if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = document.getElementById('search-input').value.trim();
        if (query && !window.find(query)) {
            alert(`"${query}" wurde auf dieser Seite nicht gefunden.`);
        }
    });
}
