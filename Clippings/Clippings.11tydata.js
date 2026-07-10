// 放在 Clippings/ 根目錄：維持在 Obsidian 原本的資料夾位置，不搬進 notes/。
// 給獨立的 layout + 網址（/clippings/<檔名>/），但不進 collections.posts，
// 所以不會出現在側欄導覽、標籤雲、搜尋或 /notes/ 列表裡，只能透過連結（含 wikilink）進入。
export default {
  layout: "clipping.njk",
  permalink: "/clippings/{{ page.fileSlug }}/index.html",
};
