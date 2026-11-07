// 放在 notes/ 根目錄：Obsidian 裡每個子資料夾（type）都會繼承這個預設值。
// 也可以在單篇 md 的 frontmatter 裡覆寫（例如 literature/ 用 literature.11tydata.js 覆寫 layout）。
import path from "node:path";
import { TYPES } from "../eleventy.config.js";

export default {
  layout: "post.njk",
  permalink: "/notes/{{ page.fileSlug }}/index.html",
  // 沒寫 date 的筆記用「第一次 commit 進 git 的日期」；還沒 commit 的檔案 Eleventy 會退回現在時間。
  // （CI 的 checkout 要 fetch-depth: 0 才拿得到完整歷史，見 deploy.yml）
  date: "git Created",
  // frontmatter 沒寫才補：讓「什麼都沒寫」的筆記也能正確顯示
  eleventyComputed: {
    // type 從資料夾推：notes/<type>/xxx.md；不是 TYPES 裡的資料夾（例如 inbox）就維持原值
    type: (data) => {
      if (data.type) return data.type;
      const folder = path.normalize(data.page.inputPath).split(path.sep).at(-2);
      return folder in TYPES ? folder : data.type;
    },
    // title 沒寫就用檔名（不 slugify，保留中文與空白）
    title: (data) => data.title || path.basename(data.page.inputPath, ".md"),
  },
};
