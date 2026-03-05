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

// ============================================
// Chatbot
// ============================================
const CHATBOT_API = 'https://gautam-chatbot.gautambafna.workers.dev';

const chatToggle = document.getElementById('chatbotToggle');
const chatWindow = document.getElementById('chatbotWindow');
const chatClose = document.getElementById('chatbotClose');
const chatForm = document.getElementById('chatbotForm');
const chatInput = document.getElementById('chatbotInput');
const chatMessages = document.getElementById('chatbotMessages');
const chatSend = document.getElementById('chatbotSend');

let chatHistory = [];

chatToggle.addEventListener('click', () => {
    chatWindow.classList.add('open');
    chatToggle.classList.add('hidden');
    chatInput.focus();
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('open');
    chatToggle.classList.remove('hidden');
});

// Close chatbot on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWindow.classList.contains('open')) {
        chatWindow.classList.remove('open');
        chatToggle.classList.remove('hidden');
    }
});

function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    msg.innerHTML = `<div class="chat-bubble">${escapeHTML(text)}</div>`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const msg = document.createElement('div');
    msg.className = 'chat-message bot';
    msg.id = 'typingIndicator';
    msg.innerHTML = `<div class="chat-bubble chat-typing"><span></span><span></span><span></span></div>`;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';
    chatSend.disabled = true;

    chatHistory.push({ role: 'user', content: text });

    // Keep last 10 messages for context
    const messagesToSend = chatHistory.slice(-10);

    addTypingIndicator();

    try {
        const res = await fetch(CHATBOT_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messagesToSend }),
        });

        removeTypingIndicator();

        if (!res.ok) {
            throw new Error('API error');
        }

        const data = await res.json();
        const reply = data.reply || "Sorry, I couldn't process that.";
        addMessage(reply, 'bot');
        chatHistory.push({ role: 'assistant', content: reply });
    } catch (err) {
        removeTypingIndicator();
        addMessage("Oops, something went wrong. Please try again!", 'bot');
    }

    chatSend.disabled = false;
    chatInput.focus();
});
