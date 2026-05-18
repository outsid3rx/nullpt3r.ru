import mediumZoom from 'medium-zoom';

let controller: AbortController | null = null;
let zoom: ReturnType<typeof mediumZoom> | null = null;

export function initImageZoom(): void {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;

  zoom?.detach();
  zoom = mediumZoom('.article-body img, [data-zoom] img', {
    background: 'rgba(0, 0, 0, 0.8)',
    margin: 24,
  });

  signal.addEventListener('abort', () => {
    zoom?.detach();
    zoom = null;
  });
}
