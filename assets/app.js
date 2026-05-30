// 西窗 · 渲染与交互
(function () {
  "use strict";

  var DYNASTY_TONE = { "唐": "tang", "宋": "song" };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderPoem(p, index) {
    var article = el("article", "poem form-" + (p.form === "词" ? "ci" : "shi"));
    article.style.setProperty("--i", index);

    // 朝代印
    var stamp = el("span", "dynasty " + (DYNASTY_TONE[p.dynasty] || ""), p.dynasty);
    article.appendChild(stamp);

    // 标题
    var head = el("div", "poem-head");
    if (p.form === "词" && p.tune) {
      head.appendChild(el("h2", "tune", p.tune));
      if (p.title) head.appendChild(el("p", "subtitle", p.title));
    } else {
      head.appendChild(el("h2", "title", p.title || ""));
    }
    article.appendChild(head);

    // 作者
    article.appendChild(el("p", "byline", "〔" + p.dynasty + "〕" + p.author));

    // 小序
    if (p.preface) article.appendChild(el("p", "preface", p.preface));

    // 正文
    var body = el("div", "body");
    p.lines.forEach(function (line) {
      var cls = p.form === "词" ? "stanza" : "verse";
      body.appendChild(el("p", cls, line));
    });
    article.appendChild(body);

    return article;
  }

  function mount() {
    var root = document.getElementById("scroll");
    if (!root || !window.POEMS) return;
    var frag = document.createDocumentFragment();
    window.POEMS.forEach(function (p, i) {
      frag.appendChild(renderPoem(p, i));
    });
    root.appendChild(frag);
  }

  // 昼夜主题
  function initTheme() {
    var KEY = "xichuang-theme";
    var btn = document.getElementById("theme-toggle");
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved) document.documentElement.setAttribute("data-theme", saved);

    btn && btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      var next = cur === "night" ? "day" : "night";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  }

  initTheme();
  mount();
})();
