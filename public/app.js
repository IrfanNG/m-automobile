/* M Automobile. Core features run straight away. The motion libraries (GSAP, ScrollTrigger,
   SplitText, Lenis) load on the visitor's first interaction, so the first screen never waits for them.
   Every feature checks its elements exist. */
(() => {
  const WA = 'https://wa.me/60132078119';
  const root = document.documentElement;
  const motionPref = root.classList.contains('motion'); // set in <head> unless reduced motion
  let motionOK = false; // true once GSAP is loaded
  const arrived = root.classList.contains('curtain-on');

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const desktop = matchMedia('(min-width: 1001px) and (hover: hover)');

  /* ---------- WhatsApp links with prefilled text ---------- */
  $$('[data-wa]').forEach(a => {
    const msg = a.dataset.wa || 'Salam M Automobile. Saya nak bertanya tentang servis kenderaan.';
    a.href = `${WA}?text=${encodeURIComponent(msg)}`;
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* ---------- Smooth scroll (Lenis on desktop, started with the motion libraries) ---------- */
  let lenis = null;
  const scrollToEl = (el) => {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: el === document.body ? 0 : -80, duration: 1.4 });
    else el.scrollIntoView({ behavior: motionPref ? 'smooth' : 'auto' });
  };

  /* ---------- Menu ---------- */
  const hdr = $('.hdr'), menuBtn = $('.menu-btn'), nav = $('#nav');
  function closeMenu() { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', () => {
    const o = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(o));
    hdr.classList.remove('hide');
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { if (!nav.contains(e.target) && !menuBtn.contains(e.target)) closeMenu(); });

  /* ---------- Page transition: orange curtain ---------- */
  const curtain = $('.curtain');
  const openFromHash = (hash) => {
    let d = null;
    try { d = hash && $(decodeURIComponent(hash)); } catch {}
    if (d && d.tagName === 'DETAILS') d.open = true;
    return d;
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;

    // Same page: scroll to the anchor
    if (url.pathname === location.pathname) {
      if (!url.hash) { if (a.getAttribute('href') !== location.pathname) return; e.preventDefault(); closeMenu(); scrollToEl(document.body); return; }
      e.preventDefault(); closeMenu();
      scrollToEl(url.hash === '#top' ? document.body : openFromHash(url.hash));
      history.replaceState(null, '', url.hash === '#top' ? location.pathname : url.hash);
      return;
    }

    // Other page: cover, then navigate
    if (!motionPref || !curtain) return;
    e.preventDefault(); closeMenu();
    root.classList.remove('curtain-on');
    curtain.classList.remove('cover'); void curtain.offsetWidth;
    curtain.classList.add('cover');
    try { sessionStorage.setItem('mt', '1'); } catch {}
    setTimeout(() => { location.href = url.href; }, 560);
  });
  // Back/forward cache: page comes back still covered
  addEventListener('pageshow', e => { if (e.persisted && curtain) { curtain.classList.remove('cover'); root.classList.remove('curtain-on'); } });

  /* ---------- Header: solid after hero, hide on scroll down ---------- */
  const hero = $('.hero, .phero');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    hdr.classList.toggle('solid', !hero || y > hero.offsetHeight - 90);
    const open = nav.classList.contains('open');
    hdr.classList.toggle('hide', !open && y > lastY && y > 400);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); requestAnimationFrame(onScroll);

  /* ---------- Enquiry builder ---------- */
  const form = $('.enq-steps');
  if (form) {
    const out = k => $(`[data-out="${k}"]`);
    const setOut = (k, val, fallback) => {
      const el = out(k);
      const next = val || fallback;
      if (el.textContent === next) return;
      el.textContent = next;
      el.classList.toggle('empty', !val);
      if (motionOK && val) gsap.fromTo(el, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: .35, ease: 'power2.out' });
    };
    const build = () => {
      const fd = new FormData(form);
      const veh = fd.get('veh') || '';
      const heavy = !!form.querySelector('input[name="veh"]:checked[data-heavy]');
      const sizeField = $('.field-heavy');
      if (sizeField.hidden === heavy) {
        sizeField.hidden = !heavy;
        if (heavy && motionOK) gsap.from(sizeField, { opacity: 0, y: -8, duration: .35 });
      }
      const model = (fd.get('model') || '').trim();
      const size = heavy ? (fd.get('size') || '').trim() : '';
      const vehTxt = [veh, model, size].filter(Boolean).join(', ');
      const jobs = fd.getAll('job').join(', ');
      const issue = (fd.get('issue') || '').trim();
      const when = fd.get('when') || '';

      setOut('veh', vehTxt, 'pilih kenderaan');
      setOut('job', jobs, 'pilih kerja');
      setOut('when', when, 'pilih hari');
      $('.issue-line').hidden = !issue;
      out('issue').textContent = issue;

      $('[data-step="veh"]').classList.toggle('done', !!veh);
      $('[data-step="job"]').classList.toggle('done', !!jobs);
      $('[data-step="when"]').classList.toggle('done', !!when);

      const lines = ['Salam M Automobile. Saya nak semak slot bengkel.'];
      if (vehTxt) lines.push(`Kenderaan: ${vehTxt}`);
      if (jobs) lines.push(`Kerja: ${jobs}`);
      if (issue) lines.push(`Masalah: ${issue}`);
      if (when) lines.push(`Bila: ${when}`);
      $('#send').href = `${WA}?text=${encodeURIComponent(lines.join('\n'))}`;
    };
    form.addEventListener('input', build);
    form.addEventListener('change', e => {
      build();
      if (motionOK && e.target.matches('.chip input')) gsap.fromTo(e.target.nextElementSibling, { scale: .9 }, { scale: 1, duration: .45, ease: 'back.out(3)' });
    });
    $('#send').target = '_blank'; $('#send').rel = 'noopener';
    build();
  }

  /* ---------- Copy address ---------- */
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch {}
    b.textContent = 'Disalin ✓';
    setTimeout(() => (b.textContent = 'Salin alamat'), 2200);
  }));

  /* ---------- Opening hours: highlight today, show open/closed (Malaysia time) ---------- */
  $$('[data-hours]').forEach(ul => {
    const days = JSON.parse(ul.dataset.hours);
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(p => [p.type, p.value]));
    const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
    const now = `${parts.hour}:${parts.minute}`;
    const byDow = d => days.find(x => x.dow === d);
    const li = ul.querySelector(`[data-dow="${dow}"]`); if (li) li.classList.add('today');
    const t = byDow(dow);
    let open = false, msg;
    if (t && t.open && now >= t.open && now < t.close) { open = true; msg = `Buka sekarang · tutup ${t.c}`; }
    else if (t && t.open && now < t.open) msg = `Tutup sekarang · buka ${t.o}`;
    else {
      for (let i = 1; i <= 7; i++) {
        const n = byDow((dow + i) % 7);
        if (n && n.open) { msg = `Tutup sekarang · buka ${i === 1 ? 'esok' : n.day} ${n.o}`; break; }
      }
    }
    const st = ul.parentElement.querySelector('[data-hours-now]');
    if (st && msg) { st.lastElementChild.textContent = msg; st.classList.toggle('open', open); st.hidden = false; }
  });

  /* ---------- FAQ: one open at a time (+ search when present) ---------- */
  const items = $$('#faq details');
  items.forEach(d => {
    d.dataset.q = d.querySelector('summary').textContent;
    d.addEventListener('toggle', () => {
      if (!d.open) return;
      items.forEach(o => { if (o !== d) o.open = false; });
      if (motionOK) gsap.from(d.querySelector('.ans'), { height: 0, opacity: 0, duration: .45, ease: 'power3.out', clearProps: 'height,opacity' });
    });
  });
  if (location.hash) { const d = openFromHash(location.hash); if (d) setTimeout(() => scrollToEl(d), arrived ? 700 : 100); }

  const q = $('#faq-q');
  if (q) {
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const runSearch = () => {
      const term = q.value.trim();
      const words = term.toLowerCase().split(/\s+/).filter(w => w.length > 1);
      let shown = 0;
      items.forEach(d => {
        const sum = d.querySelector('summary'), ans = d.querySelector('.ans');
        const hay = (d.dataset.q + ' ' + ans.textContent).toLowerCase();
        const hit = !words.length || words.every(w => hay.includes(w));
        d.hidden = !hit;
        if (hit) shown++;
        if (words.length && hit) {
          const re = new RegExp(`(${words.map(esc).join('|')})`, 'gi');
          sum.innerHTML = d.dataset.q.replace(re, '<mark>$1</mark>');
        } else sum.textContent = d.dataset.q;
      });
      $('#faq-count').textContent = words.length ? `${shown} daripada ${items.length} soalan` : '';
      $('#faq-empty').hidden = !(words.length && !shown);
      $('#faq-term').textContent = term;
      $('#faq-ask').href = `${WA}?text=${encodeURIComponent('Salam M Automobile. Saya nak tanya: ' + term)}`;
    };
    q.addEventListener('input', runSearch);
    $('#faq-clear').addEventListener('click', () => { q.value = ''; runSearch(); q.focus(); });
  }

  /* ---------- Job list: active row (hover on desktop, scroll position on touch) ---------- */
  const jobs = $$('.job');
  if (jobs.length) {
    const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#%&*+=';
    const scramble = (el) => {
      if (!motionPref || el._scr) return;
      const final = el.textContent; el._scr = true;
      el.style.minWidth = el.getBoundingClientRect().width + 'px';
      const start = performance.now(), dur = 320;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1), keep = Math.floor(p * final.length);
        el.textContent = final.replace(/\S/g, (c, i) => i < keep ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]);
        if (p < 1) requestAnimationFrame(tick); else { el.textContent = final; el.style.minWidth = ''; el._scr = false; }
      };
      requestAnimationFrame(tick);
    };
    const activate = (li) => {
      jobs.forEach(j => { if (j !== li) j.classList.remove('on'); });
      if (!li || li.classList.contains('on')) return;
      li.classList.add('on');
      $$('[data-scramble]', li).forEach(scramble);
    };
    if (matchMedia('(hover: hover)').matches) {
      jobs.forEach(li => li.addEventListener('mouseenter', () => activate(li)));
      $('.jobs').addEventListener('mouseleave', () => activate(null));
    } else {
      const jio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) activate(e.target); }), { rootMargin: '-45% 0px -45% 0px' });
      jobs.forEach(li => jio.observe(li));
    }
  }

  /* ---------- Google Map: loads after the visitor's first interaction, when near the screen ---------- */
  const maps = $$('iframe[data-src]');
  if (maps.length) {
    const MAP_EVENTS = ['pointerdown', 'pointermove', 'touchstart', 'wheel', 'scroll', 'keydown'];
    let armed = false;
    const arm = () => {
      if (armed) return; armed = true;
      MAP_EVENTS.forEach(ev => removeEventListener(ev, arm));
      const mio = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.src = e.target.dataset.src; mio.unobserve(e.target); }
      }), { rootMargin: '300px 0px' });
      maps.forEach(m => mio.observe(m));
    };
    MAP_EVENTS.forEach(ev => addEventListener(ev, arm, { passive: true }));
  }

  /* ---------- Phone dock ---------- */
  const dock = $('.dock'), slot = $('#slot');
  const updDock = () => {
    const heroOut = hero ? hero.getBoundingClientRect().bottom < 0 : scrollY > 300;
    const r = slot && slot.getBoundingClientRect();
    dock.classList.toggle('show', heroOut && !(r && r.top < innerHeight && r.bottom > 0));
  };
  addEventListener('scroll', updDock, { passive: true }); requestAnimationFrame(updDock);

  /* =================== MOTION: loaded on first interaction =================== */
  if (!motionPref) return;
  const VENDOR = ['/vendor/gsap.min.js', '/vendor/ScrollTrigger.min.js', '/vendor/SplitText.min.js', '/vendor/lenis.min.js'];
  const EVENTS = ['pointerdown', 'pointermove', 'touchstart', 'wheel', 'scroll', 'keydown'];
  const load = (src) => new Promise((ok, fail) => { const el = document.createElement('script'); el.src = src; el.onload = ok; el.onerror = fail; document.head.appendChild(el); });
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    EVENTS.forEach(ev => removeEventListener(ev, start));
    VENDOR.reduce((p, src) => p.then(() => load(src)), Promise.resolve()).then(initMotion).catch(() => {});
  };
  EVENTS.forEach(ev => addEventListener(ev, start, { passive: true }));

  function initMotion() {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    // Phones: the address bar showing/hiding resizes the viewport; don't recalculate (that causes jumps)
    ScrollTrigger.config({ ignoreMobileResize: true });
    motionOK = true;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches; // mouse/trackpad
    const wide = matchMedia('(min-width: 1001px)').matches;

    if (fine && window.Lenis) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Only animate what the visitor has not seen yet. Anything already on screen stays put.
    const unseen = (el) => el.getBoundingClientRect().top > innerHeight * 0.92;

    // SplitText masks clip at the line box. Headings have tight line-height and negative
    // letter-spacing, so descenders (g, p, y) and the last glyph's right edge get cut.
    // Grow each mask with padding and cancel it with negative margin: layout does not move.
    const roomy = (split) => {
      (split.masks || []).forEach(m => Object.assign(m.style, { padding: '0 .12em .22em', margin: '0 -.12em -.22em' }));
      return split;
    };

    /* Hero parallax: desktop with a mouse only. On phones the hero stays still. */
    if (fine && wide && $('.hero')) {
      gsap.to('.hero-media img', { yPercent: 12, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-in', { yPercent: -18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }

    /* Section headings: line reveal */
    $$('[data-split]').filter(unseen).forEach(el => {
      const sp = roomy(SplitText.create(el, { type: 'lines', mask: 'lines' }));
      gsap.from(sp.lines, { yPercent: 135, duration: 1.1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });

    /* Statement: words light up as you scroll */
    $$('[data-words]').filter(unseen).forEach(el => {
      const sp = SplitText.create(el, { type: 'words', wordsClass: 'w' });
      gsap.to(sp.words, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    });

    /* Generic reveal, batched */
    const rv = $$('[data-reveal]').filter(unseen);
    if (rv.length) {
      gsap.set(rv, { opacity: 0, y: 28 });
      ScrollTrigger.batch(rv, {
        start: 'top 92%',
        once: true,
        onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .07, overwrite: true }),
      });
    }

    /* Category image parallax: desktop only */
    if (fine) $$('.cat-img img').forEach(img => {
      gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    /* Footer big word */
    if ($('.ftr-big span') && unseen($('.ftr'))) gsap.from('.ftr-big span', { yPercent: 60, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.ftr', start: 'top 85%', once: true } });

    ScrollTrigger.refresh();
  }
})();
