/* Desktop visual prototype. No application data is stored or transmitted. */
// Preserve the requested button while making the closed status clear.
document.getElementById('admission-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const message = document.getElementById('form-message');
  message.innerHTML = 'Ph.D. admissions are currently closed. For further contact: <a href="mailto:phd.rdc@sharda.ac.in">phd.rdc@sharda.ac.in</a>. No application has been submitted.';
  message.hidden = false;
});

function animateResearchStats(strip) {
  if (!strip) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const formatter = new Intl.NumberFormat('en-IN');
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
