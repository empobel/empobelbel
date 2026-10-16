/**
 * Thập Tứ Tour Quy Nhơn — MDS Collective Interactive Engine
 * Reverse engineered & adapted for luxury travel showcase
 */

(function() {
  'use strict';

  // 1. TORCH CURSOR EFFECT
  (function initTorch() {
    var torch = document.getElementById('torch');
    if (!torch) return;

    var curX = window.innerWidth / 2;
    var curY = window.innerHeight / 2;
    var targetX = curX;
    var targetY = curY;
    var curR = 260;
    var targetR = 260;
    var isMoving = false;
    var scrollTimeout = null;

    function renderTorch() {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      curR += (targetR - curR) * 0.08;

      torch.style.setProperty('--x', curX.toFixed(1) + 'px');
      torch.style.setProperty('--y', curY.toFixed(1) + 'px');
      torch.style.setProperty('--r', curR.toFixed(1) + 'px');

      requestAnimationFrame(renderTorch);
    }
    renderTorch();

    window.addEventListener('pointermove', function(e) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        curX = targetX;
        curY = targetY;
        torch.classList.add('on');
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function() {
      torch.classList.remove('on');
      isMoving = false;
    });

    window.addEventListener('scroll', function() {
      targetR = 300;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        targetR = 260;
      }, 300);
    }, { passive: true });
  })();

  // 2. PRELOADER & HERO STAGGER
  (function initLoader() {
    var loader = document.getElementById('loader');
    var ln = document.getElementById('ln');
    var lbar = document.getElementById('lbar');
    var heroWords = document.querySelectorAll('.hero h1 .w span');

    function revealHero() {
      if (loader) loader.classList.add('done');
      if (window.gsap && heroWords.length) {
        gsap.to(heroWords, {
          y: 0,
          duration: 1.3,
          ease: 'power4.out',
          stagger: 0.09,
          delay: 0.15
        });
      } else {
        heroWords.forEach(function(el) {
          el.style.transform = 'none';
        });
      }
    }

    if (!loader || !ln) {
      revealHero();
      return;
    }

    if (window.gsap) {
      var progress = { v: 0 };
      gsap.to(progress, {
        v: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: function() {
          var val = Math.round(progress.v);
          ln.textContent = String(val);
          if (lbar) lbar.style.setProperty('--p', val + '%');
        },
        onComplete: function() {
          setTimeout(revealHero, 200);
        }
      });
    } else {
      var count = 0;
      var timer = setInterval(function() {
        count += 4;
        if (count > 100) count = 100;
        ln.textContent = String(count);
        if (lbar) lbar.style.setProperty('--p', count + '%');
        if (count === 100) {
          clearInterval(timer);
          setTimeout(revealHero, 250);
        }
      }, 30);
    }
  })();

  // 3. NAVIGATION (STICKY, BURGER, FULLSCREEN MENU & DROPDOWNS)
  (function initNav() {
    var nav = document.querySelector('nav');
    var brandHero = document.querySelector('.brand-hero');
    var openBtn = document.getElementById('open');
    var closeBtn = document.getElementById('closeMenu');
    var menu = document.getElementById('menu');

    function updateNav() {
      if (!nav) return;
      var triggerHeight = brandHero ? brandHero.offsetHeight - nav.offsetHeight : 20;
      nav.classList.toggle('solid', window.scrollY > triggerHeight);
    }
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav, { passive: true });

    if (openBtn && menu) {
      openBtn.addEventListener('click', function() {
        menu.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
        openBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      });
    }

    function closeMenuFn() {
      if (!menu) return;
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeMenuFn);

    if (menu) {
      menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', closeMenuFn);
      });
      window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
          closeMenuFn();
        }
      });
    }

    // Nav dropdowns
    document.querySelectorAll('nav .dd').forEach(function(dd) {
      var trigger = dd.querySelector('.dd-t');
      if (!trigger) return;

      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = dd.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      });

      document.addEventListener('click', function() {
        dd.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });

      dd.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          dd.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    });
  })();

  // 4. PARALLAX VIDEO & SCROLL TRIGGER SCRUBBING
  (function initHeroParallax() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    var video = document.querySelector('.brand-hero video');
    if (video) {
      gsap.to(video, {
        yPercent: 18,
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

    var heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
      gsap.to(heroTitle, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Figures reveal & scrub
    gsap.utils.toArray('.fig').forEach(function(fig) {
      var media = fig.querySelector('img, video');
      var speed = parseFloat(fig.dataset.speed || '0.12');
      if (media) {
        gsap.fromTo(media, 
          { yPercent: -speed * 100 / 1.2, scale: 1.08 },
          {
            yPercent: speed * 100 / 1.2,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: fig,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        );
      }
    });

    // Sub-reveals
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.reveal').forEach(function(el) {
      revealObserver.observe(el);
    });

    // Typography fade up
    gsap.utils.toArray('.up').forEach(function(el) {
      gsap.fromTo(el, 
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true
          }
        }
      );
    });
  })();

  // 5. MANIFESTO SCROLL SCRUBBING
  (function initManifesto() {
    var mani = document.getElementById('mani');
    if (!mani) return;

    var text = (mani.textContent || '').trim();
    mani.innerHTML = text.split(' ').map(function(word) {
      return '<span class="w">' + word + '</span>';
    }).join(' ');

    var words = mani.querySelectorAll('.w');
    if (!window.ScrollTrigger) {
      words.forEach(function(w) { w.classList.add('on'); });
      return;
    }

    ScrollTrigger.create({
      trigger: mani,
      start: 'top 80%',
      end: 'bottom 45%',
      scrub: true,
      onUpdate: function(self) {
        var activeIndex = Math.floor(self.progress * words.length);
        words.forEach(function(w, idx) {
          w.classList.toggle('on', idx <= activeIndex);
        });
      }
    });
  })();

  // 6. DYNAMIC SVG BEZIER FLOWCHART
  (function initFlow() {
    var flow = document.querySelector('.flow');
    if (!flow) return;

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'links');
    svg.setAttribute('aria-hidden', 'true');
    flow.prepend(svg);

    var nodes = Array.from(flow.querySelectorAll('.node'));
    if (nodes.length < 5) return;

    // Connections between stages:
    // [0]: Traveler, [1]: Hub, [2]: Ky Co, [3]: Eo Gio, [4]: Odin 4*, [5]: Experience
    var pairs = [
      [nodes[0], nodes[1]],
      [nodes[1], nodes[2]],
      [nodes[1], nodes[3]],
      [nodes[2], nodes[4]],
      [nodes[2], nodes[5], true],
      [nodes[3], nodes[5], true]
    ];

    function drawLinks() {
      var flowRect = flow.getBoundingClientRect();
      var isCol = window.getComputedStyle(flow).flexDirection === 'column';
      svg.innerHTML = '';

      pairs.forEach(function(pair) {
        var nA = pair[0];
        var nB = pair[1];
        var isHot = pair[2];
        if (!nA || !nB) return;

        var rA = nA.getBoundingClientRect();
        var rB = nB.getBoundingClientRect();
        var startX, startY, endX, endY, d;

        if (isCol) {
          startX = rA.left + rA.width / 2 - flowRect.left;
          startY = rA.bottom - flowRect.top + 6;
          endX = rB.left + rB.width / 2 - flowRect.left;
          endY = rB.top - flowRect.top - 10;
          var midY = (startY + endY) / 2;
          d = 'M ' + startX + ' ' + startY + ' C ' + startX + ' ' + midY + ' ' + endX + ' ' + midY + ' ' + endX + ' ' + endY;
        } else {
          startX = rA.right - flowRect.left + 6;
          startY = rA.top + rA.height / 2 - flowRect.top;
          endX = rB.left - flowRect.left - 10;
          endY = rB.top + rB.height / 2 - flowRect.top;
          var midX = (startX + endX) / 2;
          d = 'M ' + startX + ' ' + startY + ' C ' + midX + ' ' + startY + ' ' + midX + ' ' + endY + ' ' + endX + ' ' + endY;
        }

        var path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', d);
        if (isHot) path.setAttribute('class', 'hot');
        svg.appendChild(path);

        // Arrow head
        var arr = document.createElementNS(svgNS, 'path');
        var tip = isCol ? [endX, endY + 4] : [endX + 4, endY];
        arr.setAttribute('d', isCol
          ? 'M ' + (tip[0] - 5) + ' ' + (tip[1] - 7) + ' L ' + tip[0] + ' ' + tip[1] + ' L ' + (tip[0] + 5) + ' ' + (tip[1] - 7)
          : 'M ' + (tip[0] - 7) + ' ' + (tip[1] - 5) + ' L ' + tip[0] + ' ' + tip[1] + ' L ' + (tip[0] - 7) + ' ' + (tip[1] + 5)
        );
        arr.setAttribute('style', 'stroke-dasharray:none;animation:none');
        if (isHot) arr.setAttribute('class', 'hot');
        svg.appendChild(arr);
      });
    }

    drawLinks();
    window.addEventListener('resize', drawLinks);
    window.addEventListener('load', drawLinks);
    setTimeout(drawLinks, 800);
    setTimeout(drawLinks, 2000);

    // Interactive node click toggle
    var aiNode = flow.querySelector('.node.ai');
    if (aiNode) {
      aiNode.addEventListener('click', function() {
        aiNode.classList.toggle('open');
        setTimeout(drawLinks, 300);
      });
    }
  })();

  // 7. DOUBLE INFINITE MARQUEE
  (function initMarquee() {
    var brandScript = document.getElementById('brands');
    if (!brandScript) return;

    var list;
    try {
      list = JSON.parse(brandScript.textContent || '[]');
    } catch(e) {
      list = [];
    }
    if (!list.length) return;

    function buildRow(id, items) {
      var el = document.getElementById(id);
      if (!el) return;
      el.textContent = '';
      var repeats = Math.max(3, Math.ceil(window.innerWidth * 2 / (items.length * 160)) * 2);
      for (var i = 0; i < repeats; i++) {
        items.forEach(function(item) {
          var span = document.createElement('span');
          span.textContent = item;
          if (i > 0) span.setAttribute('aria-hidden', 'true');
          el.appendChild(span);
        });
      }
    }

    var half = Math.ceil(list.length / 2);
    buildRow('marq1', list.slice(0, half));
    buildRow('marq2', list.slice(half));
  })();

  // 8. KEY STATS COUNTERS
  (function initStats() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.utils.toArray('[data-count]').forEach(function(el) {
      var target = parseFloat(el.dataset.count);
      var small = el.querySelector('small');
      var suffix = small ? small.outerHTML : '';
      var counter = { v: 0 };
      el.innerHTML = '0' + suffix;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: function() {
          gsap.to(counter, {
            v: target,
            duration: 1.6,
            ease: 'power3.out',
            onUpdate: function() {
              el.innerHTML = Math.round(counter.v) + suffix;
            }
          });
        }
      });
    });
  })();

  // 9. PROPRIETARY TECH CONSOLE
  (function initConsole() {
    var cgrid = document.getElementById('cgrid');
    var clog = document.getElementById('clog');
    var cclock = document.getElementById('cclock');
    if (!cgrid || !clog || !cclock) return;

    var isMobile = window.matchMedia('(max-width: 800px)').matches;
    var cols = isMobile ? 8 : 12;
    var rows = isMobile ? 8 : 9;
    var cells = [];

    cgrid.innerHTML = '';
    for (var i = 0; i < cols * rows; i++) {
      var cell = document.createElement('div');
      cell.className = 'c';
      cgrid.appendChild(cell);
      cells.push(cell);
    }

    function flashCell(cell, cls) {
      if (!cell) return;
      cell.classList.add(cls);
      setTimeout(function() {
        cell.classList.remove(cls);
      }, cls === 'on' ? 900 : (cls === 'o' ? 1100 : 1400));
    }

    cgrid.addEventListener('pointermove', function(e) {
      var target = e.target;
      if (target && target.classList && target.classList.contains('c')) {
        flashCell(target, 'o');
        var idx = cells.indexOf(target);
        var neighbors = [idx - 1, idx + 1, idx - cols, idx + cols];
        neighbors.forEach(function(nIdx) {
          if (cells[nIdx] && Math.random() < 0.45) {
            flashCell(cells[nIdx], 'p');
          }
        });
      }
    });

    cgrid.parentElement.addEventListener('pointerleave', function() {
      cells.forEach(function(c) { c.classList.remove('o'); });
    });

    setInterval(function() {
      var rand = cells[Math.floor(Math.random() * cells.length)];
      flashCell(rand, Math.random() < 0.25 ? 'w' : 'p');
    }, 280);

    function getFormattedTime() {
      var now = new Date();
      return [now.getHours(), now.getMinutes(), now.getSeconds()].map(function(n) {
        return String(n).padStart(2, '0');
      }).join(':');
    }

    cclock.textContent = getFormattedTime();
    setInterval(function() {
      cclock.textContent = getFormattedTime();
    }, 300);

    var logs = [
      'Thời tiết biển Kỳ Co: Nắng vàng, gió cấp 2, biển êm',
      'Nhiệt độ nước biển: 27.4°C · Tầm nhìn lặn san hô: 15m',
      'Thủy triều Eo Gió: Đang dâng, điều kiện chụp ảnh tuyệt đẹp',
      'Hệ thống cano cao tốc sẵn sàng tại bến Nhơn Lý',
      'Vận hành xe đón đoàn TP.HCM ➔ Quy Nhơn chuẩn giờ',
      'Kiểm định áo phao & kính lặn san hô đạt chuẩn 100%',
      'Phòng khách sạn Odin 4★ trung tâm thành phố sẵn sàng',
      'Thực đơn 7 món hải sản tươi sống làng chài hoàn tất',
      'Trung tâm ExploraScience: Suất chiếu vũ trụ đã xác nhận',
      'Đội ngũ điều phối & thợ ảnh sẵn sàng đồng hành'
    ];
    var logIndex = 0;

    function pushLog() {
      var row = document.createElement('div');
      row.innerHTML = '<span>' + getFormattedTime() + '</span>' + logs[logIndex % logs.length] + ' ...';
      clog.appendChild(row);
      requestAnimationFrame(function() {
        row.classList.add('show');
      });

      var maxRows = isMobile ? 6 : 7;
      while (clog.children.length > maxRows) {
        clog.removeChild(clog.firstChild);
      }
      logIndex++;

      for (var f = 0; f < 3; f++) {
        flashCell(cells[Math.floor(Math.random() * cells.length)], 'on');
      }

      setTimeout(pushLog, 1500 + Math.random() * 1800);
    }
    pushLog();
  })();

  // 10. QUOTE MARK HIGHLIGHTS
  (function initMarkHighlights() {
    var marks = document.querySelectorAll('.quote mark, .trow mark');
    if (!marks.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -15% 0px' });

    marks.forEach(function(m) { observer.observe(m); });
  })();

  // 11. INQUIRY FORM (NON-BOOKING Q&A ONLY)
  (function initInquiryForm() {
    var form = document.getElementById('f');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var oldText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Đang gửi thông tin...';
        setTimeout(function() {
          form.innerHTML = '<div style="padding:40px;text-align:center;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);">' +
            '<h3 style="font-family:var(--serif);font-size:28px;margin-bottom:12px;">Đã nhận câu hỏi tư vấn!</h3>' +
            '<p style="color:var(--ink2);margin:0;line-height:1.6;">Cảm ơn bạn đã quan tâm đến hành trình Quy Nhơn 4N3Đ. Đội ngũ Thập Tứ Tour sẽ phản hồi giải đáp thông tin chi tiết qua Zalo/Email trong thời gian sớm nhất.</p>' +
            '</div>';
        }, 800);
      }
    });
  })();

})();
