// ================================================
// FUTURISTIC OS RESUME - INTERACTIVE SYSTEM
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    initSystem();
});

function initSystem() {
    initClock();
    initBottomTabBar();
    initNavigation();
    initScrollAnimations();
    initFormHandler();
}

// ===== SYSTEM CLOCK =====
function initClock() {
    const updateTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const timeElement = document.getElementById('systemTime');
        if (timeElement) {
            timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // Update date
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            dateElement.textContent = `${day}.${month}.${year}`;
        }
    };
    
    updateTime();
    setInterval(updateTime, 1000);
}

// ===== NAVIGATION SYSTEM =====
function initNavigation() {
    const sections = document.querySelectorAll('.panel-section');
    const panelGrid = document.querySelector('.panel-grid');
    
    // Function to update active section based on scroll position
    function updateActiveSection() {
        if (!panelGrid) return;

        const scrollPosition = panelGrid.scrollTop;
        const offset = 100; // Offset from top to determine "active" section

        let currentSection = null;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - panelGrid.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            // Check if scroll position is within this section (with offset)
            if (scrollPosition + offset >= sectionTop && scrollPosition + offset < sectionBottom) {
                currentSection = section.id;
            }
        });

        // If we're at the very top, ensure first section is active
        if (scrollPosition < 50) {
            currentSection = sections[0]?.id;
        }

        // If we're near the bottom, ensure last section is active
        const scrollBottom = scrollPosition + panelGrid.clientHeight;
        const scrollHeight = panelGrid.scrollHeight;
        if (scrollBottom >= scrollHeight - 50) {
            currentSection = sections[sections.length - 1]?.id;
        }

        if (currentSection) {
            // Update mobile bottom tabbar
            const tabBtns = document.querySelectorAll('.bottom-tabbar .tab-btn');
            if (tabBtns.length) {
                tabBtns.forEach(b => {
                    b.classList.toggle('active', b.getAttribute('data-section') === currentSection);
                });
            }

            // Trigger animations for skills section (only once)
            if (currentSection === 'skills' && !window.skillsAnimationTriggered) {
                initMagneticHover();
                window.skillsAnimationTriggered = true;
            }
        }
    }

    // Listen to scroll events on the panel grid
    if (panelGrid) {
        panelGrid.addEventListener('scroll', updateActiveSection);
        // Run once on load
        updateActiveSection();
    }
}

// ===== SKILL BARS ANIMATION (REMOVED) =====
// Skills now use card-based system

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe content boxes, project cards, etc.
    const animatedElements = document.querySelectorAll('.content-box, .project-card, .timeline-item, .stat-box');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ===== FORM HANDLER =====
function initFormHandler() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>SENDING...</span>';
            submitBtn.disabled = true;
            
            // Simulate sending (replace with actual API call)
            setTimeout(() => {
                submitBtn.innerHTML = '<span>SENT ✓</span>';
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Close contact panel
                    const contactOverlay = document.getElementById('contactOverlay');
                    if (contactOverlay) {
                        contactOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }, 1500);
            }, 2000);
            
            // In production, replace the above with actual form submission:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // })
            // .then(response => response.json())
            // .then(result => {
            //     // Handle success
            // })
            // .catch(error => {
            //     // Handle error
            // });
        });
    }
}

// ===== HOVER SHADOW EFFECTS =====
// Magnetic hover effect for skill cards
function initMagneticHover() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            // Magnetic pull effect (subtle)
            const moveX = deltaX * 8;
            const moveY = deltaY * 8;
            
            card.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-4px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// 3D tilt effect for other cards
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.project-card, .stat-box, .timeline-item');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 15;
            const angleY = (centerX - x) / 15;
            
            // Replace 3D tilt with a subtle 2D translate and a dynamic shadow
            const moveX = (x - centerX) / 30; // small horizontal nudge
            const moveY = (y - centerY) / 30; // small vertical nudge
            card.style.transform = `translate(${moveX}px, ${moveY - 4}px)`;

            // Dynamic shadow based on cursor position (2D)
            const shadowX = (x - centerX) / 10;
            const shadowY = (y - centerY) / 10;
            card.style.boxShadow = `${shadowX}px ${shadowY}px 24px rgba(0, 217, 255, 0.12)`;
        } else {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    });
});

