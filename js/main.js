/**
 * Quy Nhơn 4N3Đ - MDS Collective Style Interactive Engine
 * Uses GSAP + ScrollTrigger + Dynamic SVG Bezier Connections + Interactive Console
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP ScrollTrigger if present
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Theme Toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      try {
        localStorage.setItem('mds_theme', newTheme);
      } catch (e) {}
    });
  }

  // 2. MDS Preloader 0 -> 100% & Hero Headline Reveal
  const loader = document.getElementById('loader');
  const ln = document.getElementById('ln');
  const lbar = document.getElementById('lbar');
  const heroWords = document.querySelectorAll('.hero h1 .w span');

  const revealHero = () => {
    if (loader) loader.classList.add('done');
    if (typeof gsap !== 'undefined') {
      gsap.to(heroWords, {
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.12,
        delay: 0.1
      });
    } else {
      heroWords.forEach(w => w.style.transform = 'none');
    }
  };

  if (loader && ln && lbar) {
    if (typeof gsap !== 'undefined') {
      const progressObj = { val: 0 };
      gsap.to(progressObj, {
        val: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          const rounded = Math.round(progressObj.val);
          ln.textContent = String(rounded);
          lbar.style.setProperty('--p', rounded + '%');
        },
        onComplete: () => {
          setTimeout(revealHero, 200);
        }
      });
    } else {
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        ln.textContent = String(p);
        lbar.style.setProperty('--p', p + '%');
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(revealHero, 200);
        }
      }, 30);
    }
  } else {
    revealHero();
  }

  // 3. Manifesto Text Scrubbing on Scroll (#mani)
  const mani = document.getElementById('mani');
  if (mani) {
    const rawText = (mani.textContent || '').trim();
    mani.innerHTML = rawText
      .split(/\s+/)
      .map(w => `<span class="w">${w}</span>`)
      .join(' ');

    const words = mani.querySelectorAll('.w');

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: mani,
        start: 'top 80%',
        end: 'bottom 45%',
        scrub: true,
        onUpdate: (self) => {
          const activeCount = Math.floor(self.progress * words.length);
          words.forEach((wordEl, idx) => {
            wordEl.classList.toggle('on', idx <= activeCount);
          });
        }
      });
    } else {
      words.forEach(w => w.classList.add('on'));
    }
  }

  // 4. Brand Hero Video Parallax Scrub
  const brandVideo = document.getElementById('brandVideo');
  if (brandVideo && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.to(brandVideo, {
      yPercent: 16,
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger: '.brand-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // 5. Dynamic SVG Bezier Flowchart (.flow)
  const flowWrap = document.getElementById('flowWrap');
  if (flowWrap) {
    const svgNs = 'http://www.w3.org/2000/svg';
    const svgLinks = document.createElementNS(svgNs, 'svg');
    svgLinks.setAttribute('class', 'links');
    svgLinks.setAttribute('aria-hidden', 'true');
    flowWrap.prepend(svgLinks);

    const nodes = Array.from(flowWrap.querySelectorAll('.node'));

    const renderFlowLinks = () => {
      svgLinks.innerHTML = '';
      const wrapRect = flowWrap.getBoundingClientRect();
      const isColumn = window.innerWidth <= 900;

      for (let i = 0; i < nodes.length - 1; i++) {
        const fromNode = nodes[i];
        const toNode = nodes[i + 1];

        const r1 = fromNode.getBoundingClientRect();
        const r2 = toNode.getBoundingClientRect();

        let pathD = '';
        if (isColumn) {
          // Top to Bottom
          const x1 = r1.left + r1.width / 2 - wrapRect.left;
          const y1 = r1.bottom - wrapRect.top;
          const x2 = r2.left + r2.width / 2 - wrapRect.left;
          const y2 = r2.top - wrapRect.top;
          const midY = (y1 + y2) / 2;
          pathD = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
        } else {
          // Left to Right
          const x1 = r1.right - wrapRect.left;
          const y1 = r1.top + r1.height / 2 - wrapRect.top;
          const x2 = r2.left - wrapRect.left;
          const y2 = r2.top + r2.height / 2 - wrapRect.top;
          const midX = (x1 + x2) / 2;
          pathD = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
        }

        const pathEl = document.createElementNS(svgNs, 'path');
        pathEl.setAttribute('d', pathD);
        if (i % 2 === 1) {
          pathEl.setAttribute('class', 'hot');
        }
        svgLinks.appendChild(pathEl);
      }
    };

    renderFlowLinks();
    window.addEventListener('resize', renderFlowLinks);
    setTimeout(renderFlowLinks, 500);
    setTimeout(renderFlowLinks, 1500);

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: flowWrap,
        start: 'top 85%',
        once: true,
        onEnter: () => setTimeout(renderFlowLinks, 400)
      });
    }
  }

  // 6. Interactive Expedition Console Terminal (#console)
  const cgrid = document.getElementById('cgrid');
  const clog = document.getElementById('clog');
  const cclock = document.getElementById('cclock');

  if (cgrid && clog && cclock) {
    const cols = window.innerWidth <= 768 ? 8 : 12;
    const rows = cols === 8 ? 8 : 9;
    const cells = [];

    // Populate LED Matrix
    for (let i = 0; i < cols * rows; i++) {
      const cell = document.createElement('div');
      cell.className = 'c';
      cgrid.appendChild(cell);
      cells.push(cell);
    }

    const flashCell = (el, type) => {
      el.classList.add(type);
      setTimeout(() => el.classList.remove(type), type === 'on' ? 900 : type === 'o' ? 1100 : 1400);
    };

    // Pointer Ripple on Grid
    cgrid.addEventListener('pointermove', (e) => {
      const target = e.target;
      if (target && target.classList && target.classList.contains('c')) {
        flashCell(target, 'o');
        const idx = cells.indexOf(target);
        [idx - 1, idx + 1, idx - cols, idx + cols].forEach(nIdx => {
          if (cells[nIdx] && Math.random() < 0.5) {
            flashCell(cells[nIdx], 'p');
          }
        });
      }
    });

    // Ambient random twinkle
    setInterval(() => {
      const randCell = cells[Math.floor(Math.random() * cells.length)];
      if (randCell) {
        flashCell(randCell, Math.random() < 0.25 ? 'w' : 'p');
      }
    }, 280);

    // Live Clock (HH:MM:SS)
    const getNowTime = () => {
      const now = new Date();
      return [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(n => String(n).padStart(2, '0'))
        .join(':');
    };

    cclock.textContent = getNowTime();
    setInterval(() => {
      cclock.textContent = getNowTime();
    }, 250);

    // Streaming Expedition Logs
    const streamLogs = [
      'Trạm thời tiết Kỳ Co: Nhiệt độ 28°C, gió nhẹ, biển êm dịu',
      'Thủy triều Bãi Dứa: Tầm nhìn lặn san hô lý tưởng đạt 12m',
      'Khách sạn Odin: Tiêu chuẩn phòng 4 sao sẵn sàng check-in',
      'Đội cano Nhơn Lý: Đã đăng kiểm an toàn hàng hải phục vụ đoàn',
      'Bếp Lộc Biển: Lô cá thu và tôm hùm tươi vừa cập cảng sớm',
      'ExploraScience: Lịch chiếu nhà vòm thiên văn mở cửa bình thường',
      'Ghềnh Ráng: Bãi đá trứng Hoàng Hậu thoáng đãng đón bình minh',
      'Cung đường Eo Gió: Tầm nhìn hoàng hôn không mây tuyệt đẹp',
      'Đặc sản Chợ Đầm: Lô bánh ít lá gai và tré rơm mới ra lò',
      'Xe giường nằm: Kiểm tra định kỳ an toàn kỹ thuật 100%'
    ];

    let logIdx = 0;
    const appendLog = () => {
      const logDiv = document.createElement('div');
      logDiv.innerHTML = `<span>[${getNowTime()}]</span>${streamLogs[logIdx % streamLogs.length]} ...`;
      clog.appendChild(logDiv);

      requestAnimationFrame(() => logDiv.classList.add('show'));

      const maxLogs = window.innerWidth <= 768 ? 5 : 7;
      while (clog.children.length > maxLogs) {
        clog.removeChild(clog.firstChild);
      }

      logIdx++;
      // Trigger a few cells
      for (let k = 0; k < 3; k++) {
        flashCell(cells[Math.floor(Math.random() * cells.length)], 'on');
      }

      setTimeout(appendLog, 1600 + Math.random() * 1800);
    };

    appendLog();
  }

  // 7. Day Tabs Switching
  const tabBtns = document.querySelectorAll('.tabs-row .tab-btn');
  const dayBoxes = document.querySelectorAll('.day-box');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetDay = btn.getAttribute('data-day');
      if (!targetDay) return;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      dayBoxes.forEach(box => {
        if (box.id === targetDay) {
          box.classList.add('active');
        } else {
          box.classList.remove('active');
        }
      });
    });
  });

  // 8. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const qBtn = item.querySelector('.faq-q');
    if (!qBtn) return;

    qBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      if (isOpen) {
        item.classList.remove('open');
      } else {
        item.classList.add('open');
      }
    });
  });
});
