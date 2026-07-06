import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import footnote from "markdown-it-footnote";
import katex from "markdown-it-katex";
import anchor from "markdown-it-anchor";
import { DateTime } from "luxon";

const SITE = {
  title: "深水筆記 Deepwater",
  description: "研究歷程、文獻批註與留學生活紀錄。", // ← 側欄小簡介，換成你想要的文案
  url: "https://xiaomingtseng.github.io", // ← GitHub Pages 網址的 origin（不含 /blog；子路徑由下面 pathPrefix 統一處理）
  author: "Brian Tseng", // ← 側欄作者名稱
  github: "https://github.com/xiaomingtseng",        // ← 側欄 GitHub 連結
};

// 四個文章類型（type facet）；顏色對齊版型的 --c-* token
const TYPES = {
  research:   { label: "研究筆記",   color: "#3b5bdb" },
  literature: { label: "文獻筆記",   color: "#0b8a6b" },
  idea:       { label: "想法 / 靈感", color: "#c2410c" },
  life:       { label: "留學生活",   color: "#7c3aed" },
};

export default function (eleventyConfig) {
  // ---- Markdown：語法高亮 + footnote + KaTeX（LaTeX 於 build 預渲染）+ 標題自動 id（給側欄目錄用）----
  const md = markdownIt({ html: true, linkify: true, typographer: true })
    .use(footnote)
    .use(katex)
    .use(anchor, {
      level: [2, 3],
      slugify: (s) =>
        String(s)
          .trim()
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
          .replace(/(^-|-$)/g, ""),
    });
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addPlugin(syntaxHighlight);

  // ---- 閱讀時間（build-time 計算，不用手填 frontmatter）----
  eleventyConfig.addFilter("readingTime", (content) => {
    const text = String(content || "").replace(/<[^>]*>/g, "");
    const cjk = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const words = (text.match(/[A-Za-z0-9]+/g) || []).length;
    // 中文抓字數 / 500 分鐘，英文抓詞數 / 200 分鐘，取合計無條件進位
    const minutes = Math.max(1, Math.ceil(cjk / 500 + words / 200));
    return minutes;
  });

  // ---- 相關文章：依標籤重疊數排序，排除自己 ----
  eleventyConfig.addFilter("related", (posts, currentUrl, currentTags, n) => {
    const tags = new Set(currentTags || []);
    return (posts || [])
      .filter((p) => p.url !== currentUrl)
      .map((p) => {
        const overlap = (p.data.tags || []).filter((t) => tags.has(t)).length;
        return { p, overlap };
      })
      .filter((x) => x.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, n || 2)
      .map((x) => x.p);
  });

  // ---- 日期格式化（Eleventy 3.x 不再內建 date filter，用 luxon 自己補一個）----
  eleventyConfig.addFilter("date", (dateObj, format) => {
    if (!dateObj) return "";
    const dt = DateTime.fromJSDate(new Date(dateObj), { zone: "utc" });
    return dt.toFormat(format || "yyyy-MM-dd");
  });

  // ---- 陣列截取（nunjucks 內建的 slice 語意跟 JS array.slice 不同，另外提供一個）----
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

  // 靜態資產：Obsidian 的附件資料夾（圖片）、自訂 CSS/JS，與 KaTeX / Fuse.js 的 vendor 檔
  eleventyConfig.addPassthroughCopy({ "notes/attachments": "attachments" });
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({
    "node_modules/katex/dist/katex.min.css": "assets/vendor/katex.min.css",
    "node_modules/katex/dist/fonts": "assets/vendor/fonts",
    "node_modules/fuse.js/dist/fuse.min.mjs": "assets/vendor/fuse.min.mjs",
  });

  // ---- Collections：依 type 分組，草稿排除 ----
  const published = (c) =>
    c.getFilteredByGlob("notes/**/*.md").filter((p) => !p.data.draft);

  eleventyConfig.addCollection("posts", (c) =>
    published(c).sort((a, b) => b.date - a.date)
  );
  for (const key of Object.keys(TYPES)) {
    eleventyConfig.addCollection(key, (c) =>
      published(c)
        .filter((p) => p.data.type === key)
        .sort((a, b) => b.date - a.date)
    );
  }

  // ---- 全站標籤清單（給列表頁的過濾 UI）----
  eleventyConfig.addCollection("allTags", (c) => {
    const set = new Set();
    published(c).forEach((p) => (p.data.tags || []).forEach((t) => set.add(t)));
    return [...set].sort();
  });

  // ---- 前端搜尋索引：build 時匯出 /search-index.json ----
  eleventyConfig.addCollection("searchIndex", (c) => {
    // 用 addGlobalData 產檔更直接，這裡以 collection 觸發 template（見 search-index.njk）
    return published(c).map((p) => ({
      title: p.data.title,
      url: p.url,
      type: p.data.type,
      tags: p.data.tags || [],
      summary: p.data.summary || "",
      date: p.date.toISOString().slice(0, 10),
    }));
  });

  // ---- RSS：build 產 /feed.xml（最新 20 篇）----
  // htmlBasePluginOptions.extensions: "" 是關掉這個外掛預設會啟用、套用到全站 .html
  // 輸出的自動 pathPrefix 轉換（Eleventy 內建的 html-base plugin）。不關掉的話，同一個
  // pathPrefix 在這個版本的組合下會被算兩次，全站連結/資源路徑都會多一段 /blog。
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "posts", limit: 20 },
    metadata: {
      language: "zh-Hant",
      title: SITE.title,
      base: SITE.url,
      author: { name: SITE.author },
    },
    htmlBasePluginOptions: { extensions: "" },
  });

  // 給模板用的常數
  eleventyConfig.addGlobalData("SITE", SITE);
  eleventyConfig.addGlobalData("TYPES", TYPES);

  return {
    dir: { input: ".", includes: "_includes", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: "/blog/",
  };
}
