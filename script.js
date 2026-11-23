/* Desktop visual prototype. No application data is stored or transmitted. */
// Preserve the requested button while making the closed status clear.
document.getElementById('admission-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const message = document.getElementById('form-message');
  message.innerHTML = 'Ph.D. admissions are currently closed. For further contact: <a href="mailto:phd.rdc@sharda.ac.in">phd.rdc@sharda.ac.in</a>. No application has been submitted.';
  message.hidden = false;
});

function setupNavigation(navigation) {
  if (!navigation) return;

  const links = navigation.querySelectorAll('a[href^="#"]');
  function updateCurrentLink() {
    const locationHash = window.location.hash || '#hero';
    for (const link of links) {
      if (link.hash === locationHash) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  }

  function updateHeaderHeight() {
    document.documentElement.classList.toggle('header-compact', window.scrollY > 8);
  }

  updateCurrentLink();
  updateHeaderHeight();
  window.addEventListener('hashchange', updateCurrentLink);
  window.addEventListener('scroll', updateHeaderHeight, { passive: true });
  window.addEventListener('pageshow', updateHeaderHeight);
}

setupNavigation(document.querySelector('.navigation'));

function setupHeroSlideshow(hero) {
  if (!hero) return;

  const slides = hero.querySelectorAll('.hero-banner');
  const intro = hero.querySelector('.hero-intro');
  const controls = hero.querySelector('.hero-controls');
  if (slides.length < 2 || !controls) return;

  const status = controls.querySelector('[data-hero-status]');
  const previous = controls.querySelector('.hero-previous');
  const next = controls.querySelector('.hero-next');
  if (!previous || !next || !status) return;

  let current = 0;

  function move(step) {
    slides[current].setAttribute('aria-hidden', 'true');
    current = (current + step + slides.length) % slides.length;
    const slide = slides[current];
    slide.removeAttribute('aria-hidden');
    intro?.classList.toggle('visually-hidden', slide.classList.contains('hero-banner-artwork'));
    status.textContent = `Slide ${current + 1} of ${slides.length}. ${slide.querySelector('img').alt}`;
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  controls.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  controls.hidden = false;
}

setupHeroSlideshow(document.querySelector('.hero'));

function animateResearchStats(strip) {
  if (!strip) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const formatter = new Intl.NumberFormat('en-IN', { useGrouping: false });
  const counters = Array.from(strip.querySelectorAll('[data-count]'), (element) => {
    const finalText = element.textContent.trim();
    const accessibleValue = document.createElement('span');
    accessibleValue.className = 'visually-hidden';
    accessibleValue.textContent = finalText;
    element.before(accessibleValue);
    element.setAttribute('aria-hidden', 'true');
    return { element, finalText, target: Number(finalText.replace(/,/g, '')) };
  });

  function render(progress) {
    const eased = 1 - (1 - progress) ** 2;
    for (const { element, finalText, target } of counters) {
      element.textContent = progress === 1 ? finalText : formatter.format(Math.floor(target * eased));
    }
  }

  let played = false;
  let frame;
  function startCount() {
    played = true;
    render(0);
    const duration = motion.matches ? 600 : 2500;
    let start;
    function tick(time) {
      start ??= time;
      const progress = Math.min((time - start) / duration, 1);
      render(progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  }

  render(0);
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        cancelAnimationFrame(frame);
        played = false;
        render(0);
      } else if (entry.intersectionRatio >= 0.6 && !played) {
        startCount();
      }
    }
  }, { threshold: [0, 0.6] });
  observer.observe(strip);
}

animateResearchStats(document.querySelector('.research-stats'));

const computeSection = document.querySelector('.compute-section');
if (computeSection) {
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    computeSection.classList.add('is-in-view');
    observer.disconnect();
  }, { threshold: 0.15 });
  observer.observe(computeSection);
}

function setupCampusUpdates(section) {
  if (!section) return;

  const pairs = section.querySelectorAll('.updates-pair');
  const previous = section.querySelector('.updates-previous');
  const next = section.querySelector('.updates-next');
  let current = 0;

  function showPair(index) {
    if (index < 0 || index >= pairs.length) return;

    pairs.forEach((pair, position) => { pair.hidden = position !== index; });
    current = index;
    previous.setAttribute('aria-disabled', String(index === 0));
    next.setAttribute('aria-disabled', String(index === pairs.length - 1));
  }

  previous.addEventListener('click', () => showPair(current - 1));
  next.addEventListener('click', () => showPair(current + 1));
  section.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showPair(current + (event.key === 'ArrowLeft' ? -1 : 1));
  });

  showPair(0);
  previous.hidden = false;
  next.hidden = false;
}

setupCampusUpdates(document.querySelector('.campus-updates'));

function setupGlobalPartners(section) {
  if (!section) return;

  const groups = Array.from(section.querySelectorAll('.global-logo-grid'));
  const pagination = section.querySelector('.global-pages');
  const status = section.querySelector('[data-global-status]');
  const buttons = groups.map((group, index) => {
    Array.from(group.children).forEach((card, position) => {
      card.style.setProperty('--logo-position', position);
    });
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Partner logos, page ${index + 1} of ${groups.length}`);
    button.setAttribute('aria-controls', 'global-logos');
    button.addEventListener('click', () => {
      showPage(index);
      status.textContent = `Showing partner logos, page ${index + 1} of ${groups.length}.`;
    });
    pagination.append(button);
    return button;
  });

  function showPage(index) {
    groups.forEach((group, position) => {
      const selected = position === index;
      group.hidden = !selected;
      buttons[position].setAttribute('aria-pressed', String(selected));
    });
  }

  showPage(0);
  pagination.hidden = false;

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    section.classList.add('is-in-view');
    observer.disconnect();
  }, { threshold: 0.2 });
  observer.observe(section.querySelector('.global-partners'));
}

setupGlobalPartners(document.querySelector('.global-section'));

function setupTestimonials(section) {
  if (!section) return;

  const pages = Array.from(section.querySelectorAll('.testimonial-page'));
  if (pages.length < 2) return;

  const previous = section.querySelector('.testimonial-previous');
  const next = section.querySelector('.testimonial-next');
  const pagination = section.querySelector('.testimonial-dots');
  const status = section.querySelector('[data-testimonial-status]');
  let current = 0;

  const dots = pages.map((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Testimonials, page ${index + 1} of ${pages.length}`);
    button.setAttribute('aria-controls', 'testimonial-pages');
    button.addEventListener('click', () => {
      if (index !== current) showPage(index, index < current ? 'previous' : 'next');
    });
    pagination.append(button);
    return button;
  });

  function showPage(index, direction) {
    pages.forEach((page, position) => {
      const selected = position === index;
      page.hidden = !selected;
      dots[position].setAttribute('aria-pressed', String(selected));
    });
    current = index;
    if (direction) {
      pages[index].dataset.direction = direction;
      status.textContent = `Showing testimonials, page ${index + 1} of ${pages.length}.`;
    }
  }

  function move(step) {
    const index = (current + step + pages.length) % pages.length;
    showPage(index, step < 0 ? 'previous' : 'next');
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  section.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  showPage(0);
  previous.hidden = false;
  next.hidden = false;
  pagination.hidden = false;
}

setupTestimonials(document.querySelector('.testimonials'));
