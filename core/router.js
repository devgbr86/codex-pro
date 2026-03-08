// core/router.js — Scroll-based navigation (anchor links in TOC)

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function watchScroll(viewer, onEnter) {
  let ticking = false;

  viewer.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const headings = viewer.querySelectorAll('#content h1,#content h2,#content h3,#content h4');
      if (!headings.length) return;

      let active = headings[0];
      const offset = 80;

      for (const h of headings) {
        if (h.getBoundingClientRect().top - offset <= 0) {
          active = h;
        }
      }

      onEnter(active.id);
    });
  }, { passive: true });
}
