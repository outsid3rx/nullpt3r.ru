import { readFileSync, writeFileSync, unlinkSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const POSTS_DIR = new URL('../src/content/posts/', import.meta.url);
const TEMPLATE_PATH = new URL('../src/shared/lib/og-template.html', import.meta.url);
const TEMPLATE_OVERLAY_PATH = new URL('../src/shared/lib/og-template-overlay.html', import.meta.url);
const PUBLIC_DIR = new URL('../public/', import.meta.url);
const OUT_DIR = new URL('../public/og/', import.meta.url);
const SITE_DOMAIN = 'nullpt3r.ru';

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, body: '' };

  const yaml = match[1];
  const body = match[2];
  const data = {};

  for (const line of yaml.split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (!kv) continue;

    let val = kv[2].trim();

    if (kv[1] === 'draft') {
      data.draft = val === 'true';
    } else if (kv[1] === 'tags') {
      data.tags = val
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((t) => t.trim().replace(/^['"]|['"]$/g, ''));
    } else if (kv[1] === 'publishedAt') {
      data.publishedAt = new Date(val);
    } else if (kv[1] === 'title') {
      data.title = val.replace(/^['"]|['"]$/g, '');
    } else if (kv[1] === 'description') {
      data.description = val.replace(/^['"]|['"]$/g, '');
    } else if (kv[1] === 'author') {
      data.author = val.replace(/^['"]|['"]$/g, '');
    } else if (kv[1] === 'heroImage') {
      data.heroImage = val.replace(/^['"]|['"]$/g, '');
    } else if (kv[1] === 'authorAvatar') {
      data.authorAvatar = val.replace(/^['"]|['"]$/g, '');
    }
  }

  return { data, body };
}

function computeReadingTime(body) {
  return Math.max(1, Math.round((body.trim().split(/\s+/).length || 0) / 150));
}

function formatDate(date) {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getInitials(author) {
  return author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const templatePlain = readFileSync(TEMPLATE_PATH, 'utf-8');
  const templateOverlay = readFileSync(TEMPLATE_OVERLAY_PATH, 'utf-8');
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));

  const pages = [];

  for (const file of files) {
    const content = readFileSync(new URL(file, POSTS_DIR), 'utf-8');
    const { data, body } = parseFrontmatter(content);
    if (data.draft) continue;

    const slug = file.replace(/\.(md|mdx)$/, '');
    const initials = getInitials(data.author);
    const readingTime = computeReadingTime(body);
    const dateStr = formatDate(data.publishedAt || new Date());
    const tagsHtml = (data.tags || [])
      .map((t) => `        <span class="og-tag">${t}</span>`)
      .join('\n');

    let avatarHtml;
    if (data.authorAvatar) {
      const avatarUrl = new URL(data.authorAvatar.replace(/^\//, ''), PUBLIC_DIR);
      avatarHtml = `<img src="${avatarUrl.href}" alt="" class="avatar-img" />`;
    } else {
      avatarHtml = `<div class="avatar">${initials}</div>`;
    }

    const hasHero = !!data.heroImage;
    const template = hasHero ? templateOverlay : templatePlain;

    let html = template
      .replace('{{title}}', data.title || '')
      .replace('{{tags}}', tagsHtml)
      .replace('{{avatar}}', avatarHtml)
      .replace('{{author}}', data.author)
      .replace('{{date}}', dateStr)
      .replace('{{readingTime}}', String(readingTime))
      .replaceAll('{{domain}}', SITE_DOMAIN);

    if (hasHero) {
      const heroUrl = new URL(data.heroImage.replace(/^\//, ''), PUBLIC_DIR);
      html = html.replace('{{heroImage}}', heroUrl.href);
    }

    pages.push({ slug, html });
  }

  if (pages.length === 0) {
    console.log('No posts to generate OG images for.');
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    viewport: { width: 1280, height: 720 },
  });

  for (const { slug, html } of pages) {
    const outPath = new URL(`${slug}.png`, OUT_DIR);
    const outPathStr = fileURLToPath(outPath);

    if (existsSync(outPathStr)) {
      console.log(`  - ${slug}.png (exists, skipping)`);
      continue;
    }

    const tmpHtmlUrl = new URL(`.tmp-${slug}.html`, OUT_DIR);
    const tmpHtmlPath = fileURLToPath(tmpHtmlUrl);

    writeFileSync(tmpHtmlPath, html, 'utf-8');

    const page = await context.newPage();
    await page.goto(`file://${tmpHtmlPath}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.og-canvas');

    const canvas = await page.locator('.og-canvas');
    await canvas.screenshot({ path: outPathStr });

    await page.close();
    unlinkSync(tmpHtmlPath);


    console.log(`  ✓ ${slug}.png`);
  }

  await browser.close();
  console.log(`\nGenerated ${pages.length} OG image(s)`);
}

main().catch((err) => {
  console.error('OG generation failed:', err);
  process.exit(1);
});
