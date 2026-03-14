/* ============================================
   MM PARTY RENTALS - Phase 1: Script
   Header + Hero Carousel
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll effect ---------- */
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
  });

  // Close mobile menu when a nav link is clicked
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') &&
        !nav.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    }
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = nav.querySelector(`a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          nav.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  /* ---------- Hero Carousel ---------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('heroDots');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let currentSlide = 0;
  let autoplayInterval;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('hero-dot');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.hero-dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  // Autoplay every 8 seconds
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 8000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  startAutoplay();

  // Pause autoplay on hover
  const heroSection = document.querySelector('.hero');
  heroSection.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  heroSection.addEventListener('mouseleave', startAutoplay);

  // Keyboard navigation for carousel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
    if (e.key === 'ArrowLeft') { prevSlide(); resetAutoplay(); }
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  heroSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      resetAutoplay();
    }
  }, { passive: true });

  /* ============================================
     PHASE 2: Welcome, Order Date, Categories
     ============================================ */

  /* ---------- Read More toggle ---------- */
  const readMoreBtn = document.getElementById('readMoreBtn');
  const welcomeExtra = document.getElementById('welcomeExtra');

  if (readMoreBtn && welcomeExtra) {
    readMoreBtn.addEventListener('click', () => {
      const expanded = welcomeExtra.classList.toggle('expanded');
      readMoreBtn.textContent = expanded ? 'Read Less' : 'Read More';
    });
  }

  /* ---------- Order By Date ---------- */
  const checkDateBtn = document.getElementById('checkDateBtn');
  const eventDateInput = document.getElementById('eventDate');

  if (checkDateBtn && eventDateInput) {
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.setAttribute('min', today);

    checkDateBtn.addEventListener('click', () => {
      const selectedDate = eventDateInput.value;
      if (!selectedDate) {
        alert('Please select an event date first!');
        return;
      }
      const dateObj = new Date(selectedDate + 'T00:00:00');
      const formatted = dateObj.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      alert(`Great choice! Checking availability for ${formatted}.\n\nCall us at (714) 555-1234 to confirm your booking!`);
    });
  }

  /* ---------- Category card hover ---------- */
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ============================================
     PHASE 3: Products & Gallery (Sanity.io)
     ============================================ */

  // Category display names
  const categoryNames = {
    'bounce-houses': 'Bounce Houses',
    'water-slides': 'Water Slides',
    'combo-units': 'Combo Units',
    'interactive-games': 'Interactive Games',
    'tables-chairs': 'Tables & Chairs',
    'concessions': 'Concessions',
  };

  /* ---------- Products ---------- */
  let allProducts = [];

  const productGrid = document.getElementById('productGrid');
  const productsLoading = document.getElementById('productsLoading');
  const noResults = document.getElementById('noResults');
  const categoryFilter = document.getElementById('categoryFilter');
  const sortFilter = document.getElementById('sortFilter');
  const productSearch = document.getElementById('productSearch');

  async function loadProducts() {
    try {
      const query = `*[_type == "product"]{
        _id,
        name,
        "slug": slug.current,
        category,
        price,
        "imageRef": image.asset._ref,
        description,
        featured,
        dimensions
      }`;

      allProducts = await sanityFetch(query);
      productsLoading.style.display = 'none';
      renderProducts();
    } catch (err) {
      console.error('Failed to load products:', err);
      productsLoading.innerHTML = '<p style="color: var(--coral);">Unable to load products. Please check your Sanity configuration.</p>';
    }
  }

  function renderProducts() {
    // Get filter values
    const category = categoryFilter.value;
    const sort = sortFilter.value;
    const search = productSearch.value.toLowerCase().trim();

    // Filter
    let filtered = allProducts.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (search && !p.name.toLowerCase().includes(search) &&
          !(p.description && p.description.toLowerCase().includes(search))) return false;
      return true;
    });

    // Sort
    switch (sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    // Show/hide no results
    if (filtered.length === 0) {
      productGrid.style.display = 'none';
      noResults.style.display = 'block';
      return;
    }

    productGrid.style.display = 'grid';
    noResults.style.display = 'none';

    // Remove existing cards (keep loading spinner reference)
    productGrid.querySelectorAll('.product-card').forEach(c => c.remove());

    // Render cards
    filtered.forEach(product => {
      const imgUrl = product.imageRef
        ? sanityImageUrl(product.imageRef, 600)
        : '';

      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        ${imgUrl
          ? `<img class="product-card-img" src="${imgUrl}" alt="${product.name}" loading="lazy">`
          : `<div class="product-card-img"></div>`
        }
        <div class="product-card-body">
          <span class="product-card-category">${categoryNames[product.category] || product.category}</span>
          <h3 class="product-card-name">${product.name}</h3>
          <p class="product-card-desc">${product.description || ''}</p>
          ${product.dimensions ? `<p class="product-card-desc" style="font-size:0.8rem; margin-bottom:8px;">📐 ${product.dimensions}</p>` : ''}
          <div class="product-card-footer">
            <div class="product-card-price">$${product.price} <span>/ day</span></div>
            <button class="btn-add-cart" data-id="${product._id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
          </div>
        </div>
      `;
      productGrid.appendChild(card);
    });

    // Add to cart button listeners
    productGrid.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const cartCount = document.getElementById('cartCount');
        const current = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = current + 1;

        // Brief visual feedback
        btn.textContent = 'Added!';
        btn.style.background = 'var(--mint)';
        setTimeout(() => {
          btn.textContent = 'Add to Cart';
          btn.style.background = '';
        }, 1500);
      });
    });
  }

  // Filter / search event listeners
  categoryFilter.addEventListener('change', renderProducts);
  sortFilter.addEventListener('change', renderProducts);

  let searchTimeout;
  productSearch.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(renderProducts, 300);
  });

  // Category card links -> set filter
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const cardTitle = card.querySelector('h3').textContent;
      const categoryMap = {
        'Bounce Houses': 'bounce-houses',
        'Water Slides': 'water-slides',
        'Combo Units': 'combo-units',
        'Interactive Games': 'interactive-games',
        'Tables & Chairs': 'tables-chairs',
        'Concessions': 'concessions',
      };
      const categoryValue = categoryMap[cardTitle];
      if (categoryValue) {
        categoryFilter.value = categoryValue;
        renderProducts();
      }
    });
  });

  /* ---------- Photo Gallery ---------- */
  let allGalleryImages = [];
  let filteredGalleryImages = [];
  let currentLightboxIndex = 0;

  const galleryGrid = document.getElementById('galleryGrid');
  const galleryLoading = document.getElementById('galleryLoading');
  const galleryFilters = document.getElementById('galleryFilters');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  async function loadGallery() {
    try {
      const query = `*[_type == "galleryImage"] | order(order asc) {
        _id,
        title,
        "imageRef": image.asset._ref,
        category,
        order
      }`;

      allGalleryImages = await sanityFetch(query);
      filteredGalleryImages = [...allGalleryImages];
      galleryLoading.style.display = 'none';
      renderGallery();
    } catch (err) {
      console.error('Failed to load gallery:', err);
      galleryLoading.innerHTML = '<p style="color: var(--coral);">Unable to load gallery. Please check your Sanity configuration.</p>';
    }
  }

  function renderGallery() {
    // Remove existing items
    galleryGrid.querySelectorAll('.gallery-item').forEach(i => i.remove());

    if (filteredGalleryImages.length === 0) {
      galleryGrid.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:var(--gray); padding:40px;">No photos in this category yet.</p>';
      return;
    }

    filteredGalleryImages.forEach((img, index) => {
      const imgUrl = img.imageRef ? sanityImageUrl(img.imageRef, 600) : '';
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.setAttribute('data-index', index);
      item.innerHTML = `
        ${imgUrl
          ? `<img src="${imgUrl}" alt="${img.title}" loading="lazy">`
          : ''
        }
        <div class="gallery-item-overlay">
          <p>${img.title}</p>
        </div>
      `;
      item.addEventListener('click', () => openLightbox(index));
      galleryGrid.appendChild(item);
    });
  }

  // Gallery filter buttons
  galleryFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.gallery-filter-btn');
    if (!btn) return;

    galleryFilters.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    if (filter === 'all') {
      filteredGalleryImages = [...allGalleryImages];
    } else {
      filteredGalleryImages = allGalleryImages.filter(img => img.category === filter);
    }
    renderGallery();
  });

  // Lightbox
  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const img = filteredGalleryImages[currentLightboxIndex];
    if (!img) return;
    const imgUrl = img.imageRef ? sanityImageUrl(img.imageRef, 1200) : '';
    lightboxImg.src = imgUrl;
    lightboxImg.alt = img.title;
    lightboxCaption.textContent = img.title;
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredGalleryImages.length) % filteredGalleryImages.length;
    updateLightbox();
  });

  lightboxNext.addEventListener('click', () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredGalleryImages.length;
    updateLightbox();
  });

  // Lightbox keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentLightboxIndex = (currentLightboxIndex - 1 + filteredGalleryImages.length) % filteredGalleryImages.length;
      updateLightbox();
    }
    if (e.key === 'ArrowRight') {
      currentLightboxIndex = (currentLightboxIndex + 1) % filteredGalleryImages.length;
      updateLightbox();
    }
  });

  /* ---------- Initialize Phase 3 ---------- */
  loadProducts();
  loadGallery();

});
