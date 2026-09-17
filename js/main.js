// Mobile nav, scroll reveal, active links, progress bar, fab, contact form, footer year.
(function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  // Active nav + progress + fab on scroll
  var sections = ['about', 'education', 'skills', 'leadership', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var progress = document.getElementById('progress');
  var progressBar = progress ? progress.querySelector('::before') : null;
  var fab = document.getElementById('fabTop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;
    if (progress) {
      // drive the ::before via inline style on parent using CSS var fallback
      progress.style.setProperty('--p', p);
      var inner = progress.firstElementChild;
      // ::before can't be selected; use transform on pseudo via style sheet trick:
      // instead set background-size trick by toggling a child if present, else use style
      progress.setAttribute('data-p', String(p));
      if (progress.shadowRoot === undefined) {
        // direct: set CSS var consumed below via JS-injected style
        progress.style.background = 'transparent';
        var before = progress;
        before.style.setProperty('background', 'transparent');
      }
      // simplest reliable: update pseudo via CSSStyleSheet — instead we set transform on element itself
      // and CSS uses ::before scaleX(var(--p)) — so update var on :root
      document.documentElement.style.setProperty('--scroll-p', String(p));
      var styleEl = document.getElementById('progressStyle');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'progressStyle';
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = '.progress::before{transform:scaleX(' + p.toFixed(4) + ')}';
    }
    var pos = y + 120;
    var current = null;
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s.id;
    });
    navAnchors.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
    if (fab) fab.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (fab) {
    fab.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Contact form -> opens mail client, no backend needed
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var data = new FormData(form);
      var name = String(data.get('name') || '').trim();
      var email = String(data.get('email') || '').trim();
      var message = String(data.get('message') || '').trim();
      if (!name || !email || !message) {
        if (note) note.textContent = 'Please fill name, email and message.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (note) note.textContent = 'Please enter a valid email address.';
        return;
      }
      var subject = encodeURIComponent('Portfolio enquiry from ' + name);
      var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = 'mailto:praveenkumarr0110@gmail.com?subject=' + subject + '&body=' + body;
      if (note) note.textContent = 'Opening your email app…';
      form.reset();
    });
  }
})();
