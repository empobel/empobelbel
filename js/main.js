/* ===================================================
   main.js - Logic hiển thị website Thập Tứ Tour
   Chỉ giới thiệu các địa danh du lịch Quy Nhơn & Về tụi tôi
   Hỗ trợ Chế độ Sáng / Tối (Dark / Light Mode) & Đa ngôn ngữ (VI / EN)
   Hoàn toàn phi lợi nhuận, không có giá tiền / đăng ký tour
   =================================================== */

/* ===== PHẦN CHUNG (tất cả trang) ===== */

// Hamburger menu mobile
const mobileMenuBtn = document.getElementById('mobileMenuBtn') || document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (mobileMenuBtn && nav) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}

// Nút back to top - Tự ẩn khi cuộn xuống đọc, chỉ hiện khi cuộn ngược lên trên mobile
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 400) {
      if (window.innerWidth <= 768) {
        if (currentScrollY > lastScrollY + 6) {
          backToTopBtn.classList.remove('show');
        } else if (currentScrollY < lastScrollY - 6) {
          backToTopBtn.classList.add('show');
        }
      } else {
        backToTopBtn.classList.add('show');
      }
    } else {
      backToTopBtn.classList.remove('show');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== TRANG CHỦ (index.html) ===== */

let currentCategory = 'all';
let currentSearch = '';

/**
 * Render danh mục địa danh (Biển đảo, Thiên nhiên, Văn hóa) kèm số lượng địa điểm
 */
function renderCategories() {
  const grid = document.getElementById('categoryGrid');
  if (!grid || typeof TOURS === 'undefined') return;

  const categories = (typeof getLocalizedCategories === 'function') ? getLocalizedCategories() : CATEGORIES;
  const tours = (typeof getLocalizedTours === 'function') ? getLocalizedTours() : TOURS;
  const totalCount = tours.length;
  const catAllName = (typeof t === 'function') ? t('cat_all') : 'Tất cả địa danh';
  const placesSuffix = (typeof t === 'function') ? t('cat_places_count') : 'địa điểm';

  let html = `
    <div class="category-card reveal-on-scroll ${currentCategory === 'all' ? 'active' : ''}" data-category="all">
      <div class="cat-icon-wrap">
        <span class="cat-icon">🌍</span>
      </div>
      <span class="cat-name">${catAllName}</span>
      <span class="cat-count">${totalCount} ${placesSuffix}</span>
    </div>
  `;

  categories.forEach(cat => {
    const count = tours.filter(t => t.category === cat.id).length;
    html += `
      <div class="category-card reveal-on-scroll ${currentCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
        <div class="cat-icon-wrap">
          <span class="cat-icon">${cat.icon}</span>
        </div>
        <span class="cat-name">${cat.name}</span>
        <span class="cat-count">${count} ${placesSuffix}</span>
      </div>
    `;
  });

  grid.innerHTML = html;

  grid.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      grid.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentCategory = card.dataset.category;
      applyFilters();

      const destSection = document.getElementById('dia-diem');
      if (destSection) {
        const top = destSection.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  if (typeof triggerScrollReveal === 'function') {
    setTimeout(triggerScrollReveal, 30);
  }
}

/**
 * Render danh sách thẻ địa danh Quy Nhơn
 */
function renderTourCards(tours) {
  const grid = document.getElementById('tourGrid');
  if (!grid) return;

  if (tours.length === 0) {
    const noTitle = (typeof t === 'function') ? t('no_places_title') : 'Không tìm thấy địa điểm phù hợp';
    const noSub = (typeof t === 'function') ? t('no_places_sub') : 'Vui lòng thử tìm kiếm với từ khóa khác hoặc chọn mục "Tất cả địa danh".';
    grid.innerHTML = `
      <div class="no-tours">
        <span class="no-tours-icon">🔍</span>
        <h3>${noTitle}</h3>
        <p>${noSub}</p>
      </div>
    `;
    return;
  }

  const categories = (typeof getLocalizedCategories === 'function') ? getLocalizedCategories() : CATEGORIES;
  const getCatName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : '';
  };
  const visitPrefix = (typeof t === 'function') ? t('visit_prefix') : 'Ghé thăm:';
  const btnText = (typeof t === 'function') ? t('btn_view_place') : 'Xem chi tiết địa điểm';

  let html = '';
  tours.forEach(tour => {
    let tagsHtml = '';
    if (tour.tags && tour.tags.length > 0) {
      tagsHtml = `<div class="tour-tags">${tour.tags.map(tag => `<span class="tour-tag-pill">${tag}</span>`).join('')}</div>`;
    }

    let visitBadge = '';
    if (tour.visitTime) {
      visitBadge = `
        <div class="tour-visittime-tag">
          <span class="visittime-icon">⏰</span>
          <span><strong>${visitPrefix}</strong> ${tour.visitTime}</span>
        </div>
      `;
    }

    html += `
      <div class="tour-card reveal-on-scroll" onclick="window.location.href='tour-detail.html?id=${tour.id}'" role="button" tabindex="0">
        <div class="tour-image-wrap">
          <img src="${tour.image}" alt="${tour.name}" loading="lazy" class="tour-image">
          <span class="tour-badge">${tour.badge || getCatName(tour.category)}</span>
          ${visitBadge}
        </div>
        <div class="tour-body">
          <div class="tour-meta">
            <span>📍 ${tour.location}</span>
            <span>⏱️ ${tour.duration}</span>
          </div>
          <h3 class="tour-title">${tour.name}</h3>
          <p class="tour-desc">${tour.description}</p>
          ${tagsHtml}
          <div class="tour-footer">
            <span class="tour-free-tag">Cẩm nang miễn phí</span>
            <span class="tour-btn-detail">${btnText} →</span>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;

  if (typeof triggerScrollReveal === 'function') {
    setTimeout(triggerScrollReveal, 30);
  }
}

/**
 * Lọc địa danh theo category và tìm kiếm
 */
function applyFilters() {
  const tours = (typeof getLocalizedTours === 'function') ? getLocalizedTours() : TOURS;
  let result = tours;

  if (currentCategory !== 'all') {
    result = result.filter(t => t.category === currentCategory);
  }

  if (currentSearch.trim() !== '') {
    const q = currentSearch.toLowerCase().trim();
    result = result.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  }

  renderTourCards(result);
}

/**
 * Render Lịch trình chuyến đi theo Ngày (1 / 2 / 3 / 4)
 */
function renderTimeline(dayNumber = 1) {
  const container = document.getElementById('timelineContainer');
  if (!container || typeof TIMELINE_DATA === 'undefined') return;

  const timelineData = (typeof getLocalizedTimeline === 'function') ? getLocalizedTimeline() : TIMELINE_DATA;
  const dayData = timelineData.find(d => d.day === parseInt(dayNumber)) || timelineData[0];
  if (!dayData) return;

  const placeLinkPrefix = (typeof t === 'function') ? t('timeline_place_link') : '📍 <strong>Địa điểm trong chuyến đi:</strong>';
  const weatherTitle = (typeof t === 'function') ? t('weather_plan_title') : 'Phương Án Dự Phòng Khi Thời Tiết Xấu / Trời Mưa';
  const dayBadgePrefix = (typeof t === 'function') ? t('day_badge_prefix') : 'LỊCH TRÌNH NGÀY';

  let eventsHtml = '';
  dayData.events.forEach((ev) => {
    let placeLinkHtml = '';
    if (ev.highlightPlaceId && ev.placeName) {
      placeLinkHtml = `
        <div class="timeline-place-tag">
          <a href="tour-detail.html?id=${ev.highlightPlaceId}" title="Bấm xem giới thiệu chi tiết">
            ${placeLinkPrefix} ${ev.placeName} <span class="arrow-icon">→</span>
          </a>
        </div>
      `;
    }

    eventsHtml += `
      <div class="timeline-item reveal-on-scroll">
        <div class="timeline-marker">
          <div class="timeline-icon-box">${ev.icon || '📍'}</div>
          <div class="timeline-line"></div>
        </div>
        <div class="timeline-content">
          <div class="timeline-time-badge">${ev.time}</div>
          <h3 class="timeline-event-title">${ev.title}</h3>
          <p class="timeline-event-desc">${ev.desc}</p>
          ${placeLinkHtml}
        </div>
      </div>
    `;
  });

  let weatherHtml = '';
  if (dayData.weatherPlan) {
    weatherHtml = `
      <div class="weather-plan-box reveal-on-scroll">
        <div class="weather-plan-header">
          <span class="weather-plan-icon">🌦️</span>
          <h4>${weatherTitle}</h4>
        </div>
        <p>${dayData.weatherPlan}</p>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="timeline-day-header reveal-on-scroll">
      <span class="timeline-day-pill">${dayBadgePrefix} ${dayData.day}</span>
      <h3 class="timeline-day-title">${dayData.theme}</h3>
    </div>
    <div class="timeline-tree">
      ${eventsHtml}
    </div>
    ${weatherHtml}
  `;

  if (typeof triggerScrollReveal === 'function') {
    setTimeout(triggerScrollReveal, 30);
  }
}

/**
 * Cập nhật nội dung các nút tab lịch trình (Ngày 1 / 2 / 3 / 4)
 */
function updateTimelineTabs(lang) {
  const tabsContainer = document.getElementById('timelineTabs');
  if (!tabsContainer) return;

  const tabData = {
    vi: [
      { day: 1, badge: 'Ngày 1', title: 'Khởi hành & Biển Quy Nhơn' },
      { day: 2, badge: 'Ngày 2', title: 'Kỳ Co – Eo Gió & Tịnh Xá' },
      { day: 3, badge: 'Ngày 3', title: 'ExploraScience & Ghềnh Ráng' },
      { day: 4, badge: 'Ngày 4', title: 'Check-in kỉ niệm & Về TP.HCM' }
    ],
    en: [
      { day: 1, badge: 'Day 1', title: 'Departure & Quy Nhon Beach' },
      { day: 2, badge: 'Day 2', title: 'Ky Co – Eo Gio & Pagoda' },
      { day: 3, badge: 'Day 3', title: 'ExploraScience & Ghenh Rang' },
      { day: 4, badge: 'Day 4', title: 'Farewell Photos & Back to HCMC' }
    ]
  };

  const currentTabs = tabData[lang] || tabData.vi;
  const tabBtns = tabsContainer.querySelectorAll('.timeline-tab-btn');
  tabBtns.forEach((btn, index) => {
    const data = currentTabs[index];
    if (data) {
      const badge = btn.querySelector('.tab-day-badge');
      const title = btn.querySelector('.tab-day-title');
      if (badge) badge.textContent = data.badge;
      if (title) title.textContent = data.title;
    }
  });
}

/**
 * Cập nhật dòng chữ chạy ngang (Marquee ticker)
 */
function updateMarqueeTicker(lang) {
  const marqueeBoxes = document.querySelectorAll('.marquee-track .marquee-content');
  if (!marqueeBoxes || marqueeBoxes.length === 0) return;

  const contentVI = `
    <span>🌊 THẬP TỨ TOUR</span>
    <span class="dot">•</span>
    <span>🎓 LỚP 10A4 THPT LƯƠNG THẾ VINH (2026)</span>
    <span class="dot">•</span>
    <span>💰 GIÁ CẢ TOUR: 5.920.000đ / NGƯỜI</span>
    <span class="dot">•</span>
    <span>🏖️ KỲ CO - EO GIÓ - TỊNH XÁ NGỌC HÒA</span>
    <span class="dot">•</span>
    <span>🌄 GHỀNH RÁNG TIÊN SA - ĐỒI THI NHÂN</span>
    <span class="dot">•</span>
    <span>🏛️ BẢO TÀNG TỔNG HỢP BÌNH ĐỊNH</span>
    <span class="dot">•</span>
    <span>🍲 NHÀ HÀNG CƠM MẬU QUY NHƠN</span>
    <span class="dot">•</span>
    <span>🍜 BÚN CÁ NGỌC LIÊN & NEM CHẢ LỢI</span>
    <span class="dot">•</span>
    <span>🥞 BÁNH XÈO TÔM NHẢY DIÊN HỒNG</span>
    <span class="dot">•</span>
    <span>🦞 HẢI SẢN LỘC BIỂN & CÂU MỰC ĐÊM</span>
    <span class="dot">•</span>
    <span>🚀 KHÁM PHÁ VŨ TRỤ EXPLORASCIENCE</span>
    <span class="dot">•</span>
    <span>☂️ SẴN SÀNG DÙ & ÁO MƯA</span>
    <span class="dot">•</span>
    <span>🏨 KHÁCH SẠN ODIN QUY NHƠN</span>
    <span class="dot">•</span>
  `;

  const contentEN = `
    <span>🌊 THAP TU TOUR</span>
    <span class="dot">•</span>
    <span>🎓 CLASS 10A4 LUONG THE VINH (2026)</span>
    <span class="dot">•</span>
    <span>💰 ALL-INCLUSIVE TOUR: 5,920,000 VND / PERSON</span>
    <span class="dot">•</span>
    <span>🏖️ KY CO - EO GIO & NGOC HOA PAGODA</span>
    <span class="dot">•</span>
    <span>🌄 GHENH RANG TIEN SA HILLSIDE</span>
    <span class="dot">•</span>
    <span>🏛️ BINH DINH GENERAL MUSEUM</span>
    <span class="dot">•</span>
    <span>🍲 COM MAU RETRO RESTAURANT</span>
    <span class="dot">•</span>
    <span>🍜 NGOC LIEN FISH NOODLES & NEM LOI</span>
    <span class="dot">•</span>
    <span>🥞 DIEN HONG CRISPY SHRIMP PANCAKES</span>
    <span class="dot">•</span>
    <span>🦞 LOC BIEN SEAFOOD & SQUID FISHING</span>
    <span class="dot">•</span>
    <span>🚀 EXPLORASCIENCE SPACE CENTER</span>
    <span class="dot">•</span>
    <span>☂️ UMBRELLAS & RAINCOATS READY</span>
    <span class="dot">•</span>
    <span>🏨 ODIN HOTEL QUY NHON</span>
    <span class="dot">•</span>
  `;

  const chosenContent = lang === 'en' ? contentEN : contentVI;
  marqueeBoxes.forEach(box => {
    box.innerHTML = chosenContent;
  });
}

/**
 * Khởi tạo toàn bộ chức năng trang chủ
 */
function initHomePage() {
  const tourGrid = document.getElementById('tourGrid');
  if (!tourGrid) return;

  const currentTours = (typeof getLocalizedTours === 'function') ? getLocalizedTours() : TOURS;
  renderCategories();
  renderTourCards(currentTours);
  renderTimeline(1);

  // Tabs lịch trình
  const timelineTabs = document.getElementById('timelineTabs');
  if (timelineTabs) {
    timelineTabs.querySelectorAll('.timeline-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        timelineTabs.querySelectorAll('.timeline-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const day = btn.dataset.day;
        renderTimeline(day);
      });
    });
  }

  // Tìm kiếm
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.style.display = currentSearch.length > 0 ? 'block' : 'none';
      }
      applyFilters();
    });

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearch = '';
        searchClearBtn.style.display = 'none';
        applyFilters();
        searchInput.focus();
      });
    }
  }
}

/* ===== TRANG CHI TIẾT ĐỊA DANH (tour-detail.html) ===== */

function renderTourDetail(tour) {
  const main = document.getElementById('tourDetailMain');
  if (!main) return;

  const isEn = typeof getCurrentLang === 'function' && getCurrentLang() === 'en';
  const siteTitle = (typeof t === 'function') ? t('logo_title') : 'Thập Tứ Tour';
  document.title = `${siteTitle} | ${tour.name}`;
  const breadcrumbName = document.getElementById('breadcrumbName');
  if (breadcrumbName) breadcrumbName.textContent = tour.name;

  const allTours = (typeof getLocalizedTours === 'function') ? getLocalizedTours() : TOURS;
  const otherTours = allTours.filter(t => t.id !== tour.id).slice(0, 3);

  const visitTitle = (typeof t === 'function') ? t('detail_visit_title') : 'Mốc thời gian ghé thăm trong chuyến đi:';
  const locLabel = (typeof t === 'function') ? t('detail_location') : 'Vị trí:';
  const durLabel = (typeof t === 'function') ? t('detail_duration') : 'Thời lượng:';
  const tagLabel = (typeof t === 'function') ? t('detail_tags') : 'Đặc trưng:';
  const bestTimeTitle = (typeof t === 'function') ? t('detail_best_time') : 'Thời điểm đẹp nhất';
  const bestTimeDesc = (typeof t === 'function') ? t('detail_best_time_desc') : 'Tháng 3 - Tháng 9 (mùa khô, biển êm, trời trong xanh rực rỡ)';
  const transTitle = (typeof t === 'function') ? t('detail_transport') : 'Phương tiện di chuyển';
  const transDesc = (typeof t === 'function') ? t('detail_transport_desc') : 'Xe máy, ô tô hoặc cano / thuyền tùy điểm đến';
  const expTitle = (typeof t === 'function') ? t('detail_experience') : 'Trải nghiệm du lịch';
  const expDesc = (typeof t === 'function') ? t('detail_experience_desc') : 'Chụp ảnh check-in, ngắm cảnh biển đảo, thưởng thức ẩm thực';
  const feeTitle = (typeof t === 'function') ? t('detail_fee') : 'Chi phí tham khảo';
  const feeDesc = (typeof t === 'function') ? t('detail_fee_desc') : 'Đã bao gồm trong chi phí trọn gói 5.920.000đ của chuyến đi';
  const introHeading = (typeof t === 'function') ? t('detail_intro_heading') : 'Giới thiệu về địa danh này';
  const highlightsHeading = (typeof t === 'function') ? t('detail_highlights_heading') : 'Trải nghiệm nổi bật & Lưu ý khi ghé thăm';
  const backHomeBtn = (typeof t === 'function') ? t('detail_btn_back_home') : '← Quay lại Trang Chủ';
  const backPlacesBtn = (typeof t === 'function') ? t('detail_btn_back_places') : 'Xem danh sách địa điểm';
  const relatedHeading = (typeof t === 'function') ? t('detail_related_heading') : 'Khám phá thêm các địa danh khác';

  let visitBannerHtml = '';
  if (tour.visitTime) {
    visitBannerHtml = `
      <div class="visit-schedule-banner">
        <span>⏰</span>
        <div>
          <strong>${visitTitle}</strong>
          <span>${tour.visitTime}</span>
        </div>
      </div>
    `;
  }

  let highlightsListHtml = '';
  if (tour.highlights && tour.highlights.length > 0) {
    highlightsListHtml = tour.highlights.map(item => `<li>${item}</li>`).join('');
  }

  let otherCardsHtml = '';
  otherTours.forEach(item => {
    otherCardsHtml += `
      <div class="related-card" onclick="window.location.href='tour-detail.html?id=${item.id}'" role="button" tabindex="0">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="related-body">
          <h4>${item.name}</h4>
          <p>${item.location}</p>
          <span class="related-link">${isEn ? 'View details →' : 'Xem chi tiết →'}</span>
        </div>
      </div>
    `;
  });

  main.innerHTML = `
    <div class="place-header">
      <div class="place-title-box">
        <span class="place-badge">${tour.badge || 'Điểm đến Quy Nhơn'}</span>
        <h1>${tour.name}</h1>
        <div class="place-meta">
          <span>${locLabel} <strong>${tour.location}</strong></span>
          <span>${durLabel} <strong>${tour.duration}</strong></span>
          <span>${tagLabel} <strong>${(tour.tags || []).join(', ')}</strong></span>
        </div>
      </div>
      <div class="place-hero-img-wrap">
        <img src="${tour.image}" alt="${tour.name}" class="place-hero-img">
      </div>
    </div>

    ${visitBannerHtml}

    <div class="quick-facts-grid">
      <div class="fact-item">
        <div class="fact-icon">🌤️</div>
        <div>
          <h4>${bestTimeTitle}</h4>
          <p>${bestTimeDesc}</p>
        </div>
      </div>
      <div class="fact-item">
        <div class="fact-icon">🛵</div>
        <div>
          <h4>${transTitle}</h4>
          <p>${transDesc}</p>
        </div>
      </div>
      <div class="fact-item">
        <div class="fact-icon">📸</div>
        <div>
          <h4>${expTitle}</h4>
          <p>${expDesc}</p>
        </div>
      </div>
      <div class="fact-item">
        <div class="fact-icon">🏷️</div>
        <div>
          <h4>${feeTitle}</h4>
          <p>${feeDesc}</p>
        </div>
      </div>
    </div>

    <div class="place-section">
      <h2>${introHeading}</h2>
      <div class="place-description">
        <p>${tour.description}</p>
      </div>
    </div>

    <div class="place-section">
      <h2>${highlightsHeading}</h2>
      <div class="info-grid">
        <div class="info-card info-includes">
          <h3>✨ Trải nghiệm không thể bỏ qua</h3>
          <ul>${highlightsListHtml}</ul>
        </div>
        <div class="info-card info-excludes">
          <h3>📌 Lưu ý từ tụi mình</h3>
          <ul>
            <li>Đem theo trang phục phù hợp, kem chống nắng và mũ nón khi đi biển đảo.</li>
            <li>Giữ gìn vệ sinh chung, không vứt rác bừa bãi tại các danh lam thắng cảnh.</li>
            <li>Đoàn luôn chuẩn bị sẵn dù và áo mưa tiện lợi hỗ trợ chu đáo suốt chuyến đi.</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="detail-back-bar">
      <a href="index.html" class="btn-back-home">${backHomeBtn}</a>
      <a href="index.html#dia-diem" class="btn-back-places">${backPlacesBtn} →</a>
    </div>

    <div class="related-places">
      <h2>${relatedHeading}</h2>
      <div class="related-grid">
        ${otherCardsHtml}
      </div>
    </div>
  `;
}

function initTourDetailPage() {
  const tourDetailMain = document.getElementById('tourDetailMain');
  if (!tourDetailMain) return;

  const urlParams = new URLSearchParams(window.location.search);
  const tourId = urlParams.get('id');
  const isEn = typeof getCurrentLang === 'function' && getCurrentLang() === 'en';

  if (!tourId) {
    const notFoundTitle = isEn ? 'Destination not found!' : 'Không tìm thấy địa danh này!';
    const notFoundLink = isEn ? '← Back to Home' : '← Quay lại Trang Chủ';
    tourDetailMain.innerHTML = `
      <div class="no-tours">
        <h2>${notFoundTitle}</h2>
        <p><a href="index.html#dia-diem">${notFoundLink}</a></p>
      </div>
    `;
    return;
  }

  const allTours = (typeof getLocalizedTours === 'function') ? getLocalizedTours() : TOURS;
  const tour = allTours.find(t => t.id === parseInt(tourId));
  if (!tour) {
    const notFoundTitle = isEn ? 'Destination does not exist!' : 'Địa danh không tồn tại!';
    const notFoundLink = isEn ? '← Click here to view all destinations' : '← Bấm vào đây để xem danh sách các địa danh';
    tourDetailMain.innerHTML = `
      <div class="no-tours">
        <h2>${notFoundTitle}</h2>
        <p><a href="index.html#dia-diem">${notFoundLink}</a></p>
      </div>
    `;
    return;
  }

  renderTourDetail(tour);
}

/* ===== HỆ THỐNG GIAO DIỆN SÁNG / TỐI (LIGHT / DARK THEME) ===== */

/**
 * Cập nhật tooltip & trạng thái cho nút chuyển đổi giao diện Sáng / Tối
 */
function updateThemeToggleUI(theme, lang) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const currentLang = lang || ((typeof getCurrentLang === 'function') ? getCurrentLang() : 'vi');
  const isDark = theme === 'dark';
  let label = '';
  if (typeof t === 'function') {
    label = isDark ? t('theme_toggle_light') : t('theme_toggle_dark');
  }
  if (!label) {
    label = isDark
      ? (currentLang === 'en' ? 'Switch to light mode' : 'Chuyển sang chế độ sáng')
      : (currentLang === 'en' ? 'Switch to dark mode' : 'Chuyển sang chế độ tối');
  }
  btn.setAttribute('title', label);
  btn.setAttribute('aria-label', label);
}

/**
 * Khởi tạo bộ chuyển đổi giao diện Sáng / Tối
 */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const getCurrentTheme = () => document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeToggleUI(getCurrentTheme());

  btn.addEventListener('click', () => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem('thap_tu_theme', newTheme);
    } catch (e) {}
    updateThemeToggleUI(newTheme);

    btn.style.transform = 'scale(0.85) rotate(15deg)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 180);
  });

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem('thap_tu_theme')) {
          const autoTheme = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', autoTheme);
          updateThemeToggleUI(autoTheme);
        }
      } catch (err) {}
    });
  }
}

/* ===== HỆ THỐNG ĐA NGÔN NGỮ (VIỆT - ANH) ===== */

/**
 * Khởi tạo bộ chuyển đổi ngôn ngữ
 */
function initLanguageSwitcher() {
  const currentLang = (typeof getCurrentLang === 'function') ? getCurrentLang() : 'vi';

  document.documentElement.lang = currentLang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.dataset.lang;
      if (typeof switchLanguage === 'function') {
        switchLanguage(targetLang);
      }
    });
  });

  if (currentLang === 'en' && typeof switchLanguage === 'function') {
    switchLanguage('en');
  }
}

/* ===== HIỆU ỨNG TƯƠNG TÁC CAO CẤP ===== */

/**
 * Thanh tiến trình cuộn trang
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/**
 * Con trỏ chuột tương tác ảo (Magic Custom Cursor) - 60Hz / 120Hz mượt mà tuyệt đối
 */
function initMagicCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  document.body.classList.add('has-magic-cursor');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let currentScale = 1;
  let targetScale = 1;
  let isHovering = false;
  let isDown = false;
  let isVisible = false;

  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      ringX = mouseX;
      ringY = mouseY;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  const interactiveSelector = 'a, button, input, select, textarea, [role="button"], .tour-card, .category-card, .timeline-content, .hero-btn, .hero-btn-video, .video-player-wrap, .stat-box, .weather-plan-box';

  document.addEventListener('mouseover', (e) => {
    if (!e.target) return;
    if (e.target.closest(interactiveSelector)) {
      if (!isHovering) {
        isHovering = true;
        ring.classList.add('cursor-hover');
        dot.classList.add('cursor-hover');
      }
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (!isHovering) return;
    const related = e.relatedTarget;
    if (!related || !related.closest(interactiveSelector)) {
      isHovering = false;
      ring.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover');
    }
  }, { passive: true });

  window.addEventListener('mousedown', () => {
    isDown = true;
  }, { passive: true });

  window.addEventListener('mouseup', () => {
    isDown = false;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    isVisible = true;
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  const renderCursor = () => {
    if (isVisible) {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;

      targetScale = isDown ? 0.72 : (isHovering ? 1.55 : 1.0);
      currentScale += (targetScale - currentScale) * 0.22;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) scale(${currentScale.toFixed(2)})`;
    }

    requestAnimationFrame(renderCursor);
  };

  requestAnimationFrame(renderCursor);
}

/**
 * Trình phát Video Quy Nhơn
 */
function initQuyNhonVideo() {
  const video = document.getElementById('quynhonVideo');
  const overlay = document.getElementById('videoPlayOverlay');
  const playBtn = document.getElementById('videoPlayBtn');
  if (!video || !overlay) return;

  const handlePlay = (e) => {
    if (e) e.stopPropagation();
    overlay.classList.add('is-hidden');
    video.play().catch(() => {});
  };

  if (playBtn) playBtn.addEventListener('click', handlePlay);
  overlay.addEventListener('click', handlePlay);

  video.addEventListener('play', () => {
    overlay.classList.add('is-hidden');
  });

  video.addEventListener('ended', () => {
    overlay.classList.remove('is-hidden');
  });
}

/**
 * Hiệu ứng cuộn trang xuất hiện mềm mại (Scroll Reveal)
 * Sử dụng IntersectionObserver hiệu năng cao, tự unobserve khi xuất hiện
 */
let scrollRevealObserver = null;

function triggerScrollReveal() {
  const elements = document.querySelectorAll(
    '.reveal-on-scroll, .section-title, .video-showcase-card, .about-us-card, .timeline-item, .tour-card, .category-card, .weather-plan-box, .umbrella-alert-banner, .tour-cost-summary-box'
  );
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  if (!scrollRevealObserver) {
    scrollRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          scrollRevealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });
  }

  elements.forEach(el => {
    if (!el.classList.contains('reveal-on-scroll')) {
      el.classList.add('reveal-on-scroll');
    }
    if (!el.classList.contains('is-revealed')) {
      scrollRevealObserver.observe(el);
    }
  });
}

function initScrollReveal() {
  triggerScrollReveal();
}

/* ===== KHỞI TẠO KHI TẢI TRANG ===== */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initLanguageSwitcher();
  initHomePage();
  initTourDetailPage();
  initScrollProgress();
  initMagicCursor();
  initQuyNhonVideo();
  initScrollReveal();
});
