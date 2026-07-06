import Fuse from "./vendor/fuse.min.mjs";

(function () {
  var input = document.querySelector("[data-search-input]");
  var results = document.querySelector("[data-search-results]");
  if (!input || !results) return;

  var base = (window.DEEPWATER_BASE || "/").replace(/\/$/, "");
  var fuse = null;
  fetch(base + "/search-index.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      fuse = new Fuse(data, { keys: ["title", "summary", "tags"], threshold: 0.35 });
    })
    .catch(function () {
      /* 搜尋索引載入失敗時，安靜地停用搜尋，不影響其他功能 */
    });

  function render(items) {
    results.innerHTML = "";
    if (!items.length) {
      results.innerHTML = '<div class="rh-search-empty">找不到符合的筆記</div>';
      results.classList.add("is-open");
      return;
    }
    items.slice(0, 8).forEach(function (r) {
      var a = document.createElement("a");
      a.href = r.item.url;
      a.textContent = r.item.title;
      results.appendChild(a);
    });
    results.classList.add("is-open");
  }

  input.addEventListener("input", function () {
    var q = input.value.trim();
    if (!q || !fuse) {
      results.classList.remove("is-open");
      return;
    }
    render(fuse.search(q));
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-search-wrap]")) {
      results.classList.remove("is-open");
    }
  });
})();
