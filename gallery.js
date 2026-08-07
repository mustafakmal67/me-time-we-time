document.addEventListener('DOMContentLoaded', async () => {
  const viewport = document.getElementById('gallery-viewport');
  const carousel = document.getElementById('gallery-carousel');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // Real gallery images metadata (50 items matching actual files in 'our gallery')
  let imagePool = [
    { name: "IMG_0272.JPG.jpeg", title: "Neelum Valley Stream", tag: "Neelum Valley", desc: "Crystal clear water flowing through lush pine valleys." },
    { name: "IMG_0302.JPG.jpeg", title: "Taobat Border Meadows", tag: "Kashmir", desc: "Pristine fields along the Neelum River in Taobat." },
    { name: "IMG_0319.JPG.jpeg", title: "Kachura Lake Reflection", tag: "Skardu", desc: "Stunning reflection of the Karakorams in Skardu." },
    { name: "IMG_0473.JPG.jpeg", title: "Passu Cathedral Cones", tag: "Hunza Valley", desc: "Jagged mountains cutting into the high altitude sky." },
    { name: "IMG_0641.JPG.jpeg", title: "Deosai Wildflowers", tag: "Baltistan", desc: "Golden summer blooms on the high alpine plains." },
    { name: "IMG_0664.JPG.jpeg", title: "Nanga Parbat Camp", tag: "Fairy Meadows", desc: "Tents under the colossal face of the Killer Mountain." },
    { name: "IMG_0967.JPG.jpeg", title: "Kumrat Forest Path", tag: "Kumrat Valley", desc: "Dense pine trees and mossy soil in Dir." },
    { name: "IMG_0980.JPG.jpeg", title: "Katora Lake Trek", tag: "Kumrat Valley", desc: "Glacier-fed turquoise waters high above Jahaz Banda." },
    { name: "IMG_0982.JPG.jpeg", title: "Malam Jabba Slopes", tag: "Swat Valley", desc: "Pine covered peaks and ski resort valley view." },
    { name: "IMG_1243.JPG.jpeg", title: "Attabad Turquoise waters", tag: "Hunza Valley", desc: "Boat cruising on the emerald waters of Attabad." },
    { name: "IMG_1285.JPG.jpeg", title: "Baltit Fort Majesty", tag: "Hunza", desc: "Ancient 700-year-old fort perched above Karimabad." },
    { name: "IMG_1296.JPG.jpeg", title: "Eagle's Nest Golden Hour", tag: "Hunza Valley", desc: "Panoramic sunset view over the Hunza river valley." },
    { name: "IMG_1387.JPG.jpeg", title: "Shangrila Resort Vista", tag: "Skardu", desc: "Lower Kachura lake framed by red cottages." },
    { name: "IMG_1390.JPG.jpeg", title: "Shigar Fort Residence", tag: "Skardu", desc: "17th-century palace restored as a heritage hotel." },
    { name: "IMG_1930.JPG.jpeg", title: "Ushu River Rapids", tag: "Swat Valley", desc: "Swirling white rapids in Kalam's deep pine forest." },
    { name: "IMG_1932.JPG.jpeg", title: "Mahodand Lake Quiet", tag: "Swat Valley", desc: "Serene mountain waters surrounded by green meadows." },
    { name: "IMG_1969.JPG.jpeg", title: "Kalam Town Panorama", tag: "Swat", desc: "The central valley nestled between high snowcaps." },
    { name: "IMG_1971.JPG.jpeg", title: "Naran River Crossing", tag: "Naran Valley", desc: "Bridges across the rushing Kunhar river." },
    { name: "IMG_2193.JPG.jpeg", title: "Saif-ul-Malook Lake", tag: "Naran", desc: "Legendary lake reflecting the peak of Malika Parbat." },
    { name: "IMG_2262.JPG.jpeg", title: "Siri Paye Meadows", tag: "Shogran", desc: "Green pastures and ponds floating above the clouds." },
    { name: "IMG_2297.JPG.jpeg", title: "Babusar Top Pass", tag: "Kaghan Valley", desc: "High mountain road pass connecting Kaghan and Chilas." },
    { name: "IMG_2323.JPG.jpeg", title: "Lulusar Lake Serenity", tag: "Kaghan", desc: "Deep blue deep mountain reservoir along the highway." },
    { name: "IMG_2515.JPG.jpeg", title: "Arang Kel Village", tag: "Neelum Valley", desc: "Hilltop village accessible via cable car and trek." },
    { name: "IMG_4331.JPG.jpeg", title: "Sharda Temple Ruins", tag: "Kashmir", desc: "Ancient Hindu temple ruins steeped in history." },
    { name: "IMG_4727.JPG.jpeg", title: "Kachura Lake View", tag: "Skardu", desc: "Looking down onto the deep waters from the hills." },
    { name: "IMG_4823.JPG.jpeg", title: "Basho Valley Forest", tag: "Skardu", desc: "Hidden forest valley and roaring pine cascades." },
    { name: "IMG_4830.JPG.jpeg", title: "Deosai Camp Night", tag: "Baltistan", desc: "Milky way galaxy arching over basecamp tents." },
    { name: "IMG_4834.JPG.jpeg", title: "Sheosar Lake Glow", tag: "Baltistan", desc: "Alpine lake reflecting the distant Karakorams." },
    { name: "IMG_4835.JPG.jpeg", title: "Khaplu Palace Stone", tag: "Baltistan", desc: "Historic wooden palace courtyard details." },
    { name: "IMG_4851.JPG.jpeg", title: "Manthoka Waterfall", tag: "Baltistan", desc: "Roaring 180-foot high cascade into the Indus." },
    { name: "IMG_4934.JPG.jpeg", title: "Cold Desert Twilight", tag: "Skardu", desc: "Shadows lengthening over high-altitude sands." },
    { name: "IMG_4935.JPG.jpeg", title: "Karimabad Street", tag: "Hunza Valley", desc: "Handicrafts and cafes lined against Rakaposhi." },
    { name: "IMG_4987.JPG.jpeg", title: "Passu Bridge Cables", tag: "Hunza", desc: "Thrilling suspension bridge hanging over the Hunza river." },
    { name: "IMG_5231.JPG.jpeg", title: "Ganish Village Old", tag: "Hunza Valley", desc: "1000-year-old settlement towers and alleys." },
    { name: "IMG_5296.JPG.jpeg", title: "Hopper Glacier Dirt", tag: "Hunza", desc: "Glaciers and moraine fields in hopper valley." },
    { name: "IMG_5302.JPG.jpeg", title: "Shimshal Valley Road", tag: "Karakoram", desc: "Unpaved gorge road carved directly into sheer rock." },
    { name: "IMG_5565.JPG.jpeg", title: "Katora Lake Turquoise", tag: "Kumrat Valley", desc: "Another view of the glacier basin's bright green water." },
    { name: "IMG_5592.JPG.jpeg", title: "Kalam Forest Stream", tag: "Swat Valley", desc: "Cold glacial stream water reflecting green trees." },
    { name: "IMG_5593.JPG.jpeg", title: "Ushu Glacial Valley", tag: "Swat", desc: "Panoramic view of Kalam peaks and grazing sheep." },
    { name: "IMG_5597.JPG.jpeg", title: "Kashmir Green Terraces", tag: "Kashmir", desc: "Rice fields lining the sides of Azad Kashmir valleys." },
    { name: "IMG_5599.JPG.jpeg", title: "Kiran River Bank", tag: "Kashmir", desc: "Looking across the Neelum to the opposite bank." },
    { name: "IMG_5627.JPG.jpeg", title: "Kel Fort Peak", tag: "Neelum Valley", desc: "Mist covered mountains behind Arang Kel heights." },
    { name: "IMG_5704.JPG.jpeg", title: "Taobat Border Post", tag: "Kashmir", desc: "Scenic wooden houses at the end of the line." },
    { name: "IMG_5705.JPG.jpeg", title: "Neelum River Twilight", tag: "Kashmir", desc: "Purple skies reflecting in the river's calm flow." },
    { name: "IMG_5726.JPG.jpeg", title: "Lulusar Lake Vista", tag: "Kaghan", desc: "Long panoramic shot of the mountain reservoir." },
    { name: "IMG_5743.JPG.jpeg", title: "Fairy Meadows Cabins", tag: "Fairy Meadows", desc: "Rustic logs and smoke rising under Nanga Parbat." },
    { name: "IMG_7777.JPG.jpeg", title: "Rakaposhi Snow Crest", tag: "Hunza Valley", desc: "Up close view of the gigantic icy south face." },
    { name: "IMG_7778.JPG.jpeg", title: "Passu Cathedral Sunset", tag: "Hunza", desc: "Golden rays hitting the peaks of the cones." },
    { name: "IMG_7900.JPG.jpeg", title: "Deosai Lakes Glow", tag: "Baltistan", desc: "Warm sun setting over the high alpine ponds." },
    { name: "IMG_7996.JPG.jpeg", title: "Attabad Lake Golden", tag: "Hunza Valley", desc: "Reflections of sunset on the turquoise lake." }
  ];

  let carouselCards = [];
  let activeImages = [];
  let isGalleryVisible = true;
  let animateFrameId = null;
  let resumeAudioLoop = null;
  let currentActiveIndex = 0;
  const DISPLAY_LIMIT = 12; // Maximum visual slots in the 3D cylinder
  let radius = 400;

  // Dynamic Directory Scanning
  const loadDynamicImages = async () => {
    try {
      const response = await fetch('our gallery/');
      if (response.ok) {
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        
        const detectedFiles = links
          .map(link => link.getAttribute('href'))
          .filter(href => href && href.match(/\.(jpe?g|png|webp)$/i))
          .map(href => {
            const decoded = decodeURIComponent(href);
            const parts = decoded.split('/');
            return parts[parts.length - 1];
          });

        if (detectedFiles.length > 0) {
          const uniqueNames = new Set(detectedFiles);
          const newPool = [];
          
          uniqueNames.forEach(filename => {
            const existing = imagePool.find(item => item.name.toLowerCase() === filename.toLowerCase());
            if (existing) {
              newPool.push(existing);
            } else {
              const cleanTitle = filename.replace(/\.(jpe?g|png|webp)$/i, '').replace(/[-_]/g, ' ');
              newPool.push({
                name: filename,
                title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
                tag: "Expedition",
                desc: "Captured moment from Northern Pakistan."
              });
            }
          });

          if (newPool.length > 0) {
            imagePool = newPool;
          }
        }
      }
    } catch (e) {
      console.warn("Dynamic folder scanning not available. Using default fallback registry.", e);
    }
  };

  // Helper to fetch unused images from the pool
  const getUnusedImage = () => {
    const activeNames = activeImages.map(item => item.name);
    const unused = imagePool.filter(item => !activeNames.includes(item.name));
    if (unused.length > 0) {
      return unused[Math.floor(Math.random() * unused.length)];
    }
    return imagePool[Math.floor(Math.random() * imagePool.length)];
  };

  // Self-Healing Image Loader Error Handler
  const handleImageError = (cardIdx, imgElement) => {
    const brokenItem = activeImages[cardIdx];
    if (brokenItem) {
      imagePool = imagePool.filter(item => item.name !== brokenItem.name);
    }

    if (imagePool.length === 0) {
      carousel.innerHTML = `<div class="empty-gallery-message" style="color: var(--body-text); font-size: 16px;">No photos available in gallery.</div>`;
      return;
    }

    const nextItem = getUnusedImage();
    if (nextItem) {
      activeImages[cardIdx] = nextItem;
      imgElement.src = `our gallery/${nextItem.name}`;
      imgElement.alt = nextItem.title;
    } else {
      initGallery();
    }
  };

  // Initialize Cards
  const initGallery = () => {
    carousel.innerHTML = "";
    carouselCards = [];
    activeImages = [];

    const totalCount = imagePool.length;
    const cardCount = Math.min(DISPLAY_LIMIT, totalCount);

    if (cardCount === 0) {
      carousel.innerHTML = `<div class="empty-gallery-message" style="color: var(--body-text); font-size: 16px;">No photos available in gallery.</div>`;
      return;
    }

    // Assign initial images
    for (let i = 0; i < cardCount; i++) {
      activeImages.push(imagePool[i]);
    }

    // Render slots (progressive loading setup)
    for (let i = 0; i < cardCount; i++) {
      const item = activeImages[i];
      
      const card = document.createElement('div');
      card.className = 'gallery-card has-image';
      card.setAttribute('data-index', i);
      
      card.innerHTML = `
        <div class="gallery-image-wrapper">
          <img class="gallery-img" alt="${item.title}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease, transform 0.6s ease;">
          <div class="gallery-placeholder">
            <div class="shimmer-effect"></div>
            <div class="placeholder-icon"><i class="ph ph-camera"></i></div>
            <span class="placeholder-tag">${item.tag}</span>
            <h3 class="placeholder-title">${item.title}</h3>
            <p class="placeholder-text">Loading...</p>
          </div>
        </div>
      `;
      
      const img = card.querySelector('.gallery-img');
      img.onload = () => {
        img.classList.add('loaded');
        const placeholder = card.querySelector('.gallery-placeholder');
        if (placeholder) placeholder.style.display = 'none';
      };
      img.onerror = () => handleImageError(i, img);

      card.addEventListener('click', () => {
        if (card.classList.contains('is-active')) {
          openLightbox(i);
        }
      });

      carousel.appendChild(card);
      carouselCards.push(card);
    }

    updateCarouselLayout();
  };

  // --- Dynamic Layout Radius ---
  const updateCarouselLayout = () => {
    const count = carouselCards.length;
    if (count === 0) return;
    
    let cardWidth = 300;
    if (window.innerWidth < 768) {
      cardWidth = 210;
    } else if (window.innerWidth < 1024) {
      cardWidth = 260;
    }
    
    let minRadius = 300;
    if (window.innerWidth < 768) {
      minRadius = 150;
    } else if (window.innerWidth < 1024) {
      minRadius = 240;
    }
    radius = Math.max(minRadius, cardWidth / (2 * Math.tan(Math.PI / count)));
  };

  // Fetch and init
  await loadDynamicImages();
  initGallery();

  // --- Fluid Physics & Auto-Rotation Loop ---
  let currentAngle = 0;
  let targetAngle = 0;
  let velocity = 0.05; 
  let isDragging = false;
  let startX = 0;
  let startAngle = 0;
  let lastAngle = 0;
  
  const dragSensitivity = 0.15;
  const autoRotationSpeed = 0.05; 
  const damping = 0.95;           

  // Accessibility Check: Listen for prefers-reduced-motion
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery.matches;
  motionQuery.addEventListener('change', () => {
    prefersReducedMotion = motionQuery.matches;
  });

  viewport.style.pointerEvents = 'auto';
  viewport.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startAngle = currentAngle;
    lastAngle = currentAngle;
    velocity = 0;
    viewport.classList.add('grabbing');
    e.preventDefault();
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const sensitivity = window.innerWidth < 768 ? 0.20 : dragSensitivity;
    targetAngle = startAngle + dx * sensitivity;
    
    currentAngle += (targetAngle - currentAngle) * 0.22;
    velocity = currentAngle - lastAngle;
    lastAngle = currentAngle;
  });

  window.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('grabbing');
    velocity = Math.max(-15, Math.min(15, velocity));
  });

  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isDragging) return;
    velocity += e.deltaY * 0.005;
  }, { passive: false });

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

  window.addEventListener('resize', debounce(() => {
    updateCarouselLayout();
  }, 150), { passive: true });

  // Render animation frame loop
  const animate = () => {
    if (!isGalleryVisible) {
      animateFrameId = null;
      return;
    }

    const count = carouselCards.length;
    if (count > 0) {
      const angleStep = 360 / count;

      if (!isDragging) {
        // Accessibility optimization: stop auto-rotation if user prefers reduced motion
        currentAngle += prefersReducedMotion ? 0 : velocity;
        velocity = prefersReducedMotion ? 0 : (velocity * damping + autoRotationSpeed * (1 - damping));
      }

      carouselCards.forEach((card, idx) => {
        const baseAngle = idx * angleStep;
        const cardAngle = baseAngle + currentAngle;
        
        let diff = cardAngle % 360;
        while (diff < -180) diff += 360;
        while (diff > 180) diff -= 360;
        
        const absDiff = Math.abs(diff);
        const factor = Math.min(1, absDiff / 180); 

        const radians = (cardAngle * Math.PI) / 180;
        const x = Math.sin(radians) * radius;
        const z = (Math.cos(radians) - 1) * radius;

        card.style.transform = `translate3d(${x}px, 0px, ${z}px) rotateY(${cardAngle}deg)`;

        const scale = 1 - factor * 0.38;         
        const opacity = 1 - factor * 0.78;       
        const brightness = 1 - factor * 0.68;    

        const wrapper = card.querySelector('.gallery-image-wrapper');
        if (wrapper) {
          // If in the middle of a rotation fade, preserve opacity override
          if (wrapper.style.transition === '') {
            wrapper.style.opacity = opacity;
          }
          wrapper.style.transform = `scale(${scale})`;
          
          // Performance Optimization: Skip expensive CSS blur filters on mobile/touch viewports (<768px)
          if (window.innerWidth >= 768) {
            const blur = factor * 4.0;
            wrapper.style.filter = `brightness(${brightness}) blur(${blur}px)`;
          } else {
            wrapper.style.filter = `brightness(${brightness})`;
          }
        }

        if (absDiff < (180 / count) * 1.5) {
          card.style.pointerEvents = 'all';
          card.classList.add('is-active');
        } else {
          card.style.pointerEvents = 'none';
          card.classList.remove('is-active');
        }

        // Progressive image loading: only download image when card is visible in view (< 110 degrees)
        if (absDiff < 110) {
          const img = card.querySelector('.gallery-img');
          if (img && (!img.src || img.src.includes('data:image'))) {
            const item = activeImages[idx];
            img.src = `our gallery/${item.name}`;
          }
        }
      });
    }
    animateFrameId = requestAnimationFrame(animate);
  };

  // IntersectionObserver to pause rendering loops when gallery is off-screen
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      isGalleryVisible = entries[0].isIntersecting;
      if (isGalleryVisible) {
        if (!animateFrameId) {
          animate();
        }
        if (resumeAudioLoop) {
          resumeAudioLoop();
        }
      }
    }, { threshold: 0.05 });
    observer.observe(viewport);
  } else {
    animate();
  }

  // --- Dynamic Carousel Image Swapping at the Back ---
  const rotateBackCard = () => {
    if (!isGalleryVisible) return;
    const count = carouselCards.length;
    if (count <= 0 || imagePool.length <= count) return;

    let bestIdx = -1;
    let maxAbsDiff = 0;
    const angleStep = 360 / count;

    carouselCards.forEach((card, idx) => {
      const baseAngle = idx * angleStep;
      const cardAngle = baseAngle + currentAngle;
      
      let diff = cardAngle % 360;
      while (diff < -180) diff += 360;
      while (diff > 180) diff -= 360;
      
      const absDiff = Math.abs(diff);
      if (absDiff > maxAbsDiff && absDiff > 140) {
        maxAbsDiff = absDiff;
        bestIdx = idx;
      }
    });

    if (bestIdx !== -1) {
      const nextItem = getUnusedImage();
      if (nextItem) {
        const card = carouselCards[bestIdx];
        const img = card.querySelector('.gallery-img');
        const wrapper = card.querySelector('.gallery-image-wrapper');
        
        if (wrapper && img) {
          wrapper.style.transition = 'opacity 0.5s ease';
          wrapper.style.opacity = '0';
          
          setTimeout(() => {
            activeImages[bestIdx] = nextItem;
            
            // Define clean restore function to fade card back in smoothly
            const fadeInCard = () => {
              img.classList.add('loaded');
              const placeholder = card.querySelector('.gallery-placeholder');
              if (placeholder) placeholder.style.display = 'none';

              // Calculate target opacity based on current rotation angle
              const angleStep = 360 / count;
              const baseAngle = bestIdx * angleStep;
              const cardAngle = baseAngle + currentAngle;
              let diff = cardAngle % 360;
              while (diff < -180) diff += 360;
              while (diff > 180) diff -= 360;
              const absDiff = Math.abs(diff);
              const factor = Math.min(1, absDiff / 180);
              const targetOpacity = 1 - factor * 0.78;

              wrapper.style.transition = 'opacity 0.5s ease';
              wrapper.style.opacity = targetOpacity;

              setTimeout(() => {
                wrapper.style.transition = '';
                img.onload = null;
                img.onerror = null;
              }, 500);
            };

            img.onload = fadeInCard;
            img.onerror = fadeInCard;
            img.src = `our gallery/${nextItem.name}`;
            img.alt = nextItem.title;
            
            // Fallback safety timeout
            setTimeout(() => {
              if (img.onload === fadeInCard) {
                fadeInCard();
              }
            }, 600);
          }, 500);
        }
      }
    }
  };

  // Set up periodic rotation loop (every 6 seconds)
  setInterval(rotateBackCard, 6000);

  // --- Lightbox Operations ---
  const openLightbox = (index) => {
    if (activeImages.length === 0 || index < 0 || index >= activeImages.length) return;
    currentActiveIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const showNext = () => {
    if (activeImages.length === 0) return;
    currentActiveIndex = (currentActiveIndex + 1) % activeImages.length;
    updateLightboxContent();
  };

  const showPrev = () => {
    if (activeImages.length === 0) return;
    currentActiveIndex = (currentActiveIndex - 1 + activeImages.length) % activeImages.length;
    updateLightboxContent();
  };

  const updateLightboxContent = () => {
    const item = activeImages[currentActiveIndex];
    if (!item) return;
    
    lightboxImg.style.opacity = '0.3';
    
    setTimeout(() => {
      // Set onload handler to fade in smoothly once the image has actually downloaded
      lightboxImg.onload = () => {
        lightboxImg.style.opacity = '1';
        lightboxImg.onload = null; // Clean up handler
      };
      
      lightboxImg.src = `our gallery/${item.name}`;
      lightboxImg.alt = item.title;
      lightboxTag.textContent = item.tag;
      lightboxTitle.textContent = item.title;
      lightboxDesc.textContent = item.desc;
      lightboxCounter.textContent = `${currentActiveIndex + 1} / ${activeImages.length}`;
    }, 150);
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // --- Ambient Background Music (Gallery Only) ---
  const initAmbientAudio = () => {
    const viewportEl = document.getElementById('gallery-viewport');
    if (!viewportEl) return;

    // Create Background Music Object with no preloading source
    const bgMusic = new Audio();
    bgMusic.loop = true;
    bgMusic.preload = 'none';
    bgMusic.volume = 0;

    let audioUnlocked = false;
    let isMuted = false;
    const MAX_VOLUME = 0.4;
    let targetVolume = 0;
    let currentVolume = 0;
    let resetOnPlay = false;

    // Create Ambient Audio Controls UI dynamically
    const audioContainer = document.createElement('div');
    audioContainer.className = 'audio-control-container';
    audioContainer.innerHTML = `
      <button id="audio-toggle-btn" class="audio-toggle-btn" aria-label="Toggle Background Music">
        <i class="ph ph-speaker-slash" id="audio-icon"></i>
        <div class="audio-visualizer">
          <div class="visualizer-bar"></div>
          <div class="visualizer-bar"></div>
          <div class="visualizer-bar"></div>
        </div>
      </button>
      <div class="audio-tooltip" id="audio-tooltip">Exhibition Ambient Audio</div>
    `;
    document.body.appendChild(audioContainer);

    const muteBtn = document.getElementById('audio-toggle-btn');
    const audioIcon = document.getElementById('audio-icon');
    const tooltip = document.getElementById('audio-tooltip');

    const updateUI = () => {
      const isPlaying = audioUnlocked && !isMuted && !bgMusic.paused;
      if (isPlaying) {
        muteBtn.classList.add('playing');
        audioIcon.className = 'ph ph-speaker-high';
        tooltip.textContent = 'Mute Exhibition Audio';
      } else {
        muteBtn.classList.remove('playing');
        audioIcon.className = 'ph ph-speaker-slash';
        tooltip.textContent = isMuted ? 'Unmute Exhibition Audio' : 'Exhibition Ambient Audio';
      }
    };

    const updateVolume = () => {
      const rect = viewportEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const elementHeight = rect.height || 600;
      const elementTop = rect.top;
      const elementBottom = rect.bottom;

      // If gallery section is completely out of viewport, fade out/pause
      if (elementBottom < 0 || elementTop > windowHeight) {
        targetVolume = 0;
        resetOnPlay = true; // Flag to reset audio track to beginning when we scroll back
        return;
      }

      // Calculate center alignment
      const elementCenter = elementTop + elementHeight / 2;
      const viewportCenter = windowHeight / 2;
      
      const maxDistance = (windowHeight + elementHeight) / 2;
      const distanceFromCenter = Math.abs(viewportCenter - elementCenter);
      
      let factor = 1 - (distanceFromCenter / maxDistance);
      factor = Math.max(0, Math.min(1, factor));

      // Apply quad ease-in for elegant volume progression
      const easedFactor = factor * factor;
      
      targetVolume = easedFactor * MAX_VOLUME;
    };

    let smoothVolumeLoopFrameId = null;

    // Smooth Lerp Volume Loop (Liquid Volume Transition)
    const smoothVolumeLoop = () => {
      if (!isGalleryVisible) {
        smoothVolumeLoopFrameId = null;
        return;
      }
      
      const step = isMuted ? 0.15 : 0.05; // faster fade for mute/unmute
      const goalVolume = isMuted ? 0 : targetVolume;
      
      currentVolume += (goalVolume - currentVolume) * step;
      
      if (currentVolume < 0.001) currentVolume = 0;
      if (currentVolume > MAX_VOLUME) currentVolume = MAX_VOLUME;
      
      bgMusic.volume = currentVolume;
      
      // Control play/pause states based on volume threshold
      if (currentVolume > 0 && bgMusic.paused) {
        if (!bgMusic.src || bgMusic.src === '' || bgMusic.src.indexOf('gallery_bg.mp3') === -1) {
          bgMusic.src = 'gallery_bg.mp3';
          bgMusic.load();
        }
        if (resetOnPlay) {
          bgMusic.currentTime = 0; // Restart from the beginning as requested
          resetOnPlay = false;
        }
        bgMusic.play().then(() => {
          updateUI();
        }).catch(() => {
          // Autoplay blocked, will play on unlock gesture
        });
      } else if (currentVolume === 0 && !bgMusic.paused) {
        bgMusic.pause();
        updateUI();
      }
      
      smoothVolumeLoopFrameId = requestAnimationFrame(smoothVolumeLoop);
    };

    resumeAudioLoop = () => {
      if (!smoothVolumeLoopFrameId) {
        smoothVolumeLoopFrameId = requestAnimationFrame(smoothVolumeLoop);
      }
    };

    // Unlock Audio Context on first interaction
    const unlockAudio = () => {
      if (audioUnlocked) return;
      
      // Only unlock and load if the user is looking at the gallery section
      const rect = viewportEl.getBoundingClientRect();
      const isVisible = rect.bottom >= 0 && rect.top <= window.innerHeight;
      
      if (isVisible) {
        if (!bgMusic.src || bgMusic.src === '') {
          bgMusic.src = 'gallery_bg.mp3';
          bgMusic.load();
        }
        bgMusic.play().then(() => {
          audioUnlocked = true;
          removeUnlockListeners();
          updateVolume();
          updateUI();
        }).catch(err => {
          console.log("Audio unlock deferred:", err);
        });
      }
    };

    const removeUnlockListeners = () => {
      ['click', 'touchstart', 'keydown', 'mousedown', 'wheel'].forEach(event => {
        document.removeEventListener(event, unlockAudio);
      });
    };

    // Bind event listeners for unlocking
    ['click', 'touchstart', 'keydown', 'mousedown', 'wheel'].forEach(event => {
      document.addEventListener(event, unlockAudio, { passive: true });
    });

    // Mute button click handler
    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!bgMusic.src || bgMusic.src === '') {
          bgMusic.src = 'gallery_bg.mp3';
          bgMusic.load();
        }
        if (!audioUnlocked) {
          bgMusic.play().then(() => {
            audioUnlocked = true;
            isMuted = false;
            removeUnlockListeners();
            updateVolume();
            updateUI();
          }).catch(err => {
            console.error("Audio unlock failed on button click:", err);
          });
        } else {
          isMuted = !isMuted;
          updateUI();
        }
      });
    }

    // Scroll and Resize handlers with requestAnimationFrame throttling
    let scrollTicking = false;
    const throttledUpdateVolume = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          updateVolume();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener('scroll', throttledUpdateVolume, { passive: true });
    window.addEventListener('resize', throttledUpdateVolume, { passive: true });

    // Initial check
    updateVolume();
    
    // Start smooth animation loop
    smoothVolumeLoopFrameId = requestAnimationFrame(smoothVolumeLoop);
  };

  initAmbientAudio();
});
