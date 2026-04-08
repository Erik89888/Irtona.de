// 1. Sanftes Scrollen für die Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// 2. Reveal on Scroll (Elemente fliegen sanft ein)
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: Wenn es einmal geladen ist, nicht wieder ausblenden
            // observer.unobserve(entry.target); 
        }
    });
};

const revealOptions = {
    threshold: 0.15, // Löst aus, wenn 15% des Elements sichtbar sind
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));


// 3. 3D Tilt Effekt für Portfolio und Preiskarten (Maus-Tracking)
const tiltElements = document.querySelectorAll('.tilt-element');

tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        
        // Berechne die Mausposition innerhalb des Elements (von -0.5 bis 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        // Multiplikator für die Stärke der Neigung
        const intensity = 20; 
        
        // Wende die 3D Transformation an
        el.style.transform = `perspective(1000px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    // Zurücksetzen, wenn die Maus das Element verlässt
    el.addEventListener('mouseleave', () => {
        el.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
        el.style.transition = 'transform 0.5s ease'; // Weicher Übergang zurück
    });
    
    // Übergang entfernen, solange die Maus sich bewegt, damit es direkt reagiert
    el.addEventListener('mouseenter', () => {
        el.style.transition = 'none';
    });
    // Maus-Position für den Glow-Effekt tracken
document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });

    });
});

// Vorher-Nachher Slider Logik - PROJEKT A
const slider = document.getElementById('comparison-slider');
const imageAfter = document.querySelector('.image-after');

if (slider && imageAfter) {
    slider.addEventListener('input', (e) => {
        const sliderValue = e.target.value;
        imageAfter.style.width = `${sliderValue}%`;
    });
}

document.getElementById('page-search-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Verhindert, dass die Seite neu lädt
    let query = document.getElementById('search-input').value.trim();
    
    if(query) {
        // Nutzt die integrierte Suchfunktion des Browsers, springt zum Text und markiert ihn
        let found = window.find(query);
        if (!found) {
            // Falls das Wort auf der aktuellen Seite nicht existiert
            alert('Leider wurde der Begriff "' + query + '" auf dieser Seite nicht gefunden.');
        }
    }
});
const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            document.body.classList.toggle('menu-open', isOpen);
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('menu-open');
            }
        });
    }
