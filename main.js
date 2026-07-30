document.addEventListener('DOMContentLoaded', () => {
  // --- Header & Global Scroll Parallax Effects ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    document.documentElement.style.setProperty('--scroll-y', window.scrollY);
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

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

    // Event listeners
    if (searchInput) searchInput.addEventListener('input', filterTours);
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
    }, { threshold: 0.1 });

    document.querySelectorAll('video').forEach(video => {
      videoObserver.observe(video);
    });
  }
});
