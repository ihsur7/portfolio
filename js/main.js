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
        const nav = document.getElementById("nav");
        const navToggle = document.getElementById("navToggle");
        const navLinks = document.getElementById("navLinks");

        if (!nav || !navLinks) {
            return;
        }

        const updateNavBackground = () => {
            if (nav.classList.contains("nav--menu-open")) {
                nav.style.background = "transparent";
                nav.style.boxShadow = "none";
                return;
            }

            const currentScrollY = window.scrollY;
            if (currentScrollY > 100) {
                nav.style.background = "rgba(255, 255, 255, 0.98)";
                nav.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
            } else {
                nav.style.background = "rgba(255, 255, 255, 0.95)";
                nav.style.boxShadow = "none";
            }
        };

        const handleKeydown = (event) => {
            if (event.key === "Escape") {
                setMenuState(false);
            }
        };

        const setMenuState = (isOpen) => {
            if (!navToggle) {
                navLinks.classList.toggle("nav__links--open", isOpen);
            } else {
                navToggle.classList.toggle("nav__toggle--active", isOpen);
                navLinks.classList.toggle("nav__links--open", isOpen);
            }

            nav.classList.toggle("nav--menu-open", isOpen);
            document.body.classList.toggle("nav-open", isOpen);

            if (isOpen) {
                nav.classList.remove("nav--hidden");
                document.addEventListener("keydown", handleKeydown);
            } else {
                document.removeEventListener("keydown", handleKeydown);
            }

            updateNavBackground();
        };

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener("click", () => {
                const willOpen =
                    !navLinks.classList.contains("nav__links--open");
                setMenuState(willOpen);
            });

            // Close menu when clicking on a link
            const links = navLinks.querySelectorAll(".nav__link");
            links.forEach((link) => {
                link.addEventListener("click", () => {
                    setMenuState(false);
                });
            });

            // Close menu when clicking outside
            document.addEventListener("click", (e) => {
                if (
                    !nav.contains(e.target) &&
                    navLinks.classList.contains("nav__links--open")
                ) {
                    setMenuState(false);
                }
            });
        }

        // Hide nav while hero is visible using IntersectionObserver
        try {
            const hero = document.querySelector("#hero");
            if (hero) {
                const heroObserver = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (nav.classList.contains("nav--menu-open")) {
                                nav.classList.remove("nav--hidden");
                                return;
                            }

                            if (entry.isIntersecting) {
                                nav.classList.add("nav--hidden");
                            } else {
                                nav.classList.remove("nav--hidden");
                            }
                        });
                    },
                    { threshold: 0.1 },
                );

                heroObserver.observe(hero);
            }
        } catch (e) {
            // IntersectionObserver may not be supported; fallback to showing nav
            nav.classList.remove("nav--hidden");
        }

        // Update nav background/shadow on scroll (no hide-on-scroll)
        window.addEventListener("scroll", updateNavBackground);
        updateNavBackground();

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (e) => {
                e.preventDefault();
                const target = document.querySelector(
                    anchor.getAttribute("href"),
                );
                if (target) {
                    // Use larger offset to account for nav height + padding (approximately 100px)
                    const offsetTop = target.offsetTop + 10;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: "smooth",
                    });
                }
            });
        });
    }

    // ===== SCROLL ANIMATIONS ===== //
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-fade-in-up");
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            ".experience__item, .work__item, .about__paragraph, .skill-category, .education__item, .hero__stat, .contact__item, .section-header",
        );

        animateElements.forEach((el) => {
            el.classList.add("animate-on-scroll");
            observer.observe(el);
        });
    }

    // ===== WORK ITEM INTERACTIONS ===== //
    setupWorkItemInteractions() {
        const workItems = document.querySelectorAll(".work__item");

        workItems.forEach((item, index) => {
            // Add staggered animation delay
            item.style.setProperty("--animation-delay", `${index * 0.1}s`);

            // Enhanced hover effects
            item.addEventListener("mouseenter", () => {
                item.style.transform = "translateY(-12px) scale(1.02)";
                item.style.zIndex = "10";
            });

            item.addEventListener("mouseleave", () => {
                item.style.transform = "translateY(0) scale(1)";
                item.style.zIndex = "auto";
            });

            // Click to expand (mock functionality)
            item.addEventListener("click", () => {
                this.showProjectDetail(item);
            });
        });
    }

    // ===== PROJECT DETAIL MODAL ===== //
    showProjectDetail(item) {
        const modal = document.createElement("div");
        modal.className = "project-modal";

        const title = item.querySelector(".work__item-title").textContent;
        const shortDescription = item.querySelector(".work__item-description")
            ? item.querySelector(".work__item-description").textContent
            : "";
        const projectUrl = item.dataset.url || null;
        const role = item.dataset.role || "";
        const duration = item.dataset.duration || "";
        const techs = item.dataset.tech || ""; // comma-separated
        const fullDetails = item.dataset.details || "";

        // Build tech tags markup if techs provided
        const techTagsHtml = techs
            ? techs
                  .split(",")
                  .map((t) => `<span class="tag">${t.trim()}</span>`)
                  .join(" ")
            : "";

        // Button HTML if project URL exists (placed in header actions)
        const ctaButtonHtml = projectUrl
            ? `<a href="${projectUrl}" class="btn btn--primary project-modal__visit" target="_blank" rel="noopener noreferrer" aria-label="Visit ${title}">Visit</a>`
            : "";

        // Detect Chevalet.co project by title or URL
        let placeholderHtml = `
            
        `;
        if (title === "Chevalet.co") {
            placeholderHtml = `
                <div class="project-modal__slider" role="region" aria-label="Image slideshow">
                    <div class="slider-container">
                        <div class="slider-track">
                            <img src="public/chevalet_1.png" alt="Chevalet Screenshot 1" class="slider-img" loading="lazy" />
                            <img src="public/chevalet_2.png" alt="Chevalet Screenshot 2" class="slider-img" loading="lazy" />
                            <img src="public/chevalet_3.png" alt="Chevalet Screenshot 3" class="slider-img" loading="lazy" />
                        </div>
                        <button class="slider-btn slider-btn--prev" aria-label="Previous image" disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 19.5-7.5-7.5 7.5-7.5" />
                            </svg>
                        </button>
                        <button class="slider-btn slider-btn--next" aria-label="Next image">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                        <div class="slider-counter" aria-live="polite"><span class="current">1</span> / <span class="total">3</span></div>
                        <button class="slider-fullscreen" aria-label="View fullscreen" title="View fullscreen">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                            </svg>
                        </button>
                    </div>
                    <div class="slider-controls">
                        <div class="slider-dots" aria-label="Slide indicators"></div>
                    </div>
                </div>
            `;
        }

        modal.innerHTML = `
        <div class="project-modal__backdrop"></div>
        <div class="project-modal__content">
          <!-- Top bar with left-to-right gradient -->
          <div class="project-modal__topbar" aria-hidden="true"></div>

          <!-- Close button positioned absolutely in the top-right corner of the modal -->
          <button class="project-modal__close" aria-label="Close modal">&times;</button>

          <!-- Modal body -->
          <div class="project-modal__body">
            <!-- Header: title on the left, visit button on the right -->
            <div class="project-modal__header">
              <h2 class="project-modal__title">${title}</h2>
              <div class="project-modal__actions">
                ${ctaButtonHtml}
              </div>
            </div>

            ${role || duration ? `<div class="project-modal__meta">${role ? `<strong>${role}</strong>` : ""}${role && duration ? " · " : ""}${duration ? `<span>${duration}</span>` : ""}</div>` : ""}

            <p class="project-modal__description">${shortDescription}</p>

            ${fullDetails ? `<div class="project-modal__details"><h3>Details</h3><div class="project-modal__details-content">${fullDetails}</div></div>` : ""}

            ${techTagsHtml ? `<div class="project-modal__tech"><h3>Tech</h3><div class="project-modal__tech-list">${techTagsHtml}</div></div>` : ""}

            <div class="project-modal__placeholder">
              ${placeholderHtml}
            </div>
          </div>
        </div>
      `;

        // Add modal styles (topbar gradient + absolute close in top-right)
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
              max-width: 820px;
              width: 100%;
              max-height: 90vh;
              overflow: hidden; /* keep rounded card clipped (topbar + body) */
              border-radius: 0px;
              animation: modalSlideUp 0.3s ease-out;
              box-shadow: 0 24px 48px rgba(0,0,0,0.25);
            }

            @media (max-width: 768px) {
              .project-modal {
                padding: 1rem;
              }
              
              .project-modal__content {
                max-height: 95vh;
              }

              .project-modal__body {
                padding: 1rem 1.5rem 1.5rem;
                max-height: calc(95vh - 56px);
              }
            }

            /* Top bar: gradient left -> right */
            .project-modal__topbar {
              height: 56px;
              width: 100%;
              background: linear-gradient(90deg, var(--color-accent), var(--color-white));
            }

            /* Close button positioned absolutely at the top-right corner of the modal card */
            .project-modal__close {
              position: absolute;
              top: 8px;
              right: 8px;
              z-index: 5;
              background: rgba(10,10,10,0.5);
              color: #fff;
              border: none;
              border-radius: 0px;
              width: 40px;
              height: 40px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 1.25rem;
              line-height: 1;
              cursor: pointer;
              transition: transform 0.15s ease, background 0.15s ease;
              box-shadow: 0 6px 18px rgba(0,0,0,0.15);
              backdrop-filter: blur(2px);
            }

            .project-modal__close:hover {
                background: rgba(10,10,10,1);
              transform: translateY(-1px);
            }

            /* Modal body: allow it to scroll independently of the page */
            .project-modal__body {
              /* Reserve space for the topbar (56px) and allow the body to consume remaining modal height */
              max-height: calc(80vh - 56px);
              overflow-y: auto;
              -webkit-overflow-scrolling: touch; /* smooth scrolling on iOS */
              padding: 1.5rem 2.25rem 2.25rem;
            }

            /* rest of modal body/layout rules unchanged... */
            .project-modal__header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 1rem;
              margin-bottom: 0.5rem;
            }

            .project-modal__title {
              font-size: var(--text-2xl);
              margin: 0;
              flex: 1 1 auto;
              word-break: break-word;
            }

            .project-modal__actions {
              flex: 0 0 auto;
              display: flex;
              gap: 0.5rem;
              align-items: center;
            }

            .project-modal__visit {
              padding: 0.5rem 0.9rem;
              font-size: 0.875rem;
              min-width: auto;
            }

            .project-modal__meta {
              color: var(--color-gray-700);
              margin-bottom: 1rem;
              font-weight: 600;
            }

            .project-modal__description {
              color: var(--color-gray-800);
              margin-bottom: 1rem;
              line-height: 1.6;
            }

            .project-modal__details h3,
            .project-modal__tech h3 {
              margin-top: 1.25rem;
              margin-bottom: 0.5rem;
              font-size: var(--text-sm);
              letter-spacing: 0.02em;
              color: var(--color-gray-800);
            }

            .project-modal__details-content {
              line-height: 1.6;
            }

            .project-modal__tech-list {
              display: flex;
              gap: .5rem;
              flex-wrap: wrap;
            }

            .project-modal__placeholder {
              margin-top: 1.5rem;
              text-align: center;
              color: var(--color-gray-800);
            }

            /* Professional slider styles */
            .project-modal__slider {
                position: relative;
                width: 100%;
            }

            .slider-container {
                position: relative;
                width: 100%;
                border-radius: 0px;
                overflow: hidden;
                background: var(--color-gray-100);
                box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            }

            .slider-track {
                display: flex;
                transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                width: 100%;
            }

            .slider-img {
                width: 100%;
                height: auto;
                min-height: 400px;
                max-height: 500px;
                object-fit: contain;
                background: var(--color-gray-100);
                flex-shrink: 0;
                user-select: none;
            }

            /* Navigation controls overlay */
            .slider-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.95);
                color: var(--color-primary);
                border: 2px solid var(--color-gray-200);
                width: 48px;
                height: 48px;
                font-size: 1.5rem;
                font-weight: 600;
                cursor: pointer;
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 3;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(8px);
                box-shadow: 0 4px 16px rgba(0,0,0,0.1);
                padding: 0;
            }

            .slider-btn svg {
                width: 24px;
                height: 24px;
                display: block;
            }

            .slider-container:hover .slider-btn:not(:disabled) {
                opacity: 1;
            }

            .slider-btn--prev {
                left: 1rem;
            }

            .slider-btn--next {
                right: 1rem;
            }

            .slider-btn:hover:not(:disabled) {
                background: var(--color-accent);
                color: var(--color-white);
                border-color: var(--color-accent);
                transform: translateY(-50%) scale(1.05);
            }

            .slider-btn:disabled {
                opacity: 0 !important;
                cursor: not-allowed;
            }

            /* Image counter */
            .slider-counter {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(0, 0, 0, 0.75);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0px;
                font-size: 0.875rem;
                font-weight: 600;
                font-family: var(--font-mono);
                z-index: 3;
                backdrop-filter: blur(8px);
            }

            /* Modern navigation controls footer */
            .slider-controls {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                margin-top: 1.25rem;
                padding: 0 1rem;
            }

            .slider-dots {
                display: flex;
                gap: 0.625rem;
                align-items: center;
            }

            .slider-dot {
                width: 8px;
                height: 8px;
                border-radius: 0%;
                background: var(--color-gray-300);
                border: none;
                cursor: pointer;
                padding: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
            }

            .slider-dot:hover {
                background: var(--color-gray-800);
                transform: scale(1.2);
            }

            .slider-dot.active {
                background: var(--color-accent);
                width: 24px;
                border-radius: 0px;
            }

            .slider-dot:focus {
                outline: 2px solid var(--color-accent);
                outline-offset: 2px;
            }

            /* Fullscreen button */
            .slider-fullscreen {
                position: absolute;
                bottom: 1rem;
                right: 1rem;
                background: rgba(0, 0, 0, 0.75);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 0px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                transition: all 0.2s;
                z-index: 3;
                backdrop-filter: blur(8px);
                padding: 0;
            }

            .slider-fullscreen svg {
                width: 20px;
                height: 20px;
                display: block;
            }

            .slider-fullscreen:hover {
                background: rgba(0, 0, 0, 0.9);
                transform: scale(1.05);
            }

            /* Mobile optimizations */
            @media (max-width: 768px) {
                .slider-img {
                    min-height: 280px;
                    max-height: 350px;
                }

                .slider-btn {
                    width: 40px;
                    height: 40px;
                    font-size: 1.25rem;
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.9);
                }

                .slider-btn svg {
                    width: 20px;
                    height: 20px;
                }

                .slider-btn--prev {
                    left: 0.5rem;
                }

                .slider-btn--next {
                    right: 0.5rem;
                }

                .slider-counter {
                    font-size: 0.75rem;
                    padding: 0.375rem 0.75rem;
                    top: 0.75rem;
                    right: 0.75rem;
                }

                .slider-fullscreen {
                    width: 36px;
                    height: 36px;
                    bottom: 0.75rem;
                    right: 0.75rem;
                }
            }

            /* Animations */
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
      `;

        if (!document.querySelector("#modal-styles")) {
            const styleSheet = document.createElement("style");
            styleSheet.id = "modal-styles";
            styleSheet.textContent = modalStyles;
            document.head.appendChild(styleSheet);
        }

        document.body.appendChild(modal);
        document.body.style.overflow = "hidden";

        // Enhanced slider logic for Chevalet.co modal
        if (title === "Chevalet.co") {
            const sliderContainer = modal.querySelector('.slider-container');
            const track = modal.querySelector('.slider-track');
            const imgs = modal.querySelectorAll('.slider-img');
            const prevBtn = modal.querySelector('.slider-btn--prev');
            const nextBtn = modal.querySelector('.slider-btn--next');
            const dotsContainer = modal.querySelector('.slider-dots');
            const counter = modal.querySelector('.slider-counter');
            const currentSpan = counter.querySelector('.current');
            const fullscreenBtn = modal.querySelector('.slider-fullscreen');
            
            let idx = 0;
            let isTransitioning = false;
            let touchStartX = 0;
            let touchEndX = 0;

            // Create dots with enhanced interaction
            imgs.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'slider-dot';
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.setAttribute('role', 'tab');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
            const dots = modal.querySelectorAll('.slider-dot');

            function updateSlider() {
                if (isTransitioning) return;
                isTransitioning = true;
                
                // Smooth transition
                track.style.transform = `translateX(-${idx * 100}%)`;
                
                // Update controls
                prevBtn.disabled = idx === 0;
                nextBtn.disabled = idx === imgs.length - 1;
                
                // Update dots with animation
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === idx);
                    dot.setAttribute('aria-selected', i === idx);
                });
                
                // Update counter
                currentSpan.textContent = idx + 1;
                
                setTimeout(() => {
                    isTransitioning = false;
                }, 500);
            }

            function goToSlide(newIdx) {
                if (newIdx < 0 || newIdx >= imgs.length || newIdx === idx) return;
                idx = newIdx;
                updateSlider();
            }

            // Button navigation
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(idx - 1);
            });
            
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(idx + 1);
            });

            // Keyboard navigation
            const keyHandler = (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    goToSlide(idx - 1);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    goToSlide(idx + 1);
                }
            };
            document.addEventListener('keydown', keyHandler);

            // Enhanced touch/swipe support
            const handleTouchStart = (e) => {
                touchStartX = e.touches[0].clientX;
            };

            const handleTouchMove = (e) => {
                touchEndX = e.touches[0].clientX;
            };

            const handleTouchEnd = () => {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe left - next
                        goToSlide(idx + 1);
                    } else {
                        // Swipe right - previous
                        goToSlide(idx - 1);
                    }
                }
                
                touchStartX = 0;
                touchEndX = 0;
            };

            sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
            sliderContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
            sliderContainer.addEventListener('touchend', handleTouchEnd);

            // Fullscreen functionality
            fullscreenBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentImg = imgs[idx];
                
                // Create fullscreen overlay
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: zoom-out;
                    animation: fadeIn 0.2s ease-out;
                `;
                
                const fullImg = document.createElement('img');
                fullImg.src = currentImg.src;
                fullImg.alt = currentImg.alt;
                fullImg.style.cssText = `
                    max-width: 95%;
                    max-height: 95%;
                    object-fit: contain;
                    border-radius: 0px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                `;
                
                overlay.appendChild(fullImg);
                document.body.appendChild(overlay);
                
                const closeFullscreen = () => {
                    overlay.style.animation = 'fadeOut 0.2s ease-out';
                    setTimeout(() => overlay.remove(), 200);
                };
                
                overlay.addEventListener('click', closeFullscreen);
                document.addEventListener('keydown', function escFullscreen(e) {
                    if (e.key === 'Escape') {
                        closeFullscreen();
                        document.removeEventListener('keydown', escFullscreen);
                    }
                });
            });

            // Cleanup on modal close
            modal.addEventListener('remove', () => {
                document.removeEventListener('keydown', keyHandler);
            });

            // Initialize
            updateSlider();
        }

        // Close modal handlers
        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = "";
        };

        modal
            .querySelector(".project-modal__close")
            .addEventListener("click", closeModal);
        modal
            .querySelector(".project-modal__backdrop")
            .addEventListener("click", closeModal);

        document.addEventListener("keydown", function escHandler(e) {
            if (e.key === "Escape") {
                closeModal();
                document.removeEventListener("keydown", escHandler);
            }
        });
    }

    // ===== PARALLAX EFFECTS ===== //
    setupParallaxEffects() {
        const heroGrid = document.querySelector(".hero__grid");

        window.addEventListener("scroll", () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            if (heroGrid) {
                heroGrid.style.transform = `translateY(${rate}px)`;
            }
        });

        // Floating elements
        const floatingElements = document.querySelectorAll(".work__item");

        floatingElements.forEach((el, index) => {
            const speed = 0.02 + index * 0.01;
            const amplitude = 10 + index * 5;

            let animationId;
            const animate = () => {
                const time = Date.now() * speed;
                const y = Math.sin(time) * amplitude;
                el.style.transform = `translateY(${y}px)`;
                animationId = requestAnimationFrame(animate);
            };

            // Start animation when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
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
        window.addEventListener(
            "resize",
            this.debounce(() => {
                // Recalculate layouts if needed
                this.handleResize();
            }, 250),
        );

        // Form submissions (if any)
        document.querySelectorAll("form").forEach((form) => {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (e.key === "Tab") {
                document.body.classList.add("keyboard-navigation");
            }
        });

        document.addEventListener("click", () => {
            document.body.classList.remove("keyboard-navigation");
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
            document.body.classList.add("is-mobile");
        } else {
            document.body.classList.remove("is-mobile");
        }
    }

    handleFormSubmit(form) {
        // Mock form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "SENDING...";
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = "SENT!";
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
    const navLinks = Array.from(document.querySelectorAll(".nav__link"));
    const sectionIds = navLinks.map((link) =>
        link.getAttribute("href").replace("#", ""),
    );
    const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    function onScroll() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        let activeIdx = 0;
        for (let i = 0; i < sections.length; i++) {
            const rect = sections[i].getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionBottom = sectionTop + rect.height;
            // Section is in top half if its top is above middle and its bottom is below top
            if (
                scrollY + viewportHeight / 2 >= sectionTop &&
                scrollY < sectionBottom
            ) {
                activeIdx = i;
                break;
            }
        }
        navLinks.forEach((link, idx) => {
            if (idx === activeIdx) {
                link.classList.add("nav__link--active");
            } else {
                link.classList.remove("nav__link--active");
            }
        });
    }
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
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
        const images = document.querySelectorAll("img[data-src]");

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove("lazy");
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach((img) => imageObserver.observe(img));
    }

    setupPreloading() {
        // Preload critical resources
        const criticalResources = ["/styles/main.css", "/js/main.js"];

        criticalResources.forEach((resource) => {
            const link = document.createElement("link");
            link.rel = "preload";
            link.href = resource;
            link.as = resource.endsWith(".css") ? "style" : "script";
            document.head.appendChild(link);
        });
    }

    optimizeAnimations() {
        // Reduce animations for users who prefer reduced motion
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            document.body.classList.add("reduce-motion");
        }

        // Pause animations when page is not visible
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                document.body.classList.add("page-hidden");
            } else {
                document.body.classList.remove("page-hidden");
            }
        });
    }
}

