/* =========================================================
   RAFTAKI ADAMLAR — script.js
   - Daktilo (typing) efekti
   - Scroll reveal (fade-up / okuyucu paragrafları)
   - Tooltip kutucukları
   - 3D kitap kapağı tilt efekti
   - OLIVIA MODE easter egg (klavye dinleyici + gizli ikon)
   - Navbar scroll durumu
   - Bildirim formu
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initTypewriter();
  initScrollReveal();
  initTooltips();
  initBookTilt();
  initOliviaMode();
  initNotifyForm();
});

/* ---------------------------------------------------------
   1) NAVBAR — scroll oldukça arka planı koyulaştır
--------------------------------------------------------- */
function initNavbarScroll(){
  const nav = document.getElementById('navbar');
  if(!nav) return;
  const onScroll = () => {
    if(window.scrollY > 40){
      nav.classList.add('scrolled');
    }else{
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------
   2) DAKTİLO (TYPEWRITER) EFEKTİ — hero slogan
--------------------------------------------------------- */
function initTypewriter(){
  const el = document.getElementById('typewriter');
  if(!el) return;

  const fullText = 'Bazı sevgiler kalpte kalmaz; raflara dizilir…';
  const speed = 42; // ms / karakter
  const startDelay = 500;

  let i = 0;

  const type = () => {
    if(i <= fullText.length){
      el.textContent = fullText.slice(0, i);
      i++;
      setTimeout(type, speed);
    }
  };

  setTimeout(type, startDelay);
}

/* ---------------------------------------------------------
   3) SCROLL REVEAL — fade-up sınıflı elemanlar
      + okuyucu paragrafları tek tek belirir
--------------------------------------------------------- */
function initScrollReveal(){
  const targets = document.querySelectorAll('.fade-up, .reader-p');
  if(!('IntersectionObserver' in window)){
    targets.forEach(t => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(t => observer.observe(t));
}

/* ---------------------------------------------------------
   4) TOOLTIP — bölüm metnindeki kritik isimler
--------------------------------------------------------- */
function initTooltips(){
  const terms = document.querySelectorAll('.tt');
  const box = document.getElementById('tooltipBox');
  if(!terms.length || !box) return;

  const showBox = (term) => {
    box.textContent = term.dataset.tt || '';
    box.classList.add('visible');
    positionBox(term);
  };

  const hideBox = () => box.classList.remove('visible');

  const positionBox = (term) => {
    const rect = term.getBoundingClientRect();
    const boxWidth = box.offsetWidth || 240;
    let left = rect.left + rect.width / 2 - boxWidth / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - boxWidth - 12));
    const top = rect.top - box.offsetHeight - 12;

    box.style.left = `${left}px`;
    box.style.top = `${Math.max(12, top)}px`;
  };

  terms.forEach(term => {
    term.addEventListener('mouseenter', () => showBox(term));
    term.addEventListener('mouseleave', hideBox);
    term.addEventListener('focus', () => showBox(term));
    term.addEventListener('blur', hideBox);
    term.addEventListener('touchstart', (e) => {
      e.preventDefault();
      showBox(term);
      setTimeout(hideBox, 2200);
    }, { passive: false });
    term.setAttribute('tabindex', '0');
  });

  window.addEventListener('scroll', hideBox, { passive: true });
}

/* ---------------------------------------------------------
   5) 3D KİTAP KAPAĞI — fare hareketiyle tilt
--------------------------------------------------------- */
function initBookTilt(){
  const stage = document.getElementById('bookStage');
  const cover = document.getElementById('bookCover');
  if(!stage || !cover) return;

  const maxTilt = 14;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0 - 1
    const y = (e.clientY - rect.top) / rect.height;  // 0 - 1

    const tiltX = (x - 0.5) * maxTilt * 2;
    const tiltY = (0.5 - y) * maxTilt * 2;

    cover.style.setProperty('--tilt-x', `${tiltX}deg`);
    cover.style.setProperty('--tilt-y', `${tiltY}deg`);
  });

  stage.addEventListener('mouseleave', () => {
    cover.style.setProperty('--tilt-x', '0deg');
    cover.style.setProperty('--tilt-y', '0deg');
  });

  // Dokunmatik cihazlarda hafif otomatik sallanma
  if(window.matchMedia('(hover: none)').matches){
    let t = 0;
    setInterval(() => {
      t += 0.04;
      cover.style.setProperty('--tilt-x', `${Math.sin(t) * 5}deg`);
      cover.style.setProperty('--tilt-y', `${Math.cos(t * 0.8) * 3}deg`);
    }, 60);
  }
}

/* ---------------------------------------------------------
   6) OLIVIA MODE — gizli easter egg
      - Klavyede "OLIVIA" yazmak
      - Kitap kapağındaki gizli ikona tıklamak
--------------------------------------------------------- */
function initOliviaMode(){
  const html = document.documentElement;
  const body = document.body;
  const overlay = document.getElementById('oliviaOverlay');
  const secretIcon = document.getElementById('secretIcon');

  const SECRET_WORD = 'OLIVIA';
  let buffer = '';

  const triggerGlitchBurst = () => {
    body.classList.remove('glitch-burst');
    // reflow ile animasyonu yeniden tetikle
    void body.offsetWidth;
    body.classList.add('glitch-burst');
    setTimeout(() => body.classList.remove('glitch-burst'), 450);
  };

  const showOverlay = () => {
    if(!overlay) return;
    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 1600);
  };

  const toggleOliviaMode = () => {
    html.classList.toggle('olivia-mode');
    triggerGlitchBurst();
    showOverlay();
  };

  // --- klavye dinleyici ---
  window.addEventListener('keydown', (e) => {
    if(e.key.length !== 1 || !/[a-zA-Z]/.test(e.key)) return;
    buffer = (buffer + e.key.toUpperCase()).slice(-SECRET_WORD.length);
    if(buffer === SECRET_WORD){
      toggleOliviaMode();
      buffer = '';
    }
  });

  // --- gizli ikon ---
  if(secretIcon){
    secretIcon.addEventListener('click', toggleOliviaMode);
  }
}

/* ---------------------------------------------------------
   7) BİLDİRİM FORMU — "Yeni bölüm yayınlandığında haber ver"
--------------------------------------------------------- */
function initNotifyForm(){
  const form = document.getElementById('notifyForm');
  const msg = document.getElementById('notifyMsg');
  if(!form || !msg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('notifyEmail');
    if(!email || !email.value) return;

    // Not: Gerçek bir backend/e-posta servisi bağlanana kadar
    // bu sadece arayüzde bir onay mesajı gösterir.
    msg.style.opacity = '1';
    form.reset();

    setTimeout(() => {
      msg.style.opacity = '0';
    }, 5000);
  });
}