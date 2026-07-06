# 深水筆記 — Obsidian → GitHub Pages build

Obsidian 寫筆記 → push → GitHub Actions 自動 build → GitHub Pages 發布。
純靜態輸出，無後端。已依照 Claude Design 設計稿（側欄導覽 + sticky TOC + 文獻論文卡 + 類型/標籤過濾）完整實作。

Site :[Blog](https://xiaomingtseng.github.io/blog/)

## 檔案結構

```
your-repo/
├─ .github/workflows/deploy.yml   # push 到 main 就自動 build + deploy
├─ eleventy.config.js             # 分類、標籤、RSS、搜尋索引、KaTeX、閱讀時間
├─ package.json
├─ notes/                         # ← 你的 Obsidian vault 放這（或 symlink）
│   ├─ notes.11tydata.js          # 資料夾層級預設：layout=post.njk + permalink
│   ├─ research/*.md
│   ├─ literature/*.md
│   │   └─ literature.11tydata.js # 覆寫 layout=paper.njk（文獻筆記論文卡）
│   ├─ idea/*.md                  # 目前沿用 post.njk，之後想加專屬版型就比照 literature 做法
│   ├─ life/*.md
│   └─ attachments/               # Obsidian 圖片附件 → 會複製到 /attachments
├─ _includes/
│   ├─ base.njk    # 外殼：側欄導覽、搜尋框、深色模式、footer
│   ├─ home.njk    # 首頁：四類型卡片
│   ├─ list.njk    # /notes/ 全部筆記，類型 + 標籤過濾（前端 JS，網址可分享）
│   ├─ post.njk    # 單篇文章：左側 sticky 目錄、footnote、上下篇、相關文章
│   └─ paper.njk   # 文獻筆記：頂部論文卡（標題/作者/年份/TL;DR/連結）
├─ assets/
│   ├─ style.css       # 全部 design tokens + 版面樣式
│   ├─ theme.js        # 深色模式（記住上次選擇）
│   ├─ toc.js          # 自動讀取內文標題、捲動時高亮目錄
│   ├─ search.js       # Fuse.js 模糊搜尋（讀 /search-index.json）
│   └─ list-filter.js  # 列表頁類型/標籤過濾（同步網址參數）
├─ index.njk           # 首頁入口（layout: home.njk）
├─ notes-list.njk      # /notes/ 入口（layout: list.njk）
└─ search-index.njk    # build 時輸出 /search-index.json
```

## 每篇筆記的 frontmatter schema

**一般筆記**（research / idea / life，用 `post.njk`）：

```yaml
---
title:   標題
type:    research           # research | literature | idea | life
date:    2026-06-28
updated: 2026-06-29         # 選填
tags:    [CV, YOLO, 養殖]
summary: 一句話摘要（列表頁、首頁卡片、搜尋、RSS 都會用到）
draft:   false
math:    true               # 這篇有 LaTeX 才需要，會多載入 katex.css
---
```

**文獻筆記**（literature，用 `paper.njk`，多一個 `paper` 區塊）：

```yaml
---
title:   標題
type:    literature
date:    2026-06-28
tags:    [文獻, dataset, CV]
summary: 一句話摘要
draft:   false
paper:
  title:   論文完整標題
  authors: [作者一, 作者二]
  year:    2020
  venue:   期刊/會議名稱
  doi:     10.xxxx/xxxxx     # 選填，會產生 DOI 連結
  link:    https://...       # 選填，「論文 ↗」按鈕
  pdf:     https://...       # 選填，「PDF」按鈕
  tldr:    一句話重點，會顯示在頂部論文卡
---
```

內文（不管哪種類型）用一般 Markdown 寫，標題（`## / ###`）會自動變成側欄目錄項目；
`[^1]` 語法自動變 footnote；`$$...$$` 或 `$...$` 的 LaTeX 會在 build 階段用 KaTeX 預渲染好，前端零 JS。

若要用到「先備知識 ✓/✗」表格，直接在 md 裡寫原始 HTML（已提供對應 class）：

```html
<table class="prereq-table">
  <tr><td>先備知識</td><td>狀態</td></tr>
  <tr><td>線性代數</td><td class="prereq-yes">✓</td></tr>
  <tr><td>測度論</td><td class="prereq-no">✗</td></tr>
</table>
```

## 本機預覽

```bash
npm install
npm run dev      # http://localhost:8080，存檔即重載
```

## 之後想擴充

- **idea / life 專屬版型**：目前沿用 `post.njk`，如果想要不同排版，比照 `notes/literature/literature.11tydata.js` 的做法，在對應資料夾放一個 `xxx.11tydata.js` 覆寫 `layout`，再新增一支 `_includes/xxx.njk`。
- **標籤頁**（例如 `/tags/CV/`）：目前標籤過濾是在 `/notes/` 頁面用前端 JS 做的（網址 `?tag=CV` 可分享），如果想要每個標籤有獨立靜態頁面（SEO 更好），可以用 Eleventy 的 `addCollection` + pagination 另外產生。
- **搜尋升級成語意搜尋**：現在是 Fuse.js 關鍵字模糊搜尋，之後想做 embedding-based 語意搜尋需要另外接一個小 API，不影響靜態網站本體。
