/**
 * ═══════════════════════════════════════════════════════════
 * AMOUR & CADEAUX - INTERACTIVE SCRIPT
 * Unified interactivity for all pages
 * ═══════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimation();
    initializeInteractiveElements();
    initializeFormHandling();
    initializeAccessibility();
    initializeMobileMenu();
    removeAllEmoji();
    trackPageLoad();
    initializeRomanticEffects();
});

/**
 * HEADER SCROLL ANIMATION
 */
function initializeScrollAnimation() {
    const header = document.querySelector('header');
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });
}

/**
 * ANIMATE ELEMENTS ON VIEW
 */
function initializeInteractiveElements() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Apply animation to card elements
    document.querySelectorAll('.card, [class*="product"], [class*="trust"], [class*="badge"]').forEach(el => {
        observer.observe(el);
    });

    // Button ripple effect
    document.querySelectorAll('button, .btn, a[class*="btn"]').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '0px';
            ripple.style.height = '0px';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation to stylesheet
    if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                from {
                    width: 0px;
                    height: 0px;
                }
                to {
                    width: 500px;
                    height: 500px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * FORM HANDLING & VALIDATION
 */
function initializeFormHandling() {
    // Newsletter form
    const newsletterForms = document.querySelectorAll('form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            
            if (!emailInput) return;
            
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showNotification(' Email invalide', 'error');
                emailInput.focus();
                return;
            }
            
            // Simulate submission
            const originalText = submitButton?.textContent || 'Soumettre';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = '⏳ Traitement...';
            }
            
            // Simulate API call
            setTimeout(() => {
                showNotification(' Merci! Vérifiez votre email', 'success');
                emailInput.value = '';
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
                
                // Track conversion
                trackEvent('newsletter_signup', { email: maskEmail(email) });
            }, 1500);
        });
    });
    
    // Contact form if exists
    const contactForm = document.querySelector('form[method="post"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]')?.value || '';
            const email = this.querySelector('input[name="email"]')?.value || '';
            const message = this.querySelector('textarea[name="message"]')?.value || '';
            
            if (!name || !email || !message) {
                showNotification(' Remplissez tous les champs', 'warning');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification(' Email invalide', 'error');
                return;
            }
            
            showNotification(' Message envoyé!', 'success');
            this.reset();
            trackEvent('contact_form_submit', { source: 'contact_page' });
        });
    }
}

/**
 * NOTIFICATION SYSTEM
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        z-index: 9999;
        animation: slideInDown 0.3s ease-out;
        background: ${
            type === 'success' ? '#10b981' :
            type === 'error' ? '#ef4444' :
            type === 'warning' ? '#f59e0b' :
            '#0ea5e9'
        };
        color: white;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * EMAIL VALIDATION
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * MASK EMAIL FOR PRIVACY
 */
function maskEmail(email) {
    const [local, domain] = email.split('@');
    return local.substring(0, 2) + '***@' + domain;
}

/**
 * ACCESSIBILITY IMPROVEMENTS
 */
function initializeAccessibility() {
    // Add focus management
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('[role="dialog"]').forEach(el => el.close?.());
        }
    });
    
    // Add skip to main link
    if (!document.querySelector('a[href="#main"]')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Aller au contenu principal';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--primary);
            color: white;
            padding: 0.5rem 1rem;
            text-decoration: none;
            z-index: 9999;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

/**
 * REMOVE ALL EMOJI - Replace with Unicode symbols
 */
function removeAllEmoji() {
    // Get all text nodes and replace emoji with Unicode
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    
    const walkDOM = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            // Common replacements
            node.textContent = node.textContent
                .replace(//g, '')
                .replace(//g, '')
                .replace(//g, '')
                .replace(//g, '◐')
                .replace(/|/g, '')
                .replace(/⏰/g, '')
                .replace(//g, '◈')
                .replace(//g, '◊');
        } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'SCRIPT') {
            Array.from(node.childNodes).forEach(walkDOM);
        }
    };
    
    walkDOM(document.body);
}

/**
 * ANALYTICS TRACKING
 */
function trackPageLoad() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_path: window.location.pathname,
            page_title: document.title
        });
    }
}

function trackEvent(eventName, params = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, params);
    }
    // Fallback: console logging for debugging
    console.log('Track:', eventName, params);
}

