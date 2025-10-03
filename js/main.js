// ===== PORTFOLIO JAVASCRIPT ===== //
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollAnimations();
    this.setupCursor();
    this.setupNavigation();
    this.setupWorkItemInteractions();
    this.setupParallaxEffects();
    this.setupTypewriterEffect();
  }

  // ===== NAVIGATION ===== //
  setupNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    let lastScrollY = window.scrollY;

    // Hide/show nav on scroll
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = 'none';
      }

      // Hide nav when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ===== CUSTOM CURSOR ===== //
  setupCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.innerHTML = '<div class="cursor__inner"></div>';
    document.body.appendChild(cursor);

    // Add cursor styles
    const cursorStyles = `
      .cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease-out;
      }
      
      .cursor__inner {
        width: 100%;
        height: 100%;
        background: var(--color-accent);
        border-radius: 50%;
        transform: scale(0.2);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .cursor--active .cursor__inner {
        transform: scale(1);
      }
      
      .cursor--hidden {
        opacity: 0;
      }
      
      @media (max-width: 768px) {
        .cursor {
          display: none;
        }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = cursorStyles;
    document.head.appendChild(styleSheet);

    // Cursor movement
    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
    });

    // Cursor interactions
    const interactiveElements = 'a, button, .work__item, .btn';
    document.querySelectorAll(interactiveElements).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor--active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--active'));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => cursor.classList.add('cursor--hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('cursor--hidden'));
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

  // ===== TYPEWRITER EFFECT ===== //
  setupTypewriterEffect() {
    const subtitle = document.querySelector('.hero__subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';

    let i = 0;
    const typeSpeed = 50;
    const startDelay = 1000;

    setTimeout(() => {
      const typeWriter = () => {
        if (i < text.length) {
          subtitle.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, typeSpeed);
        }
      };
      typeWriter();
    }, startDelay);
  }

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