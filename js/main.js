/**
 * Thập Tứ Tour - Main JavaScript
 * Built with Animate UI & Hallmark standards
 * Zero external libraries, 100% native Web APIs
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle (Dark / Light Mode)
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      try {
        localStorage.setItem('thap_tu_theme', newTheme);
      } catch (e) {}
    });
  }

  // 2. Video Player Showcase
  const video = document.getElementById('quyNhonVideo');
  const videoPlayBtn = document.getElementById('videoPlayBtn');
  const videoOverlay = document.getElementById('videoOverlay');

  if (video && videoPlayBtn && videoOverlay) {
    const playVideo = () => {
      video.play().then(() => {
        videoOverlay.style.opacity = '0';
        videoOverlay.style.pointerEvents = 'none';
      }).catch(err => {
        console.warn('Video play interrupted:', err);
      });
    };

    const pauseVideo = () => {
      video.pause();
      videoOverlay.style.opacity = '1';
      videoOverlay.style.pointerEvents = 'auto';
    };

    videoPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playVideo();
    });

    video.addEventListener('click', () => {
      if (video.paused) {
        playVideo();
      } else {
        pauseVideo();
      }
    });

    video.addEventListener('ended', () => {
      videoOverlay.style.opacity = '1';
      videoOverlay.style.pointerEvents = 'auto';
    });
  }

  // 3. Timeline Day Tabs Switching (Animate UI spring.selection)
  const tabBtns = document.querySelectorAll('.timeline-tabs .tab-btn');
  const dayPanels = document.querySelectorAll('.day-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetDay = btn.getAttribute('data-day');
      if (!targetDay) return;

      // Update active tab button
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update active day panel
      dayPanels.forEach(panel => {
        if (panel.id === targetDay) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // 4. FAQ Accordion (Animate UI transition.disclosure)
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      if (!item) return;

      const isOpen = item.classList.contains('open');

      // Optional: close other open items for a neat accordion experience
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          const t = openItem.querySelector('.faq-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 5. Packing Checklist with localStorage persistence
  const checklist = document.getElementById('packingChecklist');
  if (checklist) {
    const STORAGE_KEY = 'thap_tu_packing_state';
    let savedState = {};

    try {
      savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {}

    const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      const key = cb.getAttribute('data-check');
      if (key && savedState[key] !== undefined) {
        cb.checked = savedState[key];
      }

      cb.addEventListener('change', () => {
        if (key) {
          savedState[key] = cb.checked;
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
          } catch (e) {}
        }
      });
    });
  }

  // 6. Booking Form Validation & Confirmation Modal Dialog
  const bookingForm = document.getElementById('bookingForm');
  const confirmModal = document.getElementById('confirmModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalOkBtn = document.getElementById('modalOkBtn');

  if (bookingForm && confirmModal) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple HTML5 validation passed
      confirmModal.classList.add('open');
      bookingForm.reset();
    });

    const closeModal = () => {
      confirmModal.classList.remove('open');
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);

    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && confirmModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // 7. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
