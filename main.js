document.addEventListener('DOMContentLoaded', () => {
  // --- Header & Scroll Sentinel Intersection Observer ---
  const header = document.querySelector('.header');
  const sentinel = document.getElementById('scroll-sentinel');
  if (header && sentinel && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { root: null, threshold: 0 });
    observer.observe(sentinel);
  } else if (header) {
    // Fallback scroll listener (throttled with requestAnimationFrame)
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --- Mobile Menu Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Create an overlay for the mobile menu backdrop
  const menuOverlay = document.createElement('div');
  menuOverlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    backdrop-filter: blur(2px); z-index: 1999;
    opacity: 0; pointer-events: none;
    transition: opacity 0.35s ease;
  `;
  document.body.appendChild(menuOverlay);

  const openMenu = () => {
    navMenu.classList.add('open');
    if (header) header.classList.add('menu-open');
    navToggle.innerHTML = '<i class="ph ph-x"></i>';
    menuOverlay.style.opacity = '1';
    menuOverlay.style.pointerEvents = 'all';
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    navMenu.classList.remove('open');
    if (header) header.classList.remove('menu-open');
    navToggle.innerHTML = '<i class="ph ph-list"></i>';
    menuOverlay.style.opacity = '0';
    menuOverlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
    menuOverlay.addEventListener('click', closeMenu);
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }


  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPanel = item.querySelector('.faq-answer-panel');
    
    if (questionBtn && answerPanel) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(i => {
          i.classList.remove('active');
          const panel = i.querySelector('.faq-answer-panel');
          if (panel) panel.style.maxHeight = null;
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
        }
      });
    }
  });

  // --- Custom Tour Stepper Builder ---
  const customTourForm = document.getElementById('custom-tour-form');
  if (customTourForm) {
    const steps = Array.from(document.querySelectorAll('.form-step-panel'));
    const stepNodes = Array.from(document.querySelectorAll('.step-node'));
    const lineActive = document.querySelector('.stepper-line-active');
    
    let currentStep = 0;

    const updateStepperUI = () => {
      // Show active panel
      steps.forEach((step, idx) => {
        if (idx === currentStep) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });

      // Update stepper nodes
      stepNodes.forEach((node, idx) => {
        if (idx < currentStep) {
          node.classList.add('completed');
          node.classList.remove('active');
        } else if (idx === currentStep) {
          node.classList.add('active');
          node.classList.remove('completed');
        } else {
          node.classList.remove('active', 'completed');
        }
      });

      // Update stepper line
      if (lineActive && stepNodes.length > 1) {
        const percentage = (currentStep / (stepNodes.length - 1)) * 100;
        lineActive.style.width = percentage + '%';
      }

      // Scroll to form top smoothly
      const formCard = document.querySelector('.form-card');
      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Option Cards selections
    const optionContainers = document.querySelectorAll('.option-grid');
    optionContainers.forEach(container => {
      const cards = container.querySelectorAll('.option-card');
      const hiddenInput = container.querySelector('input[type="hidden"]');
      
      cards.forEach(card => {
        card.addEventListener('click', () => {
          // Remove active from sibling cards in this grid
          cards.forEach(c => c.classList.remove('active'));
          // Set current card to active
          card.classList.add('active');
          
          // Save value in hidden input if exists
          if (hiddenInput) {
            hiddenInput.value = card.dataset.value;
          }
        });
      });
    });

    // Next Button Actions
    const nextButtons = document.querySelectorAll('.btn-next-step');
    nextButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Simple step validation (e.g. check if required inputs are filled or options selected)
        const currentPanel = steps[currentStep];
        const requiredInputs = currentPanel.querySelectorAll('[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--error)';
            input.addEventListener('input', function checkFilled() {
              if (this.value.trim()) {
                this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                this.removeEventListener('input', checkFilled);
              }
            });
          }
        });

        // Check if option-grid has selected choice if required
        const hiddenRequired = currentPanel.querySelectorAll('input[type="hidden"][required]');
        hiddenRequired.forEach(input => {
          if (!input.value) {
            isValid = false;
            const grid = input.closest('.option-grid');
            if (grid) {
              grid.style.outline = '1px solid var(--error)';
              grid.style.borderRadius = 'var(--radius-default)';
              grid.addEventListener('click', function clearOutline() {
                grid.style.outline = 'none';
                grid.removeEventListener('click', clearOutline);
              });
            }
          }
        });

        if (!isValid) {
          alert('Please fill out all required fields on this step.');
          return;
        }

        if (currentStep < steps.length - 1) {
          currentStep++;
          updateStepperUI();
        }
      });
    });

    // Prev Button Actions
    const prevButtons = document.querySelectorAll('.btn-prev-step');
    prevButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentStep > 0) {
          currentStep--;
          updateStepperUI();
        }
      });
    });

    // Form Submit Action
    customTourForm.addEventListener('submit', (e) => {
      // Let it submit or simulate success
      e.preventDefault();
      
      // Collect values and display success modal or alert
      const formData = new FormData(customTourForm);
      const data = {};
      formData.forEach((value, key) => { data[key] = value; });
      
      console.log('Submitted custom tour planning data:', data);
      
      // Simulate success message
      const formContent = document.querySelector('.form-card');
      if (formContent) {
        formContent.innerHTML = `
          <div class="text-center py-12 animate-fade-in" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;">
            <div style="width: 80px; height: 80px; background-color: rgba(16, 185, 129, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #10b981; font-size: 40px; margin-bottom: 8px;">
              <i class="ph ph-check-circle"></i>
            </div>
            <h2 class="display-lg-mobile text-snow-peak font-bold">Request Submitted!</h2>
            <p class="body-md text-muted" style="max-width: 500px; margin: 0 auto; color: rgba(255,255,255,0.7) !important;">
              Thank you for choosing Me Time We Time. Our travel planners are already working on your custom Northern Pakistan itinerary. We will contact you via email or phone within the next 24 hours.
            </p>
            <a href="index.html" class="btn btn-secondary mt-6" style="text-decoration: none;">Return Home</a>
          </div>
        `;
      }
    });

    // Initialize stepper
    updateStepperUI();
  }

  // --- Dynamic Tours Page Filter Logic ---
  const searchInput = document.getElementById('tour-search');
  const locationSelect = document.getElementById('tour-location');
  const durationSelect = document.getElementById('tour-duration');
  const levelSelect = document.getElementById('tour-level');
  const typeSelect = document.getElementById('tour-type');
  const filterPills = document.querySelectorAll('.filter-pill');
  const tourCountText = document.getElementById('tour-count');
  
  if (searchInput || locationSelect || durationSelect || levelSelect || typeSelect || filterPills.length > 0) {
    const tourCards = document.querySelectorAll('article.tour-card');
    
    const filterTours = () => {
      let activePillType = 'all';
      filterPills.forEach(pill => {
        if (pill.classList.contains('active')) {
          activePillType = pill.dataset.filter;
        }
      });

      const query = searchInput ? searchInput.value.toLowerCase() : '';
      const location = locationSelect ? locationSelect.value.toLowerCase() : 'all';
      const duration = durationSelect ? durationSelect.value.toLowerCase() : 'all';
      const level = levelSelect ? levelSelect.value.toLowerCase() : 'all';
      const type = typeSelect ? typeSelect.value.toLowerCase() : 'all';

      let visibleCount = 0;

      tourCards.forEach(card => {
        let show = true;

        // 1. Text Search Query
        const titleText = card.querySelector('.tour-title')?.textContent.toLowerCase() || '';
        const highlightText = Array.from(card.querySelectorAll('.tour-highlights li')).map(li => li.textContent.toLowerCase()).join(' ');
        const cardMetaText = card.querySelector('.tour-meta')?.textContent.toLowerCase() || '';
        const fullText = `${titleText} ${highlightText} ${cardMetaText}`;
        if (query && !fullText.includes(query)) {
          show = false;
        }

        // 2. Location filter
        if (location !== 'all' && location !== 'all locations') {
          if (!fullText.includes(location)) show = false;
        }

        // 3. Duration filter
        if (duration !== 'all' && duration !== 'all durations') {
          // parses e.g. "4 days", "6 days", "8 days"
          const daysText = card.querySelector('.tour-meta')?.textContent.toLowerCase() || '';
          if (!daysText.includes(duration)) show = false;
        }

        // 4. Level filter
        if (level !== 'all' && level !== 'all levels') {
          const cardLevel = card.dataset.level ? card.dataset.level.toLowerCase() : '';
          if (cardLevel !== level) show = false;
        }

        // 5. Type filter
        if (type !== 'all' && type !== 'all types') {
          const cardType = card.dataset.type ? card.dataset.type.toLowerCase() : '';
          if (cardType !== type) show = false;
        }

        // 6. Pill Category filter (All, By Air, Group)
        if (activePillType !== 'all') {
          if (activePillType === 'by-air') {
            const isByAir = titleText.includes('by air') || highlightText.includes('by air') || cardMetaText.includes('by air');
            if (!isByAir) show = false;
          } else if (activePillType === 'group') {
            const badges = Array.from(card.querySelectorAll('.badge')).map(b => b.textContent.toLowerCase());
            if (!badges.includes('group')) show = false;
          }
        }

        // Toggle display
        if (show) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update count text
      if (tourCountText) {
        tourCountText.textContent = `${visibleCount} tour${visibleCount !== 1 ? 's' : ''} found`;
      }
    };

    // Helper: Simple Debounce Function
    const debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    // Event listeners (Debounced text search to prevent layout recalculation overhead)
    if (searchInput) searchInput.addEventListener('input', debounce(filterTours, 150));
    if (locationSelect) locationSelect.addEventListener('change', filterTours);
    if (durationSelect) durationSelect.addEventListener('change', filterTours);
    if (levelSelect) levelSelect.addEventListener('change', filterTours);
    if (typeSelect) typeSelect.addEventListener('change', filterTours);

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterTours();
      });
    });
  }


  // --- Immersive Video Viewport Performance Optimizer ---
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.paused && video.autoplay) {
            video.play().catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, { threshold: 0.01 }); // Set a very low threshold to prevent false-negative pauses on load/minor scrolls

    window.videoObserver = videoObserver;

    document.querySelectorAll('video').forEach(video => {
      videoObserver.observe(video);
    });
  }

  // Fallback: Autoplay media unlock on first scroll, touch, or click (crucial for mobile autoplay policies)
  const unlockAutoplay = () => {
    document.querySelectorAll('video').forEach(video => {
      if (video.paused && video.autoplay) {
        video.play().catch(() => {});
      }
    });
    window.removeEventListener('click', unlockAutoplay);
    window.removeEventListener('touchstart', unlockAutoplay);
    window.removeEventListener('touchend', unlockAutoplay);
    window.removeEventListener('scroll', unlockAutoplay);
  };
  window.addEventListener('click', unlockAutoplay, { once: true, passive: true });
  window.addEventListener('touchstart', unlockAutoplay, { once: true, passive: true });
  window.addEventListener('touchend', unlockAutoplay, { once: true, passive: true });
  window.addEventListener('scroll', unlockAutoplay, { once: true, passive: true });

  // --- Contact Form WhatsApp Redirection ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const phone = document.getElementById('form-phone').value || 'Not provided';
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value.trim() || 'No message provided';
      
      // Construct the formatted message for WhatsApp
      const whatsappMessage = `*New Website Inquiry*\n\n` +
        `*Name:* ${name}\n` +
        `*Email:* ${email}\n` +
        `*Phone:* ${phone}\n` +
        `*Subject:* ${subject}\n\n` +
        `*Message:* ${message}`;
        
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappNumber = '923127600239';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      alert('Thank you! You are now being redirected to WhatsApp to send your message to Me Time We Time.');
      
      // Open in a new tab/window
      window.open(whatsappUrl, '_blank');
      
      // Reset the form
      contactForm.reset();
    });
  }

  // --- Dynamic Desktop Video Background Progressive Loader ---
  const mediaContainer = document.getElementById("hero-media-container");
  if (mediaContainer && window.innerWidth >= 768 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const video = document.createElement("video");
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.className = "hero-video";
        
        const webmSource = document.createElement("source");
        webmSource.src = "optimized-video.webm";
        webmSource.type = "video/webm";
        video.appendChild(webmSource);
        
        const mp4Source = document.createElement("source");
        mp4Source.src = "optimized-video.mp4";
        mp4Source.type = "video/mp4";
        video.appendChild(mp4Source);

        video.addEventListener("canplay", () => {
          video.classList.add("loaded");
        });

        mediaContainer.appendChild(video);
        
        if (window.videoObserver) {
          window.videoObserver.observe(video);
        }
      }, 400);
    });
  }
});
