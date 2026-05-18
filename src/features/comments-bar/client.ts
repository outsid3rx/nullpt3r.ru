let controller: AbortController | null = null;

export function initCommentsBar(): void {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  const bar = document.getElementById('commentsBar');
  const target = document.querySelector<HTMLElement>('.giscus-wrapper');
  if (!bar || !target) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      bar.classList.toggle('visible', !entry.isIntersecting);
    },
    { rootMargin: '-30% 0px 0px 0px', threshold: 0 },
  );
  observer.observe(target);
  signal.addEventListener('abort', () => observer.disconnect());

  bar.addEventListener(
    'click',
    () => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    { signal },
  );

  bar.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    { signal },
  );
}
