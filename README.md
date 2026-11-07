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
│   ├─ notes.11tydata.js          # 資料夾層級預設：layout、permalink；沒寫的 type/title/date 自動補
│   ├─ inbox/                     # 收件匣：新筆記先丟這，不用 frontmatter，不會發布
│   │   └─ inbox.11tydata.js      # draft: true + permalink: false
│   ├─ research/*.md              # 研究：概念整理（tag 概念）、週報/會議（tag 週報）
│   ├─ literature/*.md
│   │   └─ literature.11tydata.js # 覆寫 layout=paper.njk（標題下多一顆「論文 ↗」按鈕）
│   ├─ essay/*.md                 # 隨筆：想法、心情、生活
│   └─ attachments/               # Obsidian 圖片附件 → 會複製到 /attachments
├─ _templates/                    # Obsidian 範本（note.md / literature.md），已被 .eleventyignore 排除
├─ _includes/
│   ├─ base.njk    # 外殼：側欄導覽、搜尋框、深色模式、footer
│   ├─ home.njk    # 首頁：三類型卡片
│   ├─ list.njk    # /notes/ 全部筆記，類型 + 標籤過濾（前端 JS，網址可分享）
│   ├─ post.njk    # 單篇文章：左側 sticky 目錄、footnote、上下篇、相關文章
│   └─ paper.njk   # 文獻筆記：同 post.njk，frontmatter 有 link 就顯示「論文 ↗」按鈕
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

## 寫筆記的流程：先記下來，之後再整理

1. **記**：在 Obsidian 按「新筆記」，檔案會自動建在 `notes/inbox/`（`.obsidian/app.json` 設定）。什麼都不用寫，收件匣的筆記不會發布。
2. **整理**（例如每週一次）：把筆記搬到 `research/`、`literature/` 或 `essay/`，搬出收件匣就會發布。想補 tags 或 summary 的話，按 **Alt+T** 插入範本（`_templates/note.md` 或 `literature.md`）；不想補也可以不插。
3. **push**：網站就會更新。

**frontmatter 的每個欄位都是選填的**，整段不寫也可以。沒寫的欄位，build 時會自動處理（見 `notes/notes.11tydata.js`）：
- `type`：用所在的資料夾名稱。
- `title`：用檔名。
- `date`：用第一次 commit 進 git 的日期。
- `math`：內文有 LaTeX 公式就自動載入 KaTeX 樣式。
- `draft`：預設 `false`。收件匣裡的筆記一律當草稿；想先藏起來，手動寫 `draft: true`。
- `tags`、`summary`、`updated`、`link`：不寫就不顯示。

所以範本裡不放 `type`，之後搬資料夾也不用再改 frontmatter。

`draft: true` 的筆記在正式 build 完全不產生頁面（不只是從列表隱藏），`npm run dev` 時則照樣顯示，方便本機預覽。

## 每篇筆記的 frontmatter schema

**一般筆記**（research / essay，用 `post.njk`）。以下欄位全部選填，列出來只是說明有哪些可以用：

```yaml
---
title:   標題
type:    research           # research | literature | essay（選填，預設用資料夾名）
date:    2026-06-28
updated: 2026-06-29         # 選填
tags:    [CV, YOLO, 養殖]
summary: 一句話摘要（列表頁、首頁卡片、搜尋、RSS 都會用到）
draft:   false
math:    true               # 不用寫：內文有公式會自動偵測
---
```

**文獻筆記**（literature，用 `paper.njk`）：只要比一般筆記多填一個 `link`（論文網址，選填），標題下會出現「論文 ↗」按鈕：

```yaml
---
title:   標題
date:    2026-06-28
tags:    [文獻, dataset, CV]
summary: 一句話摘要
link:    https://arxiv.org/abs/xxxx.xxxxx
draft:   false
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

- **隨筆專屬版型**：目前沿用 `post.njk`，如果想要不同排版，比照 `notes/literature/literature.11tydata.js` 的做法，在對應資料夾放一個 `xxx.11tydata.js` 覆寫 `layout`，再新增一支 `_includes/xxx.njk`。
- **標籤頁**（例如 `/tags/CV/`）：目前標籤過濾是在 `/notes/` 頁面用前端 JS 做的（網址 `?tag=CV` 可分享），如果想要每個標籤有獨立靜態頁面（SEO 更好），可以用 Eleventy 的 `addCollection` + pagination 另外產生。
- **搜尋升級成語意搜尋**：現在是 Fuse.js 關鍵字模糊搜尋，之後想做 embedding-based 語意搜尋需要另外接一個小 API，不影響靜態網站本體。
