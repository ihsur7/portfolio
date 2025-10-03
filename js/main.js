// ================================================
// FUTURISTIC OS RESUME - INTERACTIVE SYSTEM
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    initSystem();
});

function initSystem() {
    initClock();
    initNavigation();
    initCursorFollower();
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
            
            // Switch sections with animation
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                // Add slight delay for smooth transition
                setTimeout(() => {
                    targetElement.classList.add('active');
                    
                    // Trigger skill bar animations in skills section
                    if (targetSection === 'skills') {
                        animateSkillBars();
                    }
                }, 50);
            }
            
            // Add system sound effect (optional - uncomment if you want audio)
            // playSystemSound();
        });
    });
}

// ===== SKILL BARS ANIMATION =====
function animateSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach((fill, index) => {
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = width;
        }, index * 50);
    });
}

// ===== CURSOR FOLLOWER =====
function initCursorFollower() {
    const follower = document.querySelector('.cursor-follower');
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth follow animation
    function animate() {
        const speed = 0.15;
        
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;
        
        follower.style.transform = `translate(${followerX - 10}px, ${followerY - 10}px)`;
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Interactive elements cursor effects
    const interactiveElements = document.querySelectorAll('a, button, .nav-item, .project-card, .stat-box, .contact-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            follower.style.transform = `translate(${followerX - 10}px, ${followerY - 10}px) scale(1.5)`;
            follower.style.borderColor = 'var(--color-accent)';
        });
        
        element.addEventListener('mouseleave', () => {
            follower.style.transform = `translate(${followerX - 10}px, ${followerY - 10}px) scale(1)`;
            follower.style.borderColor = 'var(--color-accent)';
        });
    });
}

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
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.project-card, .stat-box, .skill-category, .timeline-item');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
            card.style.boxShadow = `${(x - centerX) / 5}px ${(y - centerY) / 5}px 30px rgba(0, 217, 255, 0.2)`;
        } else {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    });
});

// Reset transforms when mouse leaves cards
document.querySelectorAll('.project-card, .stat-box, .skill-category, .timeline-item').forEach(card => {
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
});

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

// ===== DYNAMIC SYSTEM INFO (CPU/MEM BARS) =====
function updateSystemInfo() {
    const cpuFill = document.querySelector('.info-line:nth-child(1) .info-fill');
    const memFill = document.querySelector('.info-line:nth-child(2) .info-fill');
    
    if (cpuFill && memFill) {
        // Simulate fluctuating system resources
        setInterval(() => {
            const cpuValue = 30 + Math.random() * 40;
            const memValue = 50 + Math.random() * 30;
            
            cpuFill.style.width = `${cpuValue}%`;
            memFill.style.width = `${memValue}%`;
        }, 2000);
    }
}

updateSystemInfo();

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
function initMobileMenu() {
    // Add mobile menu button if viewport is small
    if (window.innerWidth <= 768) {
        const dashboard = document.querySelector('.dashboard');
        const rail = document.querySelector('.command-rail');
        
        if (dashboard && rail && !document.querySelector('.mobile-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '☰';
            menuBtn.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 101;
                background: var(--color-accent);
                border: none;
                color: var(--color-bg);
                width: 45px;
                height: 45px;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 0 20px var(--color-accent-dim);
            `;
            
            menuBtn.addEventListener('click', () => {
                rail.classList.toggle('mobile-open');
            });
            
            document.body.appendChild(menuBtn);
            
            // Close menu when clicking outside
            dashboard.addEventListener('click', () => {
                if (rail.classList.contains('mobile-open')) {
                    rail.classList.remove('mobile-open');
                }
            });
        }
    }
}

initMobileMenu();
window.addEventListener('resize', initMobileMenu);