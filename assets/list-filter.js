(function () {
  var page = document.querySelector("[data-list-page]");
  if (!page) return;

  var rows = Array.prototype.slice.call(page.querySelectorAll("[data-list-row]"));
  var typeChips = Array.prototype.slice.call(page.querySelectorAll("[data-type-chip]"));
  var tagChips = Array.prototype.slice.call(page.querySelectorAll("[data-tag-chip]"));
  var activeRow = page.querySelector("[data-active-filters]");
  var countEl = page.querySelector("[data-result-count]");
  var clearBtn = page.querySelector("[data-clear-filters]");

  var params = new URLSearchParams(window.location.search);
  var state = {
    type: params.get("type") || null,
    tags: params.getAll("tag").filter(Boolean),
  };

  function syncUrl() {
    var next = new URLSearchParams();
    if (state.type) next.set("type", state.type);
    state.tags.forEach(function (t) { next.append("tag", t); });
    var qs = next.toString();
    history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
  }

  function apply() {
    var visible = 0;
    rows.forEach(function (row) {
      var rowType = row.getAttribute("data-type");
      var rowTags = (row.getAttribute("data-tags") || "").split(",").filter(Boolean);
      var typeOk = !state.type || rowType === state.type;
      var tagsOk = !state.tags.length || state.tags.every(function (t) { return rowTags.indexOf(t) !== -1; });
      var show = typeOk && tagsOk;
      row.style.display = show ? "" : "none";
      if (show) visible++;
    });

    typeChips.forEach(function (chip) {
      chip.classList.toggle("is-active", chip.getAttribute("data-type-chip") === state.type);
    });
    tagChips.forEach(function (chip) {
      chip.classList.toggle("is-active", state.tags.indexOf(chip.getAttribute("data-tag-chip")) !== -1);
    });

    if (activeRow) {
      var pills = activeRow.querySelectorAll("[data-pill]");
      pills.forEach(function (p) { p.remove(); });
      var hasFilter = state.type || state.tags.length;
      activeRow.style.display = hasFilter ? "" : "none";
      if (hasFilter) {
        var frag = document.createDocumentFragment();
        if (state.type) frag.appendChild(makePill(state.type, "type"));
        state.tags.forEach(function (t) { frag.appendChild(makePill(t, "tag")); });
        activeRow.insertBefore(frag, activeRow.querySelector("[data-clear-filters]"));
      }
    }
    if (countEl) countEl.textContent = visible + " 篇結果";
  }

  function makePill(label, kind) {
    var span = document.createElement("span");
    span.setAttribute("data-pill", "1");
    span.className = kind === "type" ? "type-chip is-active" : "tag-chip is-active";
    span.style.cursor = "pointer";
    span.innerHTML = label + " <span style=\"opacity:.75\">✕</span>";
    span.addEventListener("click", function () {
      if (kind === "type") state.type = null;
      else state.tags = state.tags.filter(function (t) { return t !== label; });
      apply(); syncUrl();
    });
    return span;
  }

  typeChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var v = chip.getAttribute("data-type-chip");
      state.type = state.type === v ? null : v;
      apply(); syncUrl();
    });
  });

  tagChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var v = chip.getAttribute("data-tag-chip");
      var idx = state.tags.indexOf(v);
      if (idx === -1) state.tags.push(v); else state.tags.splice(idx, 1);
      apply(); syncUrl();
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      state = { type: null, tags: [] };
      apply(); syncUrl();
    });
  }

  apply();
})();
