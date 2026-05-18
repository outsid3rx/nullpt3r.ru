let controller: AbortController | null = null;

export function initReadingProgress(): void {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  const progressFill = document.getElementById('progressFill');
  const backBtn = document.getElementById('backToTop');

  if (!progressFill && !backBtn) return;

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const article = document.querySelector('.article-body');
    let pct = 0;

    if (article) {
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + scrollTop;
      const articleBottom = articleTop + rect.height;
      const scrollBottom = scrollTop + window.innerHeight;

      const done = scrollBottom - articleTop;
      const total = articleBottom - articleTop;
      pct = total > 0 ? Math.min(Math.max((done / total) * 100, 0), 100) : 0;
    }

    if (progressFill) {
      progressFill.style.width = pct + '%';
    }
    if (backBtn) {
      backBtn.classList.toggle('visible', scrollTop > 400);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true, signal });

  backBtn?.addEventListener(
    'click',
    () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    { signal },
  );
  backBtn?.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    { signal },
  );
}