// Reset transforms when mouse leaves cards
document.querySelectorAll('.project-card, .stat-box, .timeline-item').forEach(card => {
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
});

// Initialize magnetic hover on page load for visible skill cards
initMagneticHover();

// ===== SYSTEM SOUND EFFECTS (OPTIONAL) =====
function playOpenSound() {
    // Minimal beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    // Matrix-style rain effect
    const colors = ['#00d9ff', '#00ff88', '#ffffff'];
    document.body.style.transition = 'background 2s ease';
    
    let colorIndex = 0;
    const interval = setInterval(() => {
        document.documentElement.style.setProperty('--color-accent', colors[colorIndex % colors.length]);
        colorIndex++;
    }, 300);
    
    setTimeout(() => {
        clearInterval(interval);
        document.documentElement.style.setProperty('--color-accent', '#00d9ff');
        document.body.style.transition = '';
    }, 3000);
    
    console.log('🎮 SYSTEM ACCESS GRANTED - DEVELOPER MODE ACTIVATED');
}

// Dynamic system info removed (CPU/MEM bars)

// ===== PROJECT CARD INTERACTIONS =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Don't trigger if clicking on a link
        if (e.target.tagName !== 'A') {
            const link = this.querySelector('.project-link');
            if (link && link.href !== '#') {
                window.location.href = link.href;
            }
        }
    });
});

// ===== CONTENT BOX EXPAND/COLLAPSE =====
document.querySelectorAll('.box-header').forEach(header => {
    header.style.cursor = 'pointer';
    
    header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        const indicator = header.querySelector('.box-indicator');
        
        if (body && indicator) {
            const isCollapsed = body.style.display === 'none';
            
            body.style.display = isCollapsed ? 'block' : 'none';
            indicator.textContent = isCollapsed ? '▾' : '▸';
            
            // Animate
            if (isCollapsed) {
                body.style.animation = 'panelSlideIn 0.4s ease';
            }
        }
    });
});

// ===== SMOOTH SCROLL BEHAVIOR =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== PERFORMANCE: LOG SYSTEM BOOT =====
console.log(`
╔═══════════════════════════════════════╗
║  SYSTEM INITIALIZED                   ║
║  VERSION: 2.0.25                      ║
║  STATUS: ONLINE                       ║
║  MODULES: LOADED                      ║
╚═══════════════════════════════════════╝
`);

// ===== BOTTOM TAB BAR (ALWAYS VISIBLE) =====
function initBottomTabBar() {
    const existing = document.querySelector('.bottom-tabbar');

    // Don't recreate if already exists
    if (existing) return;

    const tabbar = document.createElement('nav');
    tabbar.className = 'bottom-tabbar';
    tabbar.setAttribute('aria-label', 'Bottom navigation');

    const sections = ['about','skills','work','experience','contact'];
    const panelGrid = document.querySelector('.panel-grid');

    sections.forEach(sec => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.type = 'button';
        btn.setAttribute('data-section', sec);
        btn.title = sec.replace(/^(.)/, s => s.toUpperCase());
        btn.innerHTML = `<span class="tab-label">${btn.title || sec}</span>`;

        btn.addEventListener('click', () => {
            // Smooth scroll to section
            const targetElement = document.getElementById(sec);
            if (targetElement && panelGrid) {
                const offsetTop = targetElement.offsetTop - panelGrid.offsetTop;
                panelGrid.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });

        tabbar.appendChild(btn);
    });

    document.body.appendChild(tabbar);
}