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
    // Collapse after the hero has scrolled behind the shorter header.
    document.documentElement.classList.toggle('header-compact', window.scrollY >= 36);
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

const animatedSections = document.querySelectorAll('.welcome-facts, .compute-section');
if (animatedSections.length) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in-view');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.15 });
  animatedSections.forEach((section) => observer.observe(section));
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

function setupAwardCarousel(carousel) {
  if (!carousel) return;
  const track = carousel.querySelector('.awards-grid');
  const toggle = carousel.querySelector('.award-motion-toggle');
  const pages = Array.from(track.children);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const repeats = pages.map(page => {
    const copy = page.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.inert = true;
    return copy;
  });

  function resizeWindow() {
    carousel.style.setProperty('--award-window', pages[0].getBoundingClientRect().height + 'px');
  }

  function applyMotionPreference() {
    toggle.hidden = motion.matches;
    carousel.classList.toggle('is-animated', !motion.matches);
    if (motion.matches) {
      repeats.forEach(page => page.remove());
    } else {
      track.append(...repeats);
      resizeWindow();
    }
  }

  toggle.addEventListener('click', () => {
    const paused = carousel.classList.toggle('is-paused');
    toggle.setAttribute('aria-label', paused ? 'Resume awards animation' : 'Pause awards animation');
  });
  new ResizeObserver(resizeWindow).observe(pages[0]);
  new IntersectionObserver(([entry]) => {
    carousel.classList.toggle('is-visible', entry.isIntersecting);
  }).observe(carousel);
  motion.addEventListener('change', applyMotionPreference);
  applyMotionPreference();
}

setupAwardCarousel(document.querySelector('.award-carousel'));

function setupGlobalPartners(section) {
  if (!section) return;

  const partners = section.querySelector('.global-partners');
  const wall = section.querySelector('#global-logos');
  const control = section.querySelector('.global-motion-control');
  if (!partners || !wall || !control) return;

  const groups = Array.from(wall.querySelectorAll('.global-logo-grid'));
  const cardsByGroup = groups.map(group => Array.from(group.children));
  const cards = cardsByGroup.flat();
  if (cards.length < 2) return;

  function makeLane(rowCards) {
    const lane = document.createElement('div');
    lane.className = 'global-lane';
    const track = document.createElement('div');
    track.className = 'global-track';
    const list = groups[0].cloneNode(false);
    list.append(...rowCards);

    // Two identical lists make the halfway point of the track a seamless loop.
    const repeat = list.cloneNode(true);
    repeat.setAttribute('aria-hidden', 'true');
    repeat.inert = true;
    track.append(list, repeat);
    lane.append(track);
    return lane;
  }

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function applyMotionPreference() {
    control.hidden = motion.matches;
    if (motion.matches) {
      if (partners.dataset.globalMotion !== 'ready') return;
      delete partners.dataset.globalMotion;
      groups.forEach((group, index) => group.replaceChildren(...cardsByGroup[index]));
      wall.replaceChildren(...groups);
      return;
    }
    const split = Math.ceil(cards.length / 2);
    wall.replaceChildren(makeLane(cards.slice(0, split)), makeLane(cards.slice(split)));
    partners.dataset.globalMotion = 'ready';
  }

  function setPaused(paused) {
    partners.dataset.paused = String(paused);
    control.setAttribute('aria-pressed', String(paused));
    control.title = paused ? 'Resume logo animation' : 'Pause logo animation';
  }
  control.setAttribute('aria-label', 'Pause logo animation');
  control.addEventListener('click', () => setPaused(partners.dataset.paused !== 'true'));
  setPaused(false);
  applyMotionPreference();
  motion.addEventListener('change', applyMotionPreference);

  partners.dataset.offscreen = 'true';
  const visibility = new IntersectionObserver(([entry]) => {
    partners.dataset.offscreen = String(!entry.isIntersecting);
    if (entry.isIntersecting) {
      wall.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager'; });
    }
  });
  visibility.observe(partners);
}

setupGlobalPartners(document.querySelector('.global-section'));

function setupTestimonials(section) {
  if (!section) return;

  const cardList = section.querySelector('.testimonial-cards');
  const cards = Array.from(cardList.children);
  if (cards.length < 2) return;

  const controls = section.querySelector('.testimonial-controls');
  const previous = controls.querySelector('.testimonial-previous');
  const next = controls.querySelector('.testimonial-next');
  const autoplay = controls.querySelector('.testimonial-autoplay');
  const position = controls.querySelector('.testimonial-position');
  const status = section.querySelector('[data-testimonial-status]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let playing = !motion.matches;
  let inView = false;
  let hovering = false;
  let timer;

  function schedule() {
    clearTimeout(timer);
    if (playing && inView && !hovering && !document.hidden) {
      timer = setTimeout(() => move(1, false), 9000);
    }
  }

  function setPlaying(enabled) {
    playing = enabled;
    autoplay.dataset.paused = String(!playing);
    autoplay.setAttribute('aria-label', playing ? 'Pause testimonial autoplay' : 'Start testimonial autoplay');
    schedule();
  }

  function move(step, announce = true) {
    cards[current].inert = true;
    delete cards[current].dataset.direction;
    current = (current + step + cards.length) % cards.length;
    const card = cards[current];
    card.dataset.direction = step < 0 ? 'previous' : 'next';
    card.inert = false;
    position.textContent = (current + 1) + ' / ' + cards.length;
    if (announce) {
      const testimonial = card.querySelector('.testimonial-text').textContent;
      status.textContent = 'Testimonial ' + (current + 1) + ' of ' + cards.length + '. ' + testimonial;
    }
    schedule();
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  autoplay.addEventListener('click', () => setPlaying(!playing));
  controls.addEventListener('focusin', event => {
    if (event.target !== autoplay && event.target.matches(':focus-visible')) setPlaying(false);
  });
  controls.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  });
  cards.slice(1).forEach(card => { card.inert = true; });
  cardList.classList.add('is-ready');
  position.textContent = '1 / ' + cards.length;
  controls.hidden = false;
  cardList.addEventListener('pointerenter', event => {
    hovering = event.pointerType !== 'touch';
    schedule();
  });
  cardList.addEventListener('pointerleave', () => {
    hovering = false;
    schedule();
  });
  new IntersectionObserver(([entry]) => {
    inView = entry.intersectionRatio >= 0.4;
    schedule();
  }, { threshold: 0.4 }).observe(cardList);
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => setPlaying(!motion.matches));
  setPlaying(playing);
}

setupTestimonials(document.querySelector('.testimonials'));
