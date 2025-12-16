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
    if (meta) meta.setAttribute("content", mode === "light" ? "#f6f8ff" : "#0b1020");
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
  // Mobile nav drawer
  // ----------------------------
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navClose = document.querySelector("[data-nav-close]");
  const drawer = document.querySelector("[data-nav-drawer]");
  const scrim = document.querySelector("[data-nav-scrim]");

  function openNav() {
    if (!drawer || !scrim || !navToggle) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    scrim.hidden = false;
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    if (!drawer || !scrim || !navToggle) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    scrim.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (navToggle && drawer && scrim) {
    navToggle.addEventListener("click", () => {
      drawer.classList.contains("is-open") ? closeNav() : openNav();
    });
  }
  if (navClose) navClose.addEventListener("click", closeNav);
  if (scrim) scrim.addEventListener("click", closeNav);

  // Close drawer on navigation click
  if (drawer) {
    drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  }

  // Escape closes drawer and modal (modal also closes itself normally)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
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
        const stage = newBtn.closest(".shot-stage");
        const img = stage ? stage.querySelector("img") : null;
        if (img && img.getAttribute("src")) {
          openModal(img.getAttribute("src"), img.getAttribute("alt"));
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
    const track = slider.querySelector("[data-slider-track]");
    const slides = Array.from(slider.querySelectorAll("[data-slide]"));
    const dotsWrap = slider.querySelector("[data-slider-dots]");
    const prevBtn = slider.querySelector("[data-prev]");
    const nextBtn = slider.querySelector("[data-next]");

    let index = 0;
    let timer = null;
    const intervalMs = 4200;

    // Pause state (fixes “hover to stop” reliably)
    let pausedByHover = false;

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function start() {
      if (pausedByHover) return; // ✅ don't restart while hovered
      stop();
      timer = setInterval(() => go(index + 1), intervalMs);
    }

    function setPaused(p) {
      pausedByHover = p;
      if (pausedByHover) stop();
      else start();
    }

    // --- Dual copy elements (optional; only used if present in DOM) ---
    const dual = slider.querySelector('[data-dual-copy="addlog"]');
    let dualTimer = null;
    let dualState = 0; // 0 = primary, 1 = alt

    function primeDualBackups() {
      if (!dual) return;
      const eyebrow = dual.querySelector("[data-copy-eyebrow]");
      const title = dual.querySelector("[data-copy-title]");
      const desc = dual.querySelector("[data-copy-desc]");
      const points = dual.querySelector("[data-copy-points]");
      const chips = dual.querySelector("[data-copy-chips]");
      if (!eyebrow || !title || !desc || !points || !chips) return;

      if (!eyebrow.dataset.primary) eyebrow.dataset.primary = eyebrow.textContent;
      if (!title.dataset.primary) title.dataset.primary = title.textContent;
      if (!desc.dataset.primary) desc.dataset.primary = desc.textContent;
      if (!points.dataset.primary) points.dataset.primary = points.innerHTML;
      if (!chips.dataset.primary) chips.dataset.primary = chips.innerHTML;
    }

    function setDualToPrimary() {
      if (!dual) return;
      primeDualBackups();

      const eyebrow = dual.querySelector("[data-copy-eyebrow]");
      const title = dual.querySelector("[data-copy-title]");
      const desc = dual.querySelector("[data-copy-desc]");
      const points = dual.querySelector("[data-copy-points]");
      const chips = dual.querySelector("[data-copy-chips]");
      if (!eyebrow || !title || !desc || !points || !chips) return;

      dualState = 0;
      eyebrow.textContent = eyebrow.dataset.primary || eyebrow.textContent;
      title.textContent = title.dataset.primary || title.textContent;
      desc.textContent = desc.dataset.primary || desc.textContent;
      points.innerHTML = points.dataset.primary || points.innerHTML;
      chips.innerHTML = chips.dataset.primary || chips.innerHTML;
    }

    function setDualToAlt() {
      if (!dual) return;
      primeDualBackups();

      const altScript = dual.querySelector("[data-alt-copy]");
      if (!altScript) return;

      let alt = {};
      try {
        alt = JSON.parse(altScript.textContent || "{}");
      } catch {
        alt = {};
      }

      const eyebrow = dual.querySelector("[data-copy-eyebrow]");
      const title = dual.querySelector("[data-copy-title]");
      const desc = dual.querySelector("[data-copy-desc]");
      const points = dual.querySelector("[data-copy-points]");
      const chips = dual.querySelector("[data-copy-chips]");
      if (!eyebrow || !title || !desc || !points || !chips) return;

      dualState = 1;
      eyebrow.textContent = alt.eyebrow || "Narration";
      title.textContent = alt.title || "";
      desc.textContent = alt.desc || "";

      const pts = Array.isArray(alt.points) ? alt.points : [];
      points.innerHTML = pts.map((p) => `<li>${p}</li>`).join("");

      const ch = Array.isArray(alt.chips) ? alt.chips : [];
      chips.innerHTML = ch.map((c) => `<span class="chip">${c}</span>`).join("");
    }

    function stopDualRotation() {
      if (dualTimer) clearInterval(dualTimer);
      dualTimer = null;
    }

    function startDualRotation() {
      if (!dual) return;
      stopDualRotation();
      primeDualBackups();
      dualTimer = setInterval(() => {
        // only on AddLog slide; we assume it is slide index 1 (second slide)
        if (index !== 1) return;
        if (pausedByHover) return;
        if (dualState === 0) setDualToAlt();
        else setDualToPrimary();
      }, 3200);
    }

    function go(i) {
      if (!track || !slides.length) return;

      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(${-index * 100}%)`;

      if (dotsWrap) {
        dotsWrap.querySelectorAll("button").forEach((b, bi) => {
          b.setAttribute("aria-selected", bi === index ? "true" : "false");
          b.classList.toggle("is-active", bi === index);
        });
      }

      slides.forEach((s, si) => s.setAttribute("aria-hidden", si === index ? "false" : "true"));

      // Reset dual copy whenever the slide changes
      if (dual) {
        setDualToPrimary();
      }
    }

    // Dots
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "dot";
        b.setAttribute("aria-label", `Go to slide ${i + 1}`);
        b.setAttribute("aria-selected", i === 0 ? "true" : "false");
        b.addEventListener("click", () => {
          go(i);
          start(); // may be ignored if pausedByHover
        });
        dotsWrap.appendChild(b);
      });
    }

    // Controls
    if (prevBtn) prevBtn.addEventListener("click", () => { go(index - 1); start(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { go(index + 1); start(); });

    // Pause on hover/focus (robust)
    const pause = () => setPaused(true);
    const resume = () => setPaused(false);

    slider.addEventListener("pointerenter", pause, true);
    slider.addEventListener("pointerleave", resume, true);
    slider.addEventListener("mouseenter", pause, true);
    slider.addEventListener("mouseleave", resume, true);
    slider.addEventListener("focusin", pause, true);
    slider.addEventListener("focusout", resume, true);

    // Swipe
    let startX = 0, dx = 0, down = false;
    track?.addEventListener("pointerdown", (e) => {
      down = true;
      startX = e.clientX;
      dx = 0;
      track.setPointerCapture(e.pointerId);
    });
    track?.addEventListener("pointermove", (e) => {
      if (!down) return;
      dx = e.clientX - startX;
    });
    track?.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      start();
    });

    // Init
    go(0);
    start();
    startDualRotation();
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
