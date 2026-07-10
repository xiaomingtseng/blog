(function () {
  var STORAGE_KEY = "deepwater-sidebar";

  function apply(collapsed) {
    document.documentElement.setAttribute("data-sidebar", collapsed ? "collapsed" : "expanded");
    document.querySelectorAll("[data-sidebar-glyph]").forEach(function (el) {
      el.textContent = collapsed ? "›" : "‹";
    });
    document.querySelectorAll("[data-sidebar-toggle]").forEach(function (el) {
      el.setAttribute("aria-label", collapsed ? "展開側欄" : "收合側欄");
    });
  }

  apply(document.documentElement.getAttribute("data-sidebar") === "collapsed");

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-sidebar-toggle]");
    if (!btn) return;
    var collapsed = document.documentElement.getAttribute("data-sidebar") !== "collapsed";
    localStorage.setItem(STORAGE_KEY, collapsed ? "collapsed" : "expanded");
    apply(collapsed);
  });
})();
