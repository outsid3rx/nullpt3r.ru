# nullptr — блог о разработке

Персональный блог, построенный на [Astro](https://astro.build). Статическая генерация, Tailwind CSS, адаптивные изображения, комментарии через Giscus.

## Быстрый старт

```bash
pnpm install
pnpm dev
```

## Как добавить статью

### 1. Создать файл

`src/content/posts/my-post.md`

### 2. Заполнить frontmatter

```yaml
---
title: 'Название статьи'
description: 'Краткое описание, 1-2 предложения'
publishedAt: 2026-06-01
tags: ['Rust', 'Performance']
heroImage: './images/hero/my-post.webp'   # опционально
author: 'Имя Автора'
authorAvatar: './images/avatars/author.webp'  # опционально
draft: false
---
```

**Поля:**
- `title` — до 200 символов
- `description` — до 500 символов
- `publishedAt` — дата публикации
- `tags` — от 1 до 10 тэгов
- `heroImage` — путь к изображению относительно `.md` файла
- `author` — по умолчанию Никита Поляков
- `authorAvatar` — путь к аватарке относительно `.md` файла
- `draft` — `true` скрывает статью из сборки

### 3. Добавить изображения (если нужны)

Пути указываются относительно файла статьи. Файлы кладутся рядом:

```
src/content/posts/
├── my-post.md
└── images/
    ├── hero/
    │   └── my-post.webp
    └── avatars/
        └── author.webp
```

Поддерживаются форматы WebP, PNG, JPEG. Изображения автоматически оптимизируются в AVIF и WebP в нескольких размерах при сборке.

### 4. Сгенерировать OG-картинку

```bash
pnpm generate-og
```

Скрипт через Playwright создаёт PNG для превью при репостах в соцсетях. Если у статьи есть `heroImage` — используется шаблон с фоновым изображением, без него — чистый светлый шаблон. Готовые OG-картинки попадают в `public/og/`.

### 5. Собрать

```bash
pnpm build
```

Результат в `dist/`. Можно проверить локально через `pnpm preview`.

## Команды

| Команда | Описание |
|---|---|
| `pnpm dev` | dev-сервер на `localhost:4321` |
| `pnpm build` | сборка статики |
| `pnpm preview` | превью собранного сайта |
| `pnpm generate-og` | генерация OG-изображений для новых статей |
| `pnpm lint` | ESLint |
| `pnpm format` | форматирование через Prettier |
| `pnpm typecheck` | TypeScript проверка |

## Технологии

- Astro 5 — генератор статических сайтов
- Tailwind CSS + `@tailwindcss/typography` — стили
- `sharp` — оптимизация и ресайз изображений
- `medium-zoom` — увеличение картинок при клике
- Giscus — комментарии (GitHub Discussions)
- Playwright — генерация OG-превью
