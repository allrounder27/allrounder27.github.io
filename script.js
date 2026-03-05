// ============================================
// Navbar scroll effect
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile nav toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ============================================
// Active nav link on scroll
// ============================================
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ============================================
// Scroll reveal animation
// ============================================
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 120;
        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('visible');
        }
    });
}

// Add reveal class to sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll(
        '.section-header, .about-text, .about-stats, .timeline-item, ' +
        '.project-card, .interest-card, .contact-wrapper, .skills-marquee'
    );
    revealElements.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.05}s`;
    });

    // Trigger initial check
    reveal();
});

window.addEventListener('scroll', reveal);

// ============================================
// Cursor glow effect (desktop only)
// ============================================
const cursorGlow = document.getElementById('cursorGlow');

if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// ============================================
// Smooth scroll for all anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
