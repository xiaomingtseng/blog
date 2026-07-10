(function () {
  var nav = document.querySelector("[data-toc-nav]");
  var body = document.querySelector(".post-body");
  if (!nav || !body) return;

  var headings = Array.prototype.slice.call(body.querySelectorAll("h2[id]"));
  if (!headings.length) {
    var wrap = nav.closest(".post-toc");
    if (wrap) wrap.style.display = "none";
    var layout = wrap && wrap.closest(".post-layout");
    if (layout) layout.classList.add("no-toc");
    return;
  }

  headings.forEach(function (h, i) {
    var a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    if (i === 0) a.classList.add("is-active");
    nav.appendChild(a);
  });

  var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-10% 0px -70% 0px" }
  );
  headings.forEach(function (h) { observer.observe(h); });
})();