// ===== PLUS GRID BACKGROUND ===== //
function setupPlusGridBackground() {
    const hero = document.getElementById("hero");
    if (!hero) return;

    // Configurable variables
    const PLUS_GRID_CONFIG = {
        cellSize: 30, // px
        color: "#2563eb",
        baseOpacity: 0.06,
        highlightOpacity: 0.33,
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: 1,
        transition: "opacity 0.18s",
        blendMode: "luminosity",
    };

    // Create grid container
    let grid = document.createElement("div");
    grid.className = "plus-grid-bg";
    grid.style.position = "absolute";
    grid.style.left = "0";
    grid.style.top = "0";
    grid.style.width = "100%";
    grid.style.height = "100%";
    grid.style.zIndex = "0";
    grid.style.overflow = "hidden";
    grid.style.pointerEvents = "none";
    grid.style.mixBlendMode = PLUS_GRID_CONFIG.blendMode;
    hero.prepend(grid);

    let plusEls = [];
    let cols = 0,
        rows = 0;

    function renderGrid() {
        plusEls.forEach((el) => el.remove());
        plusEls = [];
        const rect = hero.getBoundingClientRect();
        cols = Math.ceil(rect.width / PLUS_GRID_CONFIG.cellSize);
        rows = Math.ceil(rect.height / PLUS_GRID_CONFIG.cellSize);
        grid.style.width = rect.width + "px";
        grid.style.height = rect.height + "px";
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const plus = document.createElement("span");
                plus.textContent = "+";
                plus.style.position = "absolute";
                plus.style.left = col * PLUS_GRID_CONFIG.cellSize + "px";
                plus.style.top = row * PLUS_GRID_CONFIG.cellSize + "px";
                plus.style.width = PLUS_GRID_CONFIG.cellSize + "px";
                plus.style.height = PLUS_GRID_CONFIG.cellSize + "px";
                plus.style.display = "flex";
                plus.style.alignItems = "center";
                plus.style.justifyContent = "center";
                plus.style.fontSize = PLUS_GRID_CONFIG.fontSize + "px";
                plus.style.color = PLUS_GRID_CONFIG.color;
                plus.style.opacity = PLUS_GRID_CONFIG.baseOpacity;
                plus.style.transition = PLUS_GRID_CONFIG.transition;
                plus.style.fontWeight = PLUS_GRID_CONFIG.fontWeight;
                plus.style.letterSpacing =
                    PLUS_GRID_CONFIG.letterSpacing + "px";
                plus.style.userSelect = "none";
                plus.style.pointerEvents = "none";
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
                row: Math.floor(y / PLUS_GRID_CONFIG.cellSize),
            };
        }
        plusEls.forEach((plus, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const isActive =
                hoveredCell &&
                Math.abs(hoveredCell.row - row) <= 1 &&
                Math.abs(hoveredCell.col - col) <= 1;
            plus.style.opacity = isActive
                ? PLUS_GRID_CONFIG.highlightOpacity
                : PLUS_GRID_CONFIG.baseOpacity;
        });
    }

    renderGrid();
    window.addEventListener("resize", renderGrid);
    hero.addEventListener("mousemove", highlightGrid);
    hero.addEventListener("mouseleave", () => {
        plusEls.forEach(
            (plus) => (plus.style.opacity = PLUS_GRID_CONFIG.baseOpacity),
        );
    });
}

// ===== INITIALIZATION ===== //
document.addEventListener("DOMContentLoaded", () => {
    // Initialize the portfolio app
    const app = new PortfolioApp();

    // Initialize performance optimizations
    const performance = new PerformanceOptimizer();

    // Add loaded class to body for CSS transitions
    document.body.classList.add("loaded");

    // Console signature
    console.log(
        "%c🚀 Portfolio Loaded Successfully",
        "color: #ff6b35; font-size: 16px; font-weight: bold;",
    );
    console.log(
        "%cBuilt with Swiss precision and modern web technologies",
        "color: #666; font-size: 12px;",
    );
});

// ===== SERVICE WORKER REGISTRATION ===== //
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        // Service worker would be registered here for PWA functionality
        console.log("Ready for PWA enhancement");
    });
}
