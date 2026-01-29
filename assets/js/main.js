// Dear Diary — modern JS (theme toggle + year + reveal + slider + mobile nav + lightbox + dual-copy)
console.log("🔵 main.js is loading...");
(function () {
  console.log("🔵 main.js IIFE started");
  const root = document.documentElement;

  // ----------------------------
  // Theme toggle
  // ----------------------------
  const stored = localStorage.getItem("dd-theme");
  const prefersLight =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;

  function setTheme(mode) {
    root.setAttribute("data-theme", mode);
    localStorage.setItem("dd-theme", mode);

    document.querySelectorAll("[data-theme-label]").forEach((label) => {
      label.textContent = mode === "light" ? "Light" : "Dark";
    });

    document.querySelectorAll("[data-theme-icon]").forEach((icon) => {
      icon.textContent = mode === "light" ? "☀️" : "🌙";
    });

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", mode === "light" ? "#FFFDF5" : "#0A2540");

    // Dynamic Screenshot Swap (Premium Feature)
    const screenshots = document.querySelectorAll('img[data-screenshot]');
    screenshots.forEach(img => {
        const currentSrc = img.src;
        if (mode === 'light') {
            // Switch to Light (.jpg) - handle both png and jpg origins
            // Preload technique: just swap src, browser handles mostly well, 
            // but for "true" preload we'd create an Image object. 
            // Given "instant feeling", direct swap is preferred.
            if (currentSrc.includes('_dark')) {
                img.src = currentSrc.replace('_dark.png', '_light.jpg').replace('_dark.jpg', '_light.jpg');
            }
        } else {
            // Switch to Dark (.png)
            if (currentSrc.includes('_light')) {
                img.src = currentSrc.replace('_light.jpg', '_dark.png'); 
            }
        }
    });
  }

  if (stored === "light" || stored === "dark") setTheme(stored);
  else setTheme(prefersLight ? "light" : "dark");

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      setTheme(current === "light" ? "dark" : "light");
    });
  });

  // Year
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  // Smooth anchor scrolling (ignore external links)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  // ----------------------------
  // Scroll reveal
  // ----------------------------
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // ----------------------------
  // Mobile nav drawer - CLEAN REBUILD
  // ----------------------------
  console.log("🔧 Setting up mobile navigation...");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navClose = document.querySelector("[data-nav-close]");
  const drawer = document.querySelector("[data-nav-drawer]");
  const scrim = document.querySelector("[data-nav-scrim]");
  
  console.log("Nav elements found:", {
    navToggle: !!navToggle,
    navClose: !!navClose,
    drawer: !!drawer,
    scrim: !!scrim
  });

  function openNav() {
    console.log("📂 Opening nav");
    if (!drawer || !scrim) return;
    drawer.classList.add("is-open");
    scrim.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    console.log("❌ Closing nav");
    if (!drawer || !scrim) return;
    drawer.classList.remove("is-open");
    scrim.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

  // Toggle button
  if (navToggle) {
    console.log("✅ Attaching click handler to nav toggle");
    navToggle.addEventListener("click", (e) => {
      console.log("🔴 Nav toggle clicked!");
      e.preventDefault();
      e.stopPropagation();
      if (drawer.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });
  } else {
    console.log("❌ Nav toggle button NOT found!");
  }

  // Close button
  if (navClose) {
    navClose.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeNav();
    });
  }

  // Scrim click closes drawer
  if (scrim) {
    scrim.addEventListener("click", () => {
      closeNav();
    });
  }

  // Handle all drawer link clicks
  if (drawer) {
    const allLinks = drawer.querySelectorAll("a");
    
    allLinks.forEach((link) => {
      link.addEventListener("click", function(e) {
        const href = this.getAttribute("href");
        
        // If it's a hash/anchor link
        if (href && href.startsWith("#")) {
          e.preventDefault();
          closeNav();
          
          // Wait for drawer to close, then scroll
          setTimeout(() => {
            const target = document.querySelector(href);
            if (target) {
              const headerOffset = 80;
              const elementPosition = target.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              
              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
              });
              
              window.location.hash = href;
            }
          }, 300);
        } else {
          // Regular link - just close drawer and let it navigate
          closeNav();
        }
      });
    });
  }

  // Escape key closes drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) {
      closeNav();
    }
  });

  // ----------------------------
  // Lightbox modal for screenshots with navigation
  // ----------------------------
  console.log("🚀 Modal code starting...");
  const modal = document.querySelector("[data-modal]");
  const modalImg = document.querySelector("[data-modal-img]");
  const openGallery = document.querySelector("[data-open-gallery]");
  const modalPrev = document.querySelector("[data-modal-prev]");
  const modalNext = document.querySelector("[data-modal-next]");
  const modalCounter = document.querySelector("[data-modal-counter]");
  console.log("📍 Elements found:", {modal: !!modal, modalImg: !!modalImg, modalPrev: !!modalPrev, modalNext: !!modalNext});
  
  let allImages = [];
  let currentImageIndex = 0;

  // Gather all screenshot images
  function collectImages() {
    allImages = Array.from(document.querySelectorAll(".shot-stage img")).map(img => ({
      src: img.src,
      alt: img.alt || "Screenshot"
    }));
    console.log("Collected images:", allImages.length);
  }
  collectImages();

  function updateModalImage() {
    if (!modalImg || allImages.length === 0) {
      console.log("Update failed: modalImg or allImages missing");
      return;
    }
    const current = allImages[currentImageIndex];
    console.log(`Updating to image ${currentImageIndex + 1}/${allImages.length}: ${current.src}`);
    
    modalImg.src = current.src;
    modalImg.alt = current.alt;
    
    // Update counter
    if (modalCounter) {
      modalCounter.textContent = `${currentImageIndex + 1} / ${allImages.length}`;
    }
    
    // Update button states
    if (modalPrev) {
      modalPrev.disabled = currentImageIndex === 0;
      modalPrev.style.opacity = currentImageIndex === 0 ? '0.4' : '1';
    }
    if (modalNext) {
      modalNext.disabled = currentImageIndex === allImages.length - 1;
      modalNext.style.opacity = currentImageIndex === allImages.length - 1 ? '0.4' : '1';
    }
  }

  function openModal(src, alt) {
    if (!modal || !modalImg || !src) return;
    
    // Find the index of the clicked image - compare by checking if src contains the image name
    currentImageIndex = allImages.findIndex(img => img.src.includes(src.split('/').pop()));
    if (currentImageIndex === -1) currentImageIndex = 0;
    
    console.log("Opening modal at index:", currentImageIndex);
    updateModalImage();
    if (typeof modal.showModal === "function") modal.showModal();
  }

  // Modal navigation - using direct assignment instead of checking conditions
  if (modalPrev) {
    console.log("modalPrev button found");
    modalPrev.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Prev clicked, current index:", currentImageIndex);
      if (currentImageIndex > 0) {
        currentImageIndex--;
        updateModalImage();
      }
      return false;
    };
  } else {
    console.log("modalPrev button NOT found");
  }

  if (modalNext) {
    console.log("modalNext button found");
    modalNext.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Next clicked, current index:", currentImageIndex);
      if (currentImageIndex < allImages.length - 1) {
        currentImageIndex++;
        updateModalImage();
      }
      return false;
    };
  } else {
    console.log("modalNext button NOT found");
  }

  // Keyboard navigation
  if (modal) {
    modal.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && currentImageIndex > 0) {
        currentImageIndex--;
        updateModalImage();
      } else if (e.key === "ArrowRight" && currentImageIndex < allImages.length - 1) {
        currentImageIndex++;
        updateModalImage();
      }
    });
  }

  // Zoom buttons inside slides
  function wireZoomButtons() {
    document.querySelectorAll("[data-zoom]").forEach((btn) => {
      // Remove disabled attribute to make all zoom buttons functional
      btn.removeAttribute("disabled");
      
      // Remove existing listeners to avoid duplicates
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        collectImages();
        const stage = newBtn.closest(".shot-stage");
        const img = stage ? stage.querySelector("img") : null;
        if (img && img.src) {
          openModal(img.src, img.getAttribute("alt"));
        }
      });
    });
  }
  wireZoomButtons();

  // “View all” opens first available screenshot
  if (openGallery) {
    openGallery.addEventListener("click", () => {
      if (allImages.length > 0) {
        currentImageIndex = 0;
        openModal(allImages[0].src, allImages[0].alt);
      }
    });
  }

  // ----------------------------
  // Screenshot slideshow + dual copy (AddLog ↔ Narration)
  // ----------------------------
  const slider = document.querySelector("[data-slider]");
  if (slider) {
    // --- REFACTORED SLIDER LOGIC ---
    // Select all slides
    const track = slider.querySelector("[data-slider-track]");
    const slides = Array.from(slider.querySelectorAll("[data-slide]"));
    const dotsWrap = slider.querySelector("[data-slider-dots]");
    let index = 0;
    let timer = null;
    const intervalMs = 6000;
    let isPaused = false;

    // 1. Initialize
    function init() {
      // Set initial state
      updateSlideState(0);
      startTimer();
      
      // Event Delegation for Controls (Robust)
      slider.addEventListener("click", (e) => {
        const nextBtn = e.target.closest("[data-next]");
        const prevBtn = e.target.closest("[data-prev]");
        const dotBtn = e.target.closest(".dot");

        if (nextBtn) {
          nextSlide();
          resetTimer();
        } else if (prevBtn) {
          prevSlide();
          resetTimer();
        } else if (dotBtn) {
          const newIndex = parseInt(dotBtn.dataset.index);
          if (!isNaN(newIndex)) {
             goToSlide(newIndex);
             resetTimer();
          }
        }
      });

      // Gestures (Touch) - Improved for mobile
      let touchStartX = 0;
      let touchStartY = 0;
      let isSwiping = false;
      
      slider.addEventListener("touchstart", e => {
          touchStartX = e.changedTouches[0].screenX;
          touchStartY = e.changedTouches[0].screenY;
          isSwiping = false;
          isPaused = true;
          stopTimer();
      }, {passive: true});
      
      slider.addEventListener("touchmove", e => {
          if (!isSwiping) {
              const touchMoveX = e.changedTouches[0].screenX;
              const touchMoveY = e.changedTouches[0].screenY;
              const deltaX = Math.abs(touchMoveX - touchStartX);
              const deltaY = Math.abs(touchMoveY - touchStartY);
              
              // Only capture horizontal swipes (not vertical scrolling)
              if (deltaX > deltaY && deltaX > 10) {
                  isSwiping = true;
              }
          }
      }, {passive: true});
      
      slider.addEventListener("touchend", e => {
          if (isSwiping) {
              const touchEndX = e.changedTouches[0].screenX;
              handleSwipe(touchStartX, touchEndX);
          }
          isPaused = false;
          isSwiping = false;
          startTimer();
      }, {passive: true});

      // Hover Pause
      slider.addEventListener("mouseenter", () => { isPaused = true; stopTimer(); });
      slider.addEventListener("mouseleave", () => { isPaused = false; startTimer(); });
    }

    function goToSlide(i) {
        // Loop logic
        let newIndex = i;
        if (newIndex >= slides.length) newIndex = 0;
        if (newIndex < 0) newIndex = slides.length - 1;

        // Apply
        updateSlideState(newIndex);
    }

    function nextSlide() { goToSlide(index + 1); }
    function prevSlide() { goToSlide(index - 1); }

    function updateSlideState(newIndex) {
        const oldIndex = index;
        index = newIndex;

        // CSS State Management
        slides.forEach((slide, i) => {
            slide.classList.remove("active", "exit-left");
            slide.setAttribute("aria-hidden", i === index ? "false" : "true");
            
            if (i === index) {
                slide.classList.add("active");
            }
        });

        // Desktop Exit Animation (only if moving forward roughly)
        /* 
           Simpler exit logic: Just clear previous. 
           The CSS transitions on .active and default opacity handle the crossfade.
           If we really want the "slide out left", we need to know direction.
        */
        if (window.innerWidth >= 900 && index !== oldIndex) {
             // If we ruled that we are moving 'next'
             // slides[oldIndex].classList.add("exit-left"); 
        }
        
        // Dots
        if (dotsWrap) {
          renderDots();
        }

        // Mobile Scroll Sync - DISABLED on mobile, using display instead
        // On mobile we show/hide slides with display:none/block for better compatibility
        // Desktop uses transform for smooth transitions
        if (window.innerWidth < 900) {
             // Don't use transform on mobile - CSS handles visibility with display property
             const track = slider.querySelector("[data-slider-track]");
             if (track) {
                 track.style.transform = 'none';
             }
        }
        
        // Dual Copy Sync logic remains if needed, simply called here
        if (typeof startDualRotation === 'function') startDualRotation();
    }

    function renderDots() {
        if (!dotsWrap) return;
        // Only build once if empty, else just update
        if (dotsWrap.children.length !== slides.length) {
            dotsWrap.innerHTML = "";
            slides.forEach((_, i) => {
                const b = document.createElement("button");
                b.className = "dot";
                b.dataset.index = i;
                b.setAttribute("aria-label", `Go to slide ${i + 1}`);
                dotsWrap.appendChild(b);
            });
        }
        
        Array.from(dotsWrap.children).forEach((dot, i) => {
            dot.classList.toggle("is-active", i === index);
            dot.setAttribute("aria-selected", i === index);
        });
    }

    function handleSwipe(start, end) {
        if (start - end > 50) nextSlide();
        if (end - start > 50) prevSlide();
    }

    function startTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            if (!isPaused) nextSlide();
        }, intervalMs);
    }
    
    function stopTimer() {
        if (timer) clearInterval(timer);
    }
    
    function resetTimer() {
        stopTimer();
        startTimer();
    }

    // --- Dual Copy Logic (Integrated) ---
    let dualTimer = null;
    let dualState = 0; // 0 = primary, 1 = alt

    function startDualRotation() {
      // Logic: Only run if on slide index 1 (the addlog/dual slide)
      if (index !== 1) {
        stopDualRotation();
        setDualToPrimary();
        return;
      }

      // If already running, do nothing (or reset?) - let's ensure fresh start
      stopDualRotation();
      
      // Start interval
      dualTimer = setInterval(() => {
        if (isPaused) return; 
        if (dualState === 0) setDualToAlt();
        else setDualToPrimary();
      }, 3000); // 3 seconds per flip
    }

    function stopDualRotation() {
      if (dualTimer) clearInterval(dualTimer);
      dualTimer = null;
    }

    function setDualToPrimary() {
      const dual = slider.querySelector('[data-dual-copy="addlog"]');
      if (!dual) return;
      
      // Elements
      const eyebrow = dual.querySelector("[data-copy-eyebrow]");
      const title = dual.querySelector("[data-copy-title]");
      const desc = dual.querySelector("[data-copy-desc]");
      const points = dual.querySelector("[data-copy-points]");
      const chips = dual.querySelector("[data-copy-chips]");
      if (!eyebrow) return; // safety check

      // Backup Primary Content ONCE
      if (!eyebrow.dataset.primary) {    
          eyebrow.dataset.primary = eyebrow.textContent;
          title.dataset.primary = title.textContent;
          desc.dataset.primary = desc.textContent;
          points.dataset.primary = points.innerHTML;
          chips.dataset.primary = chips.innerHTML;
      }

      dualState = 0;
      eyebrow.textContent = eyebrow.dataset.primary;
      title.textContent = title.dataset.primary;
      desc.textContent = desc.dataset.primary;
      points.innerHTML = points.dataset.primary;
      chips.innerHTML = chips.dataset.primary;
    }

    function setDualToAlt() {
      const dual = slider.querySelector('[data-dual-copy="addlog"]');
      if (!dual) return;
      
      // Ensure backup happens first
      const eyebrow = dual.querySelector("[data-copy-eyebrow]");
      if (eyebrow && !eyebrow.dataset.primary) setDualToPrimary();

      // Read JSON
      const altScript = dual.querySelector("[data-alt-copy]");
      if (!altScript) return;
      let alt = {};
      try { alt = JSON.parse(altScript.textContent || "{}"); } catch { alt = {}; }

      // Elements
      const title = dual.querySelector("[data-copy-title]");
      const desc = dual.querySelector("[data-copy-desc]");
      const points = dual.querySelector("[data-copy-points]");
      const chips = dual.querySelector("[data-copy-chips]");

      dualState = 1;
      if (eyebrow) eyebrow.textContent = alt.eyebrow || "Narration";
      if (title) title.textContent = alt.title || "";
      if (desc) desc.textContent = alt.desc || "";
      
      if (points) {
        const pts = Array.isArray(alt.points) ? alt.points : [];
        points.innerHTML = pts.map((p) => `<li>${p}</li>`).join("");
      }
      
      if (chips) {
        const ch = Array.isArray(alt.chips) ? alt.chips : [];
        chips.innerHTML = ch.map((c) => `<span class="chip">${c}</span>`).join("");
      }
    }

    // Start
    init();
    // Kickoff dual logic check immediately (in case start index is 1, though usually 0)
    startDualRotation();
  }

  // ----------------------------
  // Screenshot Management System
  // ----------------------------
  const screenshotData = {
    dashboard: {
      mobile: {
        dark: 'assets/img/screenshots/mobile_screenshots/dd_dashboardscreen_mobile_dark.png',
        light: 'assets/img/screenshots/mobile_screenshots/dd_dashboardscreen_mobile_light.png'
      },
      tablet: {
        dark: 'assets/img/screenshots/tablet_screenshots/dd_dashboardscreen_tablet_dark.png',
        light: 'assets/img/screenshots/tablet_screenshots/dd_dashboardscreen_tablet_light.png'
      }
    },
    addlog: {
      mobile: {
        dark: 'assets/img/screenshots/mobile_screenshots/dd_addlogscreen_mobile_dark.png',
        light: 'assets/img/screenshots/mobile_screenshots/dd_addlogscreen_mobile_light.png'
      },
      tablet: {
        dark: 'assets/img/screenshots/tablet_screenshots/dd_addlogscreen_tablet_dark.png',
        light: 'assets/img/screenshots/tablet_screenshots/dd_addlogscreen_tablet_light.png'
      }
    },
    calendar: {
      mobile: {
        dark: 'assets/img/screenshots/mobile_screenshots/dd_calendarscreen_mobile_dark.png',
        light: 'assets/img/screenshots/mobile_screenshots/dd_calendarscreen_mobile_light.png'
      },
      tablet: {
        dark: 'assets/img/screenshots/tablet_screenshots/dd_calendarscreen_tablet_dark.png',
        light: 'assets/img/screenshots/tablet_screenshots/dd_calendarscreen_tablet_light.png'
      }
    },
    moodtracker: {
      mobile: {
        dark: 'assets/img/screenshots/mobile_screenshots/dd_moodtrackerscreen_mobile_dark.png',
        light: 'assets/img/screenshots/mobile_screenshots/dd_moodtrackerscreen_mobile_light.png'
      },
      tablet: {
        dark: 'assets/img/screenshots/tablet_screenshots/dd_moodtrackerscreen_tablet_dark.png',
        light: 'assets/img/screenshots/tablet_screenshots/dd_moodtrackerscreen_tablet_light.png'
      }
    },
    moodinsights: {
      mobile: {
        dark: 'assets/img/screenshots/mobile_screenshots/dd_moodinsightsscreen_mobile_dark.png',
        light: 'assets/img/screenshots/mobile_screenshots/dd_moodinsightsscreen_mobile_light.png'
      },
      tablet: {
        dark: 'assets/img/screenshots/tablet_screenshots/dd_moodinsightsscreen_tablet_dark.png',
        light: 'assets/img/screenshots/tablet_screenshots/dd_moodinsightsscreen_tablet_light.png'
      }
    },
    quicknotes: {
      mobile: {
        dark: 'assets/img/screenshots/mobile_screenshots/dd_quicknotesscreen_mobile_dark.png',
        light: 'assets/img/screenshots/mobile_screenshots/dd_quicknotesscreen_mobile_light.png'
      },
      tablet: {
        dark: 'assets/img/screenshots/tablet_screenshots/dd_quicknotescreen_tablet_dark.png',
        light: 'assets/img/screenshots/tablet_screenshots/dd_quicknotescreen_tablet_light.png'
      }
    }
  };

  let currentDevice = localStorage.getItem('dd-device') || 'mobile';

  function updateScreenshots() {
    const theme = root.getAttribute('data-theme') || 'dark';
    const screenshots = document.querySelectorAll('[data-screenshot]');
    
    screenshots.forEach(img => {
      const screenName = img.getAttribute('data-screenshot');
      if (screenshotData[screenName] && screenshotData[screenName][currentDevice]) {
        const newSrc = screenshotData[screenName][currentDevice][theme];
        // Check using endsWith to handle absolute vs relative paths
        if (!img.src.endsWith(newSrc)) {
          img.classList.add('loading');
          const preload = new Image();
          preload.onload = () => {
            img.src = newSrc;
            setTimeout(() => img.classList.remove('loading'), 50);
          };
          preload.src = newSrc;
        }
      }
    });
  }

  // Device toggle functionality
  const deviceToggleBtns = document.querySelectorAll('[data-device]');
  deviceToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const device = btn.getAttribute('data-device');
      if (device === currentDevice) return;
      
      currentDevice = device;
      localStorage.setItem('dd-device', device);
      
      // Update button states
      deviceToggleBtns.forEach(b => {
        const isActive = b.getAttribute('data-device') === device;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      
      // Update screenshots
      updateScreenshots();
    });
    
    // Set initial state
    if (btn.getAttribute('data-device') === currentDevice) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    }
  });

  // Enhance theme toggle to update screenshots
  const originalSetTheme = setTheme;
  setTheme = function(mode) {
    originalSetTheme(mode);
    updateScreenshots();
  };

  // Initial screenshot load
  updateScreenshots();

  // Reveal device selector
  const deviceSelector = document.querySelector('.device-selector');
  if (deviceSelector && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-visible');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(deviceSelector);
  } else if (deviceSelector) {
    deviceSelector.classList.add('is-visible');
  }

  // ----------------------------
  // Enhanced Image Lazy Loading
  // ----------------------------
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    });
  }

  // ----------------------------
  // Smooth Scroll Enhancements
  // ----------------------------
  const scrollToTop = document.querySelector('.scroll-to-top');
  if (scrollToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollToTop.style.opacity = '1';
        scrollToTop.style.pointerEvents = 'auto';
      } else {
        scrollToTop.style.opacity = '0';
        scrollToTop.style.pointerEvents = 'none';
      }
    });
    
    scrollToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ----------------------------
  // Scroll hint (for privacy/terms pages)
  // ----------------------------
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    let hasScrolled = false;
    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 50) {
        hasScrolled = true;
        scrollHint.classList.add('hidden');
        // Remove listener after hiding
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    // Also hide on click
    scrollHint.addEventListener('click', () => {
      window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    });
  }
})();
