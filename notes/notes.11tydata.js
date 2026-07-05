// 放在 notes/ 根目錄：Obsidian 裡每個子資料夾（type）都會繼承這個預設值。
// 也可以在單篇 md 的 frontmatter 裡覆寫（例如 literature/ 用 literature.11tydata.js 覆寫 layout）。
export default {
  layout: "post.njk",
  permalink: "/notes/{{ page.fileSlug }}/index.html",
};
