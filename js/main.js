// ===== PORTFOLIO JAVASCRIPT ===== //
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollAnimations();
    this.setupNavigation();
    this.setupWorkItemInteractions();
    this.setupParallaxEffects();
    // this.setupTypewriterEffect();
    setupPlusGridBackground();
    setupNavScrollSpy();
  }

  // ===== NAVIGATION ===== //
  setupNavigation() {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');

    // Hide nav while hero is visible using IntersectionObserver
    try {
      const hero = document.querySelector('#hero');
      if (hero) {
        const heroObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              nav.classList.add('nav--hidden');
            } else {
              nav.classList.remove('nav--hidden');
            }
          });
        }, { threshold: 0.1 });

        heroObserver.observe(hero);
      }
    } catch (e) {
      // IntersectionObserver may not be supported; fallback to showing nav
      nav.classList.remove('nav--hidden');
    }

    // Update nav background/shadow on scroll (no hide-on-scroll)
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = 'none';
      }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          // Use larger offset to account for nav height + padding (approximately 100px)
          const offsetTop = target.offsetTop + 10;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }



  // ===== SCROLL ANIMATIONS ===== //
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
      '.experience__item, .work__item, .about__paragraph, .skill-category, .education__item, .hero__stat, .contact__item, .section-header'
    );
    
    animateElements.forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }

  // ===== WORK ITEM INTERACTIONS ===== //
  setupWorkItemInteractions() {
    const workItems = document.querySelectorAll('.work__item');
    
    workItems.forEach((item, index) => {
      // Add staggered animation delay
      item.style.setProperty('--animation-delay', `${index * 0.1}s`);
      
      // Enhanced hover effects
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-12px) scale(1.02)';
        item.style.zIndex = '10';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
        item.style.zIndex = 'auto';
      });

      // Click to expand (mock functionality)
      item.addEventListener('click', () => {
        this.showProjectDetail(item);
      });
    });
  }

  // ===== PROJECT DETAIL MODAL ===== //
  showProjectDetail(item) {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    
    const title = item.querySelector('.work__item-title').textContent;
    const description = item.querySelector('.work__item-description').textContent;
    
    modal.innerHTML = `
      <div class="project-modal__backdrop"></div>
      <div class="project-modal__content">
        <button class="project-modal__close">&times;</button>
        <h2 class="project-modal__title">${title}</h2>
        <p class="project-modal__description">${description}</p>
        <div class="project-modal__placeholder">
          <p>Project details would be displayed here...</p>
        </div>
      </div>
    `;

    // Add modal styles
    const modalStyles = `
      .project-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        animation: modalFadeIn 0.3s ease-out;
      }
      
      .project-modal__backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
      }
      
      .project-modal__content {
        position: relative;
        background: white;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        padding: 3rem;
        animation: modalSlideUp 0.3s ease-out;
      }
      
      .project-modal__close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--color-gray-800);
        transition: color 0.3s ease;
      }
      
      .project-modal__close:hover {
        color: var(--color-accent);
      }
      
      .project-modal__title {
        font-size: var(--text-2xl);
        margin-bottom: 1rem;
      }
      
      .project-modal__placeholder {
        margin-top: 2rem;
        padding: 2rem;
        background: var(--color-gray-100);
        text-align: center;
        color: var(--color-gray-800);
      }
      
      @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes modalSlideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;

    if (!document.querySelector('#modal-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'modal-styles';
      styleSheet.textContent = modalStyles;
      document.head.appendChild(styleSheet);
    }

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Close modal handlers
    const closeModal = () => {
      modal.remove();
      document.body.style.overflow = '';
    };

    modal.querySelector('.project-modal__close').addEventListener('click', closeModal);
    modal.querySelector('.project-modal__backdrop').addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  // ===== PARALLAX EFFECTS ===== //
  setupParallaxEffects() {
    const heroGrid = document.querySelector('.hero__grid');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      if (heroGrid) {
        heroGrid.style.transform = `translateY(${rate}px)`;
      }
    });

    // Floating elements
    const floatingElements = document.querySelectorAll('.work__item');
    
    floatingElements.forEach((el, index) => {
      const speed = 0.02 + (index * 0.01);
      const amplitude = 10 + (index * 5);
      
      let animationId;
      const animate = () => {
        const time = Date.now() * speed;
        const y = Math.sin(time) * amplitude;
        el.style.transform = `translateY(${y}px)`;
        animationId = requestAnimationFrame(animate);
      };
      
      // Start animation when element is in view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animate();
          } else {
            cancelAnimationFrame(animationId);
          }
        });
      });
      
      observer.observe(el);
    });
  }

  // Typewriter effect removed

  // ===== EVENT LISTENERS ===== //
  setupEventListeners() {
    // Resize handler
    window.addEventListener('resize', this.debounce(() => {
      // Recalculate layouts if needed
      this.handleResize();
    }, 250));

    // Form submissions (if any)
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit(form);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('click', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  // ===== UTILITY FUNCTIONS ===== //
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  handleResize() {
    // Handle responsive adjustments
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Mobile-specific adjustments
      document.body.classList.add('is-mobile');
    } else {
      document.body.classList.remove('is-mobile');
    }
  }

  handleFormSubmit(form) {
    // Mock form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'SENDING...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      submitBtn.textContent = 'SENT!';
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 2000);
    }, 1500);
  }
}

// ===== NAV SCROLLSPY ===== //
function setupNavScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));
  const sectionIds = navLinks.map(link => link.getAttribute('href').replace('#', ''));
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function onScroll() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    let activeIdx = 0;
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const sectionBottom = sectionTop + rect.height;
      // Section is in top half if its top is above middle and its bottom is below top
      if (scrollY + viewportHeight / 2 >= sectionTop && scrollY < sectionBottom) {
        activeIdx = i;
        break;
      }
    }
    navLinks.forEach((link, idx) => {
      if (idx === activeIdx) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  }
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onScroll);
  onScroll();
}

// ===== PERFORMANCE OPTIMIZATION ===== //
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.setupPreloading();
    this.optimizeAnimations();
  }

  setupLazyLoading() {
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  setupPreloading() {
    // Preload critical resources
    const criticalResources = [
      '/styles/main.css',
      '/js/main.js'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }

  optimizeAnimations() {
    // Reduce animations for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduce-motion');
    }

    // Pause animations when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.body.classList.add('page-hidden');
      } else {
        document.body.classList.remove('page-hidden');
      }
    });
  }
}

// ===== PLUS GRID BACKGROUND ===== //
function setupPlusGridBackground() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  // Configurable variables
  const PLUS_GRID_CONFIG = {
    cellSize: 30, // px
    color: '#2563eb',
    baseOpacity: 0.06,
    highlightOpacity: 0.33,
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 1,
    transition: 'opacity 0.18s',
    blendMode: 'luminosity',
  };

  // Create grid container
  let grid = document.createElement('div');
  grid.className = 'plus-grid-bg';
  grid.style.position = 'absolute';
  grid.style.left = '0';
  grid.style.top = '0';
  grid.style.width = '100%';
  grid.style.height = '100%';
  grid.style.zIndex = '0';
  grid.style.overflow = 'hidden';
  grid.style.pointerEvents = 'none';
  grid.style.mixBlendMode = PLUS_GRID_CONFIG.blendMode;
  hero.prepend(grid);

  let plusEls = [];
  let cols = 0, rows = 0;

  function renderGrid() {
    plusEls.forEach(el => el.remove());
    plusEls = [];
    const rect = hero.getBoundingClientRect();
    cols = Math.ceil(rect.width / PLUS_GRID_CONFIG.cellSize);
    rows = Math.ceil(rect.height / PLUS_GRID_CONFIG.cellSize);
    grid.style.width = rect.width + 'px';
    grid.style.height = rect.height + 'px';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const plus = document.createElement('span');
        plus.textContent = '+';
        plus.style.position = 'absolute';
        plus.style.left = (col * PLUS_GRID_CONFIG.cellSize) + 'px';
        plus.style.top = (row * PLUS_GRID_CONFIG.cellSize) + 'px';
        plus.style.width = PLUS_GRID_CONFIG.cellSize + 'px';
        plus.style.height = PLUS_GRID_CONFIG.cellSize + 'px';
        plus.style.display = 'flex';
        plus.style.alignItems = 'center';
        plus.style.justifyContent = 'center';
        plus.style.fontSize = PLUS_GRID_CONFIG.fontSize + 'px';
        plus.style.color = PLUS_GRID_CONFIG.color;
        plus.style.opacity = PLUS_GRID_CONFIG.baseOpacity;
        plus.style.transition = PLUS_GRID_CONFIG.transition;
        plus.style.fontWeight = PLUS_GRID_CONFIG.fontWeight;
        plus.style.letterSpacing = PLUS_GRID_CONFIG.letterSpacing + 'px';
        plus.style.userSelect = 'none';
        plus.style.pointerEvents = 'none';
        plusEls.push(plus);
        grid.appendChild(plus);
      }
    }
  }

  function highlightGrid(e) {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let hoveredCell = null;
    if (x >= 0 && y >= 0 && x < rect.width && y < rect.height) {
      hoveredCell = {
        col: Math.floor(x / PLUS_GRID_CONFIG.cellSize),
        row: Math.floor(y / PLUS_GRID_CONFIG.cellSize)
      };
    }
    plusEls.forEach((plus, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const isActive = hoveredCell && Math.abs(hoveredCell.row - row) <= 1 && Math.abs(hoveredCell.col - col) <= 1;
      plus.style.opacity = isActive ? PLUS_GRID_CONFIG.highlightOpacity : PLUS_GRID_CONFIG.baseOpacity;
    });
  }

  renderGrid();
  window.addEventListener('resize', renderGrid);
  hero.addEventListener('mousemove', highlightGrid);
  hero.addEventListener('mouseleave', () => {
    plusEls.forEach(plus => plus.style.opacity = PLUS_GRID_CONFIG.baseOpacity);
  });
}

// ===== INITIALIZATION ===== //
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the portfolio app
  const app = new PortfolioApp();
  
  // Initialize performance optimizations
  const performance = new PerformanceOptimizer();
  
  // Add loaded class to body for CSS transitions
  document.body.classList.add('loaded');
  
  // Console signature
  console.log('%c🚀 Portfolio Loaded Successfully', 'color: #ff6b35; font-size: 16px; font-weight: bold;');
  console.log('%cBuilt with Swiss precision and modern web technologies', 'color: #666; font-size: 12px;');
});

// ===== SERVICE WORKER REGISTRATION ===== //
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Service worker would be registered here for PWA functionality
    console.log('Ready for PWA enhancement');
  });
}