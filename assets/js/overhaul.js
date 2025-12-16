// Premium Website Overhaul - Enhanced Interactions

(function() {
  'use strict';

  // ========================================
  // SCROLL PROGRESS BAR
  // ========================================
  function initScrollProgress() {
    const progressBar = document.querySelector('.read-progress');
    if (!progressBar) return;

    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ========================================
  // SCROLL TO TOP BUTTON
  // ========================================
  function initScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;

    function toggleVisibility() {
      if (window.pageYOffset > 500) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
  }

  // ========================================
  // PARALLAX EFFECTS
  // ========================================
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    function handleParallax() {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    }

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // ========================================
  // COUNTER ANIMATION
  // ========================================
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          animateCounter(entry.target);
          entry.target.classList.add('counted');
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  // ========================================
  // STAGGER ANIMATIONS
  // ========================================
  function initStaggerAnimations() {
    const staggerGroups = document.querySelectorAll('[data-stagger]');
    if (!staggerGroups.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, index * 100);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    staggerGroups.forEach(group => {
      Array.from(group.children).forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      });
      observer.observe(group);
    });
  }

  // ========================================
  // MAGNETIC BUTTONS
  // ========================================
  function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('[data-magnetic]');
    if (!magneticButtons.length) return;

    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });
  }

  // ========================================
  // SMOOTH REVEAL ON SCROLL
  // ========================================
  function initSmoothReveal() {
    const elements = document.querySelectorAll('[data-smooth-reveal]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(el);
    });
  }

  // Add revealed class styles
  const style = document.createElement('style');
  style.textContent = `
    [data-smooth-reveal].revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ========================================
  // CURSOR TRAIL (Optional Premium Effect)
  // ========================================
  function initCursorTrail() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch devices

    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail-dot';
      document.body.appendChild(dot);
      trail.push(dot);
    }

    const trailStyle = document.createElement('style');
    trailStyle.textContent = `
      .cursor-trail-dot {
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(79, 140, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: opacity 0.3s ease;
      }
    `;
    document.head.appendChild(trailStyle);

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateTrail() {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;

      trail.forEach((dot, index) => {
        const nextDot = trail[index + 1] || trail[0];
        const x = parseFloat(nextDot.style.left || currentX);
        const y = parseFloat(nextDot.style.top || currentY);

        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        dot.style.opacity = (1 - index / trailLength) * 0.5;
        dot.style.transform = `scale(${1 - index / trailLength})`;
      });

      trail[trail.length - 1].style.left = currentX + 'px';
      trail[trail.length - 1].style.top = currentY + 'px';

      requestAnimationFrame(animateTrail);
    }

    animateTrail();
  }

  // ========================================
  // TYPEWRITER EFFECT
  // ========================================
  function initTypewriter() {
    const elements = document.querySelectorAll('[data-typewriter]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
          typeWriter(entry.target);
          entry.target.classList.add('typed');
        }
      });
    }, { threshold: 0.5 });

    elements.forEach(el => observer.observe(el));
  }

  function typeWriter(element) {
    const text = element.dataset.typewriter;
    const speed = parseInt(element.dataset.typewriterSpeed) || 50;
    element.textContent = '';
    let i = 0;

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  // ========================================
  // ENHANCED FAQ ACCORDION
  // ========================================
  function initEnhancedFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const summary = item.querySelector('summary');
      const body = item.querySelector('.faq-body');

      item.addEventListener('toggle', () => {
        if (item.open) {
          // Close other items
          faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.open) {
              otherItem.open = false;
            }
          });

          // Animate opening
          body.style.maxHeight = body.scrollHeight + 'px';
        } else {
          body.style.maxHeight = '0';
        }
      });
    });
  }

  // ========================================
  // LAZY LOAD IMAGES WITH BLUR EFFECT
  // ========================================
  function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      img.style.filter = 'blur(10px)';
      img.style.transition = 'filter 0.5s ease';
      img.addEventListener('load', () => {
        img.style.filter = 'blur(0)';
      });
      imageObserver.observe(img);
    });
  }

  // ========================================
  // FLOATING LABELS FOR FORMS
  // ========================================
  function initFloatingLabels() {
    const inputs = document.querySelectorAll('.floating-input');
    if (!inputs.length) return;

    inputs.forEach(input => {
      const label = input.previousElementSibling;
      if (!label || label.tagName !== 'LABEL') return;

      function checkInput() {
        if (input.value) {
          label.classList.add('active');
        } else {
          label.classList.remove('active');
        }
      }

      input.addEventListener('focus', () => label.classList.add('active'));
      input.addEventListener('blur', checkInput);
      checkInput();
    });
  }

  // ========================================
  // TOOLTIP SYSTEM
  // ========================================
  function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    if (!tooltipElements.length) return;

    tooltipElements.forEach(el => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = el.dataset.tooltip;
      document.body.appendChild(tooltip);

      el.addEventListener('mouseenter', (e) => {
        const rect = el.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - 10 + 'px';
        tooltip.classList.add('visible');
      });

      el.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });

    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
      .tooltip {
        position: fixed;
        background: rgba(10, 16, 32, 0.95);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 13px;
        pointer-events: none;
        opacity: 0;
        transform: translate(-50%, -100%);
        transition: opacity 0.3s ease;
        z-index: 10000;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      .tooltip.visible {
        opacity: 1;
      }
    `;
    document.head.appendChild(tooltipStyle);
  }

  // ========================================
  // INITIALIZE ALL
  // ========================================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  function initAll() {
    initScrollProgress();
    initScrollToTop();
    initParallax();
    initCounters();
    initStaggerAnimations();
    initMagneticButtons();
    initSmoothReveal();
    initTypewriter();
    initEnhancedFAQ();
    initLazyLoad();
    initFloatingLabels();
    initTooltips();
    
    // Optional: Uncomment for cursor trail effect
    // initCursorTrail();

    console.log('✨ Premium interactions initialized');
  }

  init();
})();
