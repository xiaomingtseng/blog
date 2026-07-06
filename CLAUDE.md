# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static blog ("深水筆記 Deepwater") built with Eleventy 3, sourced from an Obsidian vault (`notes/`). No backend — content is written as Markdown, built by Eleventy, and deployed as static HTML to GitHub Pages via GitHub Actions on every push to `main`.

## Commands

```bash
npm install
npm run dev      # eleventy --serve, http://localhost:8080, live reload
npm run build    # eleventy production build → _site/
```

There is no test suite, linter, or type checker configured — verify changes by running `npm run dev` and checking the rendered pages.

Deployment is automatic: `.github/workflows/deploy.yml` runs `npm ci && npm run build` and publishes `_site/` to GitHub Pages on push to `main` (or manual `workflow_dispatch`). There's no separate staging step — pushing to `main` is a production deploy. On GitHub's side, Pages must be set to **Source: GitHub Actions** under repo Settings → Pages, or the deploy job 404s.

## Deploying under a subpath (pathPrefix)

This repo is named `blog` (not `<user>.github.io`), so GitHub Pages serves it at `https://xiaomingtseng.github.io/blog/`, a subpath — not the domain root. `eleventy.config.js` sets `pathPrefix: "/blog/"` to account for this, and `SITE.url` is deliberately the bare origin (`https://xiaomingtseng.github.io`, no `/blog`) so it composes cleanly with `pathPrefix` rather than duplicating the subpath.

Templates use **plain root-relative paths** (`href="/notes/"`, `src="/assets/style.css"`, `{{ post.url }}`) with no manual `| url` filter. Prefixing happens automatically: `eleventy-plugin-rss`'s `feedPlugin` internally registers Eleventy's built-in HTML `<base>` plugin, which rewrites every `href`/`src` in all HTML output to prepend `pathPrefix`. Do not add `| url` filters back into the `.njk` templates — combining them with this plugin's auto-rewrite double- (or triple-)prefixes every link, which is exactly how the "CSS/links missing after deploy" bug happened before. The `feedPlugin` call passes `htmlBasePluginOptions: { extensions: "" }`, which is required — without it, the auto-rewrite itself applies the prefix twice.

Two places still need the `| url` filter manually, because they're outside the plugin's `.html`-only auto-rewrite:
- `search-index.njk` (JSON output) — `p.url | url` so client-side search results link correctly.
- `base.njk`'s inline `<script>window.DEEPWATER_BASE = "{{ '/' | url }}"</script>` — the auto-rewrite only touches `href`/`src` attributes, not script text, and `assets/search.js` reads `window.DEEPWATER_BASE` to prefix its `fetch("/search-index.json")` call at runtime (its Fuse.js import is a relative `./vendor/fuse.min.mjs` instead, which sidesteps the prefix problem entirely since module specifiers resolve against the importing script's own URL).

If this ever moves to a root domain (e.g. renaming the repo to `xiaomingtseng.github.io`), set `pathPrefix: "/"` (the default) and nothing else should need to change.

## Site configuration

Everything site-wide lives at the top of [eleventy.config.js](eleventy.config.js):

- `SITE` — title, description, canonical url, author, github link (used across templates via `SITE.*` global data).
- `TYPES` — the four content types (`research`, `literature`, `idea`, `life`), each with a `label` and a `color` that must stay in sync with the `--c-*` CSS custom properties in [assets/style.css](assets/style.css) (templates reference colors as `var(--c-lit)` for literature, `var(--c-{{ type }})` for the rest).

## Content model

Notes live under `notes/<type>/*.md`, one subfolder per entry in `TYPES`. Layout and permalink defaults cascade through Eleventy's directory data files:

- `notes/notes.11tydata.js` — applies to every note: `layout: post.njk`, `permalink: /notes/{{ page.fileSlug }}/index.html`.
- `notes/literature/literature.11tydata.js` — overrides `layout: paper.njk` for that subfolder only (adds the paper-card header). Only `literature/` currently overrides the default; `idea/` and `life/` still render through `post.njk`. To give another type its own layout, add a matching `<type>/<type>.11tydata.js` and a new `_includes/<type>.njk`, following the literature example.
- `notes/attachments/` — Obsidian image attachments, passthrough-copied to `/attachments`.

Frontmatter schema (see [README.md](README.md) for the full example): `title`, `type`, `date`, `updated` (optional), `tags`, `summary`, `draft`, `math` (set `true` to load KaTeX CSS on that page). Literature notes additionally take a `paper: { title, authors, year, venue, doi, link, pdf, tldr }` block consumed by `paper.njk`'s paper-card.

Draft filtering, type collections, and the tag list are all derived in `eleventy.config.js` from `collections.posts` — there's a single `published()` helper that filters out `data.draft` before every collection is built (`posts`, one per `TYPES` key, `allTags`, `searchIndex`).

## Templates (`_includes/`)

All pages extend `base.njk`, which renders the shared shell: sidebar nav/search/tag-cloud, dark-mode toggle, and includes the four client-side scripts (`theme.js`, `search.js`, `list-filter.js`, `toc.js`) unconditionally on every page.

- `home.njk` — homepage, one card per type showing its 2 most recent posts.
- `list.njk` — `/notes/` index; renders all posts into `data-list-row` elements with `data-type`/`data-tags` attributes that `list-filter.js` filters client-side, syncing state to URL query params (`?type=`, `?tag=`) so filtered views are shareable/linkable. There are no per-tag or per-type static pages — filtering is entirely front-end.
- `post.njk` / `paper.njk` — single-note view. Both independently render the sticky TOC scaffold, prev/next nav (via `getPreviousCollectionItem`/`getNextCollectionItem` on `collections.posts`), and a "related posts" block (via the custom `related` filter, tag-overlap ranked). `paper.njk` is a near-duplicate of `post.njk` with a paper-card header swapped in for the plain title — keep the two in sync manually when editing shared post chrome (pagenav, related, tags, TOC).

Search (`search.js` + Fuse.js) and the TOC (`toc.js`) both read from build-time-generated JSON/DOM rather than making requests: `search-index.njk` emits `/search-index.json` from `collections.posts` at build time (kept in sync with the `searchIndex` collection in `eleventy.config.js` — both must be updated together if the search payload shape changes); the TOC is generated by scanning rendered `h2`/`h3` headings client-side.

## Markdown pipeline

Configured once in `eleventy.config.js` on a shared `markdown-it` instance: `markdown-it-footnote` (`[^1]` syntax), `markdown-it-katex` (LaTeX pre-rendered at build time, zero client JS — only loaded per-page when `math: true`), and `markdown-it-anchor` on `h2`/`h3` (custom CJK-aware slugify) so the TOC can link to headings. Raw HTML is allowed in Markdown (`html: true`), used e.g. for the `.prereq-table` prerequisite-knowledge tables documented in the README.

Two build-time filters worth knowing about since they aren't obvious from templates alone:
- `readingTime` — counts CJK characters (÷500/min) and English words (÷200/min) separately and sums, no frontmatter field needed.
- `related` — ranks other posts by tag-overlap count against the current post's tags.
