/* ============================================================
   TimeCamp Apps Landing Page — apps.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. Scroll Reveal (Intersection Observer)
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));


  /* ----------------------------------------------------------
     2. Download icon click → smooth scroll to products
  ---------------------------------------------------------- */
  const dlTrigger = document.querySelector('.dl-trigger');
  const productsSection = document.querySelector('#products');

  if (dlTrigger && productsSection) {
    dlTrigger.addEventListener('click', () => {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }


  /* ----------------------------------------------------------
     3. Download table tabs
  ---------------------------------------------------------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tableRows = document.querySelectorAll('tbody tr[data-product]');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      tableRows.forEach(row => {
        if (filter === 'all' || row.dataset.product === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });


  /* ----------------------------------------------------------
     4. CTA button pulse animation on hover
  ---------------------------------------------------------- */
  const primaryBtns = document.querySelectorAll('.btn--primary');

  primaryBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-3px) scale(1.02)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  /* ----------------------------------------------------------
     5. Animated counter for hero stats
  ---------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString('pl-PL') + suffix;
        }, 16);

        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => countObserver.observe(el));


  /* ----------------------------------------------------------
     6. Sticky bar shadow on scroll
  ---------------------------------------------------------- */
  const productBar = document.querySelector('.product-bar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      productBar.style.boxShadow = '0 4px 20px rgba(0,43,73,.15)';
    } else {
      productBar.style.boxShadow = '0 2px 8px rgba(0,43,73,.08)';
    }
  }, { passive: true });


  /* ----------------------------------------------------------
     7. OS detection — highlight relevant download row
  ---------------------------------------------------------- */
  const ua = navigator.userAgent.toLowerCase();
  let detectedOS = null;

  if (ua.includes('win'))    detectedOS = 'windows';
  else if (ua.includes('mac')) detectedOS = 'mac';
  else if (ua.includes('linux')) detectedOS = 'linux';

  if (detectedOS) {
    const matchRow = document.querySelector(`tr[data-product="${detectedOS}"]`);
    if (matchRow) {
      matchRow.style.background = 'rgba(37,207,96,.06)';
      const badge = matchRow.querySelector('.td-badge');
      if (badge) {
        const yourOS = document.createElement('span');
        yourOS.textContent = ' ← Twój system';
        yourOS.style.cssText = 'font-size:11px;color:#25cf60;font-weight:700;';
        badge.appendChild(yourOS);
      }
    }

    // Also activate matching tab
    const matchTab = document.querySelector(`.tab-btn[data-filter="${detectedOS}"]`);
    if (matchTab) {
      tabBtns.forEach(b => b.classList.remove('active'));
      matchTab.classList.add('active');
      matchTab.click();
    }
  }


  /* ----------------------------------------------------------
     8. Video card — open YouTube in lightbox-style overlay
  ---------------------------------------------------------- */
  const videoCards = document.querySelectorAll('.video-card[data-yt]');

  videoCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const ytId = card.dataset.yt;
      if (!ytId) return;

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,.85);
        display:flex;align-items:center;justify-content:center;
        z-index:9999;animation:fadeIn .3s ease;
      `;

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
      iframe.style.cssText = 'width:min(900px,90vw);aspect-ratio:16/9;border:none;border-radius:12px;';
      iframe.allow = 'autoplay; fullscreen';

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = `
        position:absolute;top:20px;right:24px;
        background:none;border:none;color:#fff;
        font-size:2.5rem;cursor:pointer;line-height:1;
      `;

      overlay.appendChild(iframe);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      const close = () => {
        overlay.remove();
        document.body.style.overflow = '';
      };

      closeBtn.addEventListener('click', close);
      overlay.addEventListener('click', (ev) => { if (ev.target === overlay) close(); });
      document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); }, { once: true });
    });
  });

});