/**
 * TRACK AFFILIATE LINK CLICKS
 */
function trackAffiliateClick(productName) {
    trackEvent('affiliate_click', {
        product: productName,
        timestamp: new Date().toISOString()
    });
}

/**
 * SMOOTH SCROLL FOR ANCHOR LINKS
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * PREVENT LAYOUT SHIFT FROM SCROLLBAR
 */
function preventScrollbarShift() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.scrollbarGutter = 'stable';
}

preventScrollbarShift();

/**
 * ROMANTIC EFFECTS FOR ST. VALENTINE'S
 */
function initializeRomanticEffects() {
    createFloatingHearts();
    addRomanticInteractions();
    initializeParticleSystem();
}

/**
 * CREATE FLOATING HEARTS BACKGROUND
 */
function createFloatingHearts() {
    const heartsContainer = document.createElement('div');
    heartsContainer.className = 'floating-hearts';
    document.body.appendChild(heartsContainer);

    // Create hearts
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '♥';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 15 + 's';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heartsContainer.appendChild(heart);
    }
}

/**
 * ADD ROMANTIC INTERACTIONS
 */
function addRomanticInteractions() {
    // Add heartbeat to logo/title
    const titles = document.querySelectorAll('h1, .gradient-text');
    titles.forEach(title => {
        title.classList.add('animate-heartbeat');
    });

    // Add sparkle to special elements
    const specialElements = document.querySelectorAll('.card, [class*="product"], [class*="trust"]');
    specialElements.forEach((el, index) => {
        if (index % 3 === 0) {
            el.classList.add('sparkle-effect');
        }
    });

    // Romantic click effects
    document.addEventListener('click', function(e) {
        if (Math.random() < 0.1) { // 10% chance for romantic effect
            createLoveParticle(e.clientX, e.clientY);
        }
    });
}

/**
 * CREATE LOVE PARTICLE EFFECT
 */
function createLoveParticle(x, y) {
    const particle = document.createElement('div');
    particle.innerHTML = '💕';
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.fontSize = '24px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.animation = 'love-particle 2s ease-out forwards';

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 2000);
}

/**
 * PARTICLE SYSTEM FOR ROMANTIC ATMOSPHERE
 */
function initializeParticleSystem() {
    let particles = [];
    const maxParticles = 50;

    function createParticle() {
        if (particles.length >= maxParticles) return;

        const particle = document.createElement('div');
        particle.innerHTML = Math.random() < 0.5 ? '✨' : '💫';
        particle.style.position = 'fixed';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        particle.style.fontSize = (Math.random() * 16 + 8) + 'px';
        particle.style.opacity = '0.6';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '-1';
        particle.style.animation = `particle-float ${Math.random() * 10 + 10}s linear infinite`;

        document.body.appendChild(particle);
        particles.push(particle);

        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                particles = particles.filter(p => p !== particle);
            }
        }, 15000);
    }

    // Add particle animation to stylesheet
    if (!document.querySelector('#particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes particle-float {
                0% {
                    transform: translateY(0px) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.6;
                }
                90% {
                    opacity: 0.6;
                }
                100% {
                    transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
                    opacity: 0;
                }
            }
            @keyframes love-particle {
                0% {
                    transform: scale(0) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.5) rotate(180deg);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(0) rotate(360deg) translateY(-100px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create particles periodically
    setInterval(createParticle, 2000);

    // Custom cursor
    createCustomCursor();
}

/**
 * CUSTOM ROMANTIC CURSOR
 */
function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-heart';
    cursor.innerHTML = '♥';
    cursor.style.left = '-50px';
    cursor.style.top = '-50px';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Hide cursor on links/buttons
    document.addEventListener('mouseenter', (e) => {
        if (e.target.matches('a, button, .btn, [role="button"]')) {
            cursor.style.opacity = '0.3';
            cursor.style.transform = 'scale(0.5)';
        }
    }, true);

    document.addEventListener('mouseleave', (e) => {
        if (e.target.matches('a, button, .btn, [role="button"]')) {
            cursor.style.opacity = '0.8';
            cursor.style.transform = 'scale(1)';
        }
    }, true);
}

/**
 * MOBILE MENU TOGGLE
 */
function initializeMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}
