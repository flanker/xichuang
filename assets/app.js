// 西窗 · 双栏竖排阅读器
(function () {
  "use strict";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var poems = window.POEMS || [];
  var nav = document.getElementById("nav");
  var reader = document.getElementById("reader");
  var navItems = [];
  var current = -1;

  // ---------- 左栏目录 ----------
  poems.forEach(function (p, i) {
    var item = el("button", "nav-item");
    item.type = "button";
    var t = el("span", "nav-title", p.form === "词" && p.tune ? p.tune : p.title);
    var m = el("span", "nav-meta", "〔" + p.dynasty + "〕" + p.author);
    item.appendChild(t);
    item.appendChild(m);
    item.addEventListener("click", function () { select(i); });
    nav.appendChild(item);
    navItems.push(item);
  });

  // ---------- 右栏竖排 ----------
  // 词的整片按句末标点切成数列，避免单列过长
  function ciColumns(lines) {
    var cols = [];
    lines.forEach(function (stanza) {
      stanza.split(/(?<=[。！？])/).forEach(function (seg) {
        if (seg.trim()) cols.push(seg);
      });
    });
    return cols;
  }

  function column(cls, text) { return el("div", "col " + cls, text); }

  function renderPoem(p) {
    reader.innerHTML = "";
    var row = el("div", "scroll-row");

    // 题（最右列）
    var titleCol = el("div", "col r-title");
    if (p.form === "词" && p.tune) {
      titleCol.appendChild(el("span", "tune", p.tune));
      if (p.title) titleCol.appendChild(el("span", "subtitle", p.title));
    } else {
      titleCol.appendChild(el("span", "title", p.title || ""));
    }
    row.appendChild(titleCol);

    // 作者
    row.appendChild(column("r-byline", "〔" + p.dynasty + "〕" + p.author));

    // 序
    if (p.preface) row.appendChild(column("r-preface", p.preface));

    // 正文：诗逐句、词逐句（切分后）
    var cols = p.form === "词" ? ciColumns(p.lines) : p.lines.slice();
    cols.forEach(function (line) { row.appendChild(column("r-line", line)); });

    reader.appendChild(row);
  }

  function select(i) {
    if (i === current) return;
    if (navItems[current]) navItems[current].classList.remove("on");
    current = i;
    navItems[current].classList.add("on");
    renderPoem(poems[i]);
  }

  // 键盘上下切换
  window.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); select(Math.min(poems.length - 1, current + 1)); }
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); select(Math.max(0, current - 1)); }
  });

  // ---------- 昼夜主题 ----------
  (function theme() {
    var KEY = "xichuang-theme";
    var btn = document.getElementById("theme-toggle");
    try { var saved = localStorage.getItem(KEY); if (saved) document.documentElement.setAttribute("data-theme", saved); } catch (e) {}
    btn && btn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "night" ? "day" : "night";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  })();

  if (poems.length) select(0);
})();
