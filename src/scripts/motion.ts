// Scroll reveals and a light parallax on scene art. Both are skipped for reduced motion.

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        revealIO.unobserve(e.target);
      }
    }
  },
  { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
);
document.querySelectorAll('[data-reveal]').forEach((el) => revealIO.observe(el));

if (!reduce) {
  const layers = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  const visible = new Set<HTMLElement>();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target as HTMLElement;
      e.isIntersecting ? visible.add(el) : visible.delete(el);
    }
  });
  layers.forEach((el) => io.observe(el.parentElement!));

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    for (const el of layers) {
      const host = el.parentElement!;
      if (!visible.has(host) && visible.size) continue;
      const r = host.getBoundingClientRect();
      // -1 when the section is entering from below, +1 when leaving at the top
      const p = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
      const strength = Number(el.dataset.parallax) || 60;
      el.style.transform = `translate3d(0, ${(p * strength).toFixed(1)}px, 0)`;
    }
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
