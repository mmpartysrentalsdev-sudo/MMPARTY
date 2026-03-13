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

  /* ---------- Category card hover sound (subtle) ---------- */
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
