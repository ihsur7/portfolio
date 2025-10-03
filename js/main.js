// ================================================
// FUTURISTIC OS RESUME - INTERACTIVE SYSTEM
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    initSystem();
});

function initSystem() {
    initClock();
    initNavigation();
    initContactPanel();
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
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.panel-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');
            
            // Update nav active state
            navItems.forEach(nav => {
                nav.classList.remove('active');
                const status = nav.querySelector('.nav-status');
                if (status) status.textContent = '○';
            });
            
            item.classList.add('active');
            const activeStatus = item.querySelector('.nav-status');
            if (activeStatus) activeStatus.textContent = '●';

            // Update mobile bottom tabbar active state if present
            const tabBtns = document.querySelectorAll('.bottom-tabbar .tab-btn');
            if (tabBtns) {
                tabBtns.forEach(b => {
                    b.classList.toggle('active', b.getAttribute('data-section') === targetSection);
                });
            }
            
            // Switch sections with animation
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.classList.add('active');
                    
                    // Trigger animations based on section
                    if (targetSection === 'skills') {
                        initMagneticHover();
                    }
                }, 50);
            }
        });
    });
}

// ===== SKILL BARS ANIMATION (REMOVED) =====
// Skills now use card-based system



// ===== CONTACT PANEL =====
function initContactPanel() {
    const contactBtn = document.getElementById('contactBtn');
    const contactOverlay = document.getElementById('contactOverlay');
    const contactClose = document.getElementById('contactClose');
    
    if (contactBtn && contactOverlay) {
        contactBtn.addEventListener('click', () => {
            contactOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            playOpenSound();
        });
    }
    
    if (contactClose && contactOverlay) {
        contactClose.addEventListener('click', () => {
            contactOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close on overlay click
        contactOverlay.addEventListener('click', (e) => {
            if (e.target === contactOverlay) {
                contactOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactOverlay.classList.contains('active')) {
            contactOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

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

// ===== MOBILE MENU TOGGLE (FOR RESPONSIVE) =====
// ===== BOTTOM TAB BAR FOR MOBILE =====
function initBottomTabBar() {
    const existing = document.querySelector('.bottom-tabbar');
    const navItems = document.querySelectorAll('.nav-item');

    // remove existing when resizing up
    if (window.innerWidth > 768) {
        if (existing) existing.remove();
        return;
    }

    if (!existing) {
        const tabbar = document.createElement('nav');
        tabbar.className = 'bottom-tabbar';
        tabbar.setAttribute('aria-label', 'Bottom navigation');

        const sections = ['about','skills','work','experience','contact'];

        sections.forEach(sec => {
            const btn = document.createElement('button');
            btn.className = 'tab-btn';
            btn.type = 'button';
            btn.setAttribute('data-section', sec);
            btn.title = sec.replace(/^(.)/, s => s.toUpperCase());
            btn.innerHTML = `<span class="tab-label">${btn.title || sec}</span>`;

            btn.addEventListener('click', () => {
                // find matching nav-item and trigger its click (keeps consistent behavior)
                const targetNav = document.querySelector(`.nav-item[data-section="${sec}"]`);
                if (targetNav) targetNav.click();

                // close rail if open (off-canvas behavior)
                const rail = document.querySelector('.command-rail');
                if (rail && rail.classList.contains('mobile-open')) {
                    rail.classList.remove('mobile-open');
                }
            });

            tabbar.appendChild(btn);
        });

        document.body.appendChild(tabbar);
    }
}

initBottomTabBar();
window.addEventListener('resize', initBottomTabBar);