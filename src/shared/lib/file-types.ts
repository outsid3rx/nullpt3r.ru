export const FILE_TYPE_LABELS: Record<string, string> = {
  '.csv': 'Таблица',
  '.pdf': 'Документ',
  '.zip': 'Архив',
  '.tar.gz': 'Архив',
  '.tgz': 'Архив',
  '.png': 'Изображение',
  '.jpg': 'Изображение',
  '.jpeg': 'Изображение',
  '.webp': 'Изображение',
  '.svg': 'Изображение',
  '.rs': 'Код',
  '.py': 'Код',
  '.ts': 'Код',
  '.tsx': 'Код',
  '.js': 'Код',
  '.jsx': 'Код',
  '.go': 'Код',
  '.json': 'Данные',
  '.yaml': 'Данные',
  '.yml': 'Данные',
  '.toml': 'Конфиг',
  '.md': 'Документ',
  '.txt': 'Текст',
  '.stl': '3D-модель',
  '.step': '3D-модель',
  '.stp': '3D-модель',
};

export function resolveFileLabel(ext: string): string {
  return FILE_TYPE_LABELS[ext] ?? ext;
}

export function extractExtension(url: string): string {
  const filename = url.split('/').pop() ?? '';
  const knownMulti = ['.tar.gz', '.tar.bz2', '.tar.xz'];
  for (const ext of knownMulti) {
    if (filename.endsWith(ext)) return ext;
  }
  const dotIndex = filename.lastIndexOf('.');
  return dotIndex >= 0 ? filename.slice(dotIndex) : '';
}
